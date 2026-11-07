# ElectroLab Asset Collector

Asset Collector is a local Node/TypeScript workflow for discovering component images and importing only human-approved assets.

## Data sources

1. **Openverse** is queried automatically for openly licensed images. The collector only lists CC0, Public Domain Mark, CC BY and CC BY-SA candidates. Non-commercial and no-derivatives licenses are excluded from the automatic candidate list.
2. **Official manufacturer media** is handled as a curated source. Start from official product/documentation portals and record the exact product reference, asset URL, usage rights, required credit and permission evidence. Do not scrape manufacturer websites or assume that a product photo is free to redistribute.
   - Siemens documentation and CAx downloads: https://www.siemens.com/en-us/support/documentation-downloads/
   - Schneider Electric Product Catalog API: https://api-explorer.se.com/en/api/product-catalog-v2
   - Schneider Electric Product Digital Asset API: https://api-explorer.se.com/en/api/product-digital-asset-v1

Some manufacturer catalog APIs require OAuth, onboarding or contractual access. The initial collector does not pretend to bypass those requirements.

## Commands

Discover a small batch first:

\`\`\`bash
npm run assets:discover
\`\`\`

Discover all catalog components:

\`\`\`bash
npm run assets:discover -- --all
\`\`\`

Limit discovery to a category:

\`\`\`bash
npm run assets:discover -- --all --category=control
\`\`\`

The script writes candidate metadata to \`src/data/assets/asset-candidates.json\`. It does not download or publish any candidate automatically.

## Review and approval

For each candidate, verify:

- It depicts the intended component, not a similar-looking product.
- The front view is clear enough for the intended workspace.
- The actual terminal labels and terminal positions can be verified from the exact model's datasheet/manual.
- The license permits the intended use and redistribution.
- Required creator attribution and license links are retained.

Copy approved candidate records into \`src/data/assets/approved-assets.json\` and add \`"approved": true\`. For CC BY / CC BY-SA, keep a non-empty \`attribution\`. Do not approve assets whose rights are unclear.

For official manufacturer media, use the same approved record format only after the specific asset's usage rights have been confirmed. The asset record must include source page, license/rights details and required credit. Never mark an asset approved merely because it appears on an official website.

## Download approved assets

\`\`\`bash
npm run assets:download
\`\`\`

The downloader accepts HTTPS images only, supports JPEG/PNG/WebP/AVIF, and limits files to 8 MB. It writes physical assets to \`public/assets/physical/\` and updates \`src/data/assets/asset-manifest.json\`.

## Important: terminal mapping is a separate review

An image being approved for use does not mean its terminal geometry is approved. Do not create terminal hotspots from guessed image coordinates. Record terminal IDs and normalized x/y positions only after checking the exact product model and a reliable front view/datasheet. A different product variant can have different terminal layout.

The current MVP discovers image candidates and downloads approved image files. It does not yet automatically extract terminal coordinates, generate schematic symbols from photographs, or alter the component catalogue. Those require a later visual-review and terminal-mapping UI.
