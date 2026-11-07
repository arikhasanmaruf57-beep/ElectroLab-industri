import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { COMPONENTS } from '../../src/data/components/index';

type LicenseCode = 'cc0' | 'pdm' | 'by' | 'by-sa';

interface OpenverseImage {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  foreign_landing_url: string;
  creator?: string;
  creator_url?: string;
  license: string;
  license_version?: string;
  license_url?: string;
  attribution?: string;
  provider?: string;
  width?: number;
  height?: number;
  filetype?: string;
}

interface AssetCandidate {
  id: string;
  componentType: string;
  componentName: string;
  view: 'physical';
  sourceType: 'openverse';
  title: string;
  imageUrl: string;
  previewUrl?: string;
  sourcePage: string;
  creator?: string;
  creatorUrl?: string;
  license: string;
  licenseVersion?: string;
  licenseUrl?: string;
  attribution?: string;
  provider?: string;
  width?: number;
  height?: number;
  reviewStatus: 'needs-review';
}

interface ApprovedAsset {
  id: string;
  componentType: string;
  componentName: string;
  view: 'physical';
  sourceType: 'openverse' | 'manufacturer';
  title: string;
  imageUrl: string;
  sourcePage: string;
  creator?: string;
  attribution?: string;
  license: string;
  licenseVersion?: string;
  licenseUrl?: string;
  provider?: string;
  approved: true;
  /** Required for manufacturer assets: documented permission/rights evidence. */
  rightsStatus?: 'approved';
  rightsEvidence?: string;
  /** Optional override for the generated filename. */
  filename?: string;
}

const ROOT = process.cwd();
const CANDIDATES_FILE = path.join(ROOT, 'src/data/assets/asset-candidates.json');
const APPROVED_FILE = path.join(ROOT, 'src/data/assets/approved-assets.json');
const MANIFEST_FILE = path.join(ROOT, 'src/data/assets/asset-manifest.json');
const PHYSICAL_DIR = path.join(ROOT, 'public/assets/physical');
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_LICENSES = new Set<LicenseCode>(['cc0', 'pdm', 'by', 'by-sa']);

const SEARCH_TERMS: Record<string, string> = {
  'mcb-1p': 'miniature circuit breaker MCB front product photo',
  'mcb-2p': 'double pole miniature circuit breaker front product photo',
  'mcb-3p': 'three pole miniature circuit breaker front product photo',
  'mccb-3p': 'molded case circuit breaker front product photo',
  'rccb-2p': 'residual current circuit breaker RCCB front product photo',
  'contactor-3p': 'three pole magnetic contactor front product photo screw terminals',
  'pb-start-no': 'industrial green push button normally open contact block',
  'pb-stop-nc': 'industrial red push button normally closed contact block',
  estop: 'industrial emergency stop mushroom push button contact block',
  'motor-3p-6t': 'three phase induction motor terminal box six terminals',
  'motor-3p-3t': 'three phase induction motor terminal box',
  'overload-relay': 'thermal overload relay front product photo terminals',
};

const OFFICIAL_REFERENCE_SOURCES = [
  {
    name: 'Siemens SiePortal / CAx downloads',
    url: 'https://www.siemens.com/en-us/support/documentation-downloads/',
    note: 'Official product documentation and CAx downloads. Check per-asset usage rights before redistribution.',
  },
  {
    name: 'Schneider Electric Product Catalog API',
    url: 'https://api-explorer.se.com/en/api/product-catalog-v2',
    note: 'Product data and media metadata; API access requires OAuth/onboarding.',
  },
  {
    name: 'Schneider Electric Product Digital Asset API',
    url: 'https://api-explorer.se.com/en/api/product-digital-asset-v1',
    note: 'Product visual assets including 360-degree and 3D media; API access requires OAuth.',
  },
];

function parseArg(name: string): string | undefined {
  const prefix = `${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function safeSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'asset';
}

function queryFor(component: (typeof COMPONENTS)[number]): string {
  return SEARCH_TERMS[component.type] ??
    `${component.name} electrical component industrial product front view`;
}

function isAllowedLicense(license: string): license is LicenseCode {
  return ALLOWED_LICENSES.has(license as LicenseCode);
}

async function searchOpenverse(query: string): Promise<OpenverseImage[]> {
  const url = new URL('https://api.openverse.org/v1/images/');
  url.searchParams.set('q', query);
  url.searchParams.set('page_size', '8');
  url.searchParams.set('license', 'cc0,pdm,by,by-sa');
  url.searchParams.set('mature', 'false');

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ElectroLab-AssetCollector/0.1 (open-source educational project)' },
      signal: AbortSignal.timeout(20000),
    });
    if (response.ok) {
      const payload = await response.json() as { results?: OpenverseImage[] };
      return (payload.results ?? []).filter((item) =>
        isAllowedLicense(item.license) &&
        typeof item.url === 'string' &&
        item.url.startsWith('https://') &&
        (item.filetype === 'jpg' || item.filetype === 'jpeg' || item.filetype === 'png' || item.filetype === 'webp')
      );
    }
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Openverse returned HTTP ${response.status} for "${query}"`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
  }
  throw new Error(`Openverse request failed after retries: "${query}"`);
}

async function discover(): Promise<void> {
  const limit = parseArg('--limit');
  const all = process.argv.includes('--all');
  const category = parseArg('--category');
  const max = all ? COMPONENTS.length : Math.max(1, Number(limit ?? 12));
  const targets = COMPONENTS
    .filter((component) => !category || component.category === category)
    .slice(0, max);

  const candidates: AssetCandidate[] = [];
  const failures: Array<{ componentType: string; error: string }> = [];

  console.log(`ElectroLab Asset Collector: searching ${targets.length} catalog components...`);
  for (const [index, component] of targets.entries()) {
    const query = queryFor(component);
    try {
      const results = await searchOpenverse(query);
      for (const result of results) {
        candidates.push({
          id: `openverse-${result.id}-${component.type}`,
          componentType: component.type,
          componentName: component.name,
          view: 'physical',
          sourceType: 'openverse',
          title: result.title,
          imageUrl: result.url,
          ...(result.thumbnail ? { previewUrl: result.thumbnail } : {}),
          sourcePage: result.foreign_landing_url,
          ...(result.creator ? { creator: result.creator } : {}),
          ...(result.creator_url ? { creatorUrl: result.creator_url } : {}),
          license: result.license,
          ...(result.license_version ? { licenseVersion: result.license_version } : {}),
          ...(result.license_url ? { licenseUrl: result.license_url } : {}),
          ...(result.attribution ? { attribution: result.attribution } : {}),
          ...(result.provider ? { provider: result.provider } : {}),
          ...(result.width ? { width: result.width } : {}),
          ...(result.height ? { height: result.height } : {}),
          reviewStatus: 'needs-review',
        });
      }
      console.log(`[${index + 1}/${targets.length}] ${component.type}: ${results.length} candidates`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ componentType: component.type, error: message });
      console.warn(`[${index + 1}/${targets.length}] ${component.type}: ${message}`);
    }
    // Be polite to the free public API.
    if (index < targets.length - 1) await new Promise((resolve) => setTimeout(resolve, 1100));
  }

  await mkdir(path.dirname(CANDIDATES_FILE), { recursive: true });
  await writeFile(CANDIDATES_FILE, JSON.stringify({
    generatedAt: new Date().toISOString(),
    source: 'Openverse API',
    licensePolicy: 'Only CC0, PDM, CC BY and CC BY-SA are listed. Every candidate still requires human review.',
    officialReferenceSources: OFFICIAL_REFERENCE_SOURCES,
    scannedComponents: targets.map((component) => component.type),
    candidates,
    failures,
  }, null, 2) + '\n');

  console.log(`\nSaved ${candidates.length} candidates to src/data/assets/asset-candidates.json`);
  console.log(`${failures.length} component searches failed. Review image relevance and terminal visibility before approval.`);
}

function extensionFromMime(mime: string): string | undefined {
  const normalized = mime.split(';')[0].trim().toLowerCase();
  if (normalized === 'image/jpeg') return 'jpg';
  if (normalized === 'image/png') return 'png';
  if (normalized === 'image/webp') return 'webp';
  if (normalized === 'image/avif') return 'avif';
  return undefined;
}

async function downloadImage(asset: ApprovedAsset): Promise<{ relativePath: string; bytes: number }> {
  if (asset.approved !== true) {
    throw new Error(`Asset ${asset.id} has not been approved.`);
  }
  if (asset.sourceType === 'openverse' && !isAllowedLicense(asset.license)) {
    throw new Error(`Asset ${asset.id} has a disallowed Openverse license.`);
  }
  if (asset.sourceType === 'manufacturer' &&
      (asset.rightsStatus !== 'approved' || !asset.rightsEvidence)) {
    throw new Error(`Manufacturer asset ${asset.id} needs confirmed usage rights and rightsEvidence.`);
  }
  if (asset.sourceType === 'openverse' && !asset.attribution && (asset.license === 'by' || asset.license === 'by-sa')) {
    throw new Error(`Asset ${asset.id} requires creator attribution before download.`);
  }

  const response = await fetch(asset.imageUrl, {
    redirect: 'follow',
    signal: AbortSignal.timeout(30000),
    headers: { 'User-Agent': 'ElectroLab-AssetCollector/0.1' },
  });
  if (!response.ok) throw new Error(`Image download failed: HTTP ${response.status}`);
  if (!response.url.startsWith('https://')) throw new Error('Refusing a non-HTTPS final image URL.');

  const mime = response.headers.get('content-type') ?? '';
  const extension = extensionFromMime(mime);
  if (!extension) throw new Error(`Unsupported image content type: ${mime}`);

  const declaredLength = Number(response.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_IMAGE_BYTES) throw new Error('Image exceeds 8 MB limit.');
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error('Downloaded image is empty or exceeds 8 MB limit.');
  }

  const filename = asset.filename
    ? safeSlug(asset.filename.replace(/\.[^.]+$/, ''))
    : safeSlug(asset.componentType);
  const relativePath = `/assets/physical/${filename}.${extension}`;
  const destination = path.join(PHYSICAL_DIR, `${filename}.${extension}`);
  await mkdir(PHYSICAL_DIR, { recursive: true });
  await writeFile(destination, bytes);
  return { relativePath, bytes: bytes.byteLength };
}

async function downloadApproved(): Promise<void> {
  const openverseApproved = JSON.parse(await readFile(APPROVED_FILE, 'utf8')) as ApprovedAsset[];
  const officialFile = path.join(ROOT, 'src/data/assets/official-assets.json');
  const officialApproved = JSON.parse(await readFile(officialFile, 'utf8')) as ApprovedAsset[];
  const approved = [...openverseApproved, ...officialApproved];
  if (!Array.isArray(approved) || approved.length === 0) {
    console.log('No approved assets found. Review Openverse candidates or add rights-verified entries to official-assets.json.');
    return;
  }

  let manifest: Record<string, unknown> = {};
  try {
    manifest = JSON.parse(await readFile(MANIFEST_FILE, 'utf8')) as Record<string, unknown>;
  } catch {
    // First run: create a fresh manifest.
  }
  const entries = Array.isArray(manifest.entries) ? manifest.entries as Array<Record<string, unknown>> : [];
  const completed: Array<Record<string, unknown>> = [];

  for (const asset of approved) {
    try {
      const downloaded = await downloadImage(asset);
      const entry = {
        id: asset.id,
        componentType: asset.componentType,
        sourceType: asset.sourceType,
        view: asset.view,
        localPath: downloaded.relativePath,
        sourcePage: asset.sourcePage,
        creator: asset.creator ?? null,
        attribution: asset.attribution ?? null,
        license: asset.license,
        licenseVersion: asset.licenseVersion ?? null,
        licenseUrl: asset.licenseUrl ?? null,
        provider: asset.provider ?? null,
        verifiedByHuman: true,
        downloadedAt: new Date().toISOString(),
      };
      completed.push(entry);
      console.log(`Downloaded ${asset.componentType} -> ${downloaded.relativePath} (${downloaded.bytes} bytes)`);
    } catch (error) {
      console.error(`Skipped ${asset.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const merged = new Map(entries.map((entry) => [String(entry.id), entry]));
  for (const entry of completed) merged.set(String(entry.id), entry);
  await mkdir(path.dirname(MANIFEST_FILE), { recursive: true });
  await writeFile(MANIFEST_FILE, JSON.stringify({
    version: 1,
    updatedAt: new Date().toISOString(),
    entries: [...merged.values()],
  }, null, 2) + '\n');
  console.log(`\nManifest updated: ${completed.length} assets downloaded successfully.`);
}

async function main(): Promise<void> {
  const command = process.argv[2] ?? 'discover';
  if (command === 'discover') return discover();
  if (command === 'download') return downloadApproved();
  console.log('Usage: npm run assets:discover -- [--limit=12 | --all | --category=control]');
  console.log('       npm run assets:download');
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
