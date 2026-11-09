# Circuit Studio — Technical Plan

## Product decisions
- Integrated ElectroLab module at /circuit-studio.
- Three modes: Schematic, Breadboard, Panel Layout.
- ElectroLab visual identity; do not clone Fritzing UI.
- Keep the existing Electrical Workspace and its Zustand store intact.
- Target broad Fritzing compatibility through a dedicated import/export layer.

## Existing architecture inspected
- Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 4, Zustand 5.
- Component catalog: src/data/components/ (73 definitions).
- Electrical Workspace: custom SVG canvas and WorkspaceDocument containing placed components and wires.
- Terminal validation and routing live in src/electrical-engine/connections.
- Existing persisted draft uses localStorage; no general project interchange or circuit solver exists yet.

## Proposed module boundaries
- app/circuit-studio/page.tsx
- components/circuit-studio/: CircuitStudioView, StudioToolbar, StudioCanvas, StudioLibrary, StudioInspector
- circuit-studio/model/: mode-neutral project and view state
- circuit-studio/adapters/electrolab/: map compatible ElectroLab components/nets
- circuit-studio/adapters/fritzing/: import/export boundary
- circuit-studio/formats/fz/: .fz XML parser/writer
- circuit-studio/formats/fzz/: ZIP container reader/writer
- circuit-studio/formats/fzp/: part metadata and connector mapping
- circuit-studio/formats/fzpz/: bundled part package
- circuit-studio/formats/fzb-fzbz/: parts-bin support
- circuit-studio/renderers/: schematic, breadboard, PCB, panel
- circuit-studio/validation/: compatibility and safety checks

## Compatibility target
1. Read and validate .fzz ZIP bundles; locate the .fz sketch and embedded custom parts.
2. Parse .fz XML into a neutral project model without dropping unknown XML fields.
3. Resolve .fzp metadata, connector IDs, buses, view SVG references, and terminal points.
4. Support .fzpz custom-part bundles and .fzb / .fzbz part-bin files.
5. Preserve instance IDs, connector IDs, properties, wires/traces, per-view geometry, and unsupported metadata on round-trip.
6. Export .fzz and .fzpz only after round-trip fixtures pass.
7. Add compatibility fixtures from real Fritzing examples and compare import/export results.

Fritzing sketches have breadboard, schematic, and PCB views. Panel Layout is an ElectroLab-native view and must not be misrepresented as a Fritzing-native view. A Fritzing file may not contain a panel view.

## Important engineering rules
- Do not copy Qt/C++ application code into the Next.js runtime.
- Do not assume every Fritzing SVG feature is supported by browser SVG; sanitize and test imported SVGs.
- Keep unknown XML nodes/attributes in an extension payload to avoid destructive round-trips.
- Treat moduleId, modelIndex, connector IDs, terminal IDs, buses, and view-specific geometry as stable identifiers.
- Keep imported Fritzing parts isolated from the existing 73-part ElectroLab catalog until mapping is verified.
- Never silently invent missing connectors or terminal positions.
- Do not claim full compatibility until tested against real .fzz, .fz, .fzpz, and .fzbz fixtures.
- Respect upstream licensing and attribution. Review GPL-3.0 source-code obligations and CC BY-SA obligations for reused documentation, graphics, and parts before redistribution.

## Delivery phases
- Phase A (current): integrated route, three-mode UI shell, reuse catalog for discovery, technical architecture.
- Phase B: neutral document model, schema validation, safe ZIP/XML dependencies, fixture harness.
- Phase C: .fz / .fzz import with preservation of unknown fields and custom parts.
- Phase D: actual canvas interactions, component placement, wire editing, undo/redo, project persistence.
- Phase E: .fzp / .fzpz part resolution and library browser.
- Phase F: Breadboard and PCB renderers; panel layout renderer as ElectroLab-native.
- Phase G: export, round-trip compatibility tests, migration to/from compatible ElectroLab circuits.
- Phase H: performance, accessibility, security, and regression testing.

## Current status
The first implementation is a UI foundation only. Component selection currently creates a session-only design list; it does not yet place objects on a coordinate canvas, create wires, parse Fritzing files, or save a Circuit Studio project.
