# INK v1.6.3 Vector Watercolor Capability Mapping

| Video Step | Illustrator Capability | INK Existing/New Capability | Execution Classification | Missing Module | Required Material | Required Dependency | Deterministic Risk | Stable ID Risk | Proposed Minimum Remediation |
|---|---|---|---|---|---|---|---|---|---|
| Perspective/Fold | Non-destructive petal deformation | New deformation parameter record | EQUIVALENT | Exact video fold operation | Editable path | None | Low | Low | Keep minimal reversible model |
| Ellipse | Illustrator pathItems.ellipse | Parser → canonical path → Recipe | DIRECT | General JSX expression scope | None | None | Low | Low | Whitelist numeric expressions |
| Rectangle | Illustrator pathItems.rectangle | Parser → canonical path → Recipe | DIRECT | General JSX expression scope | None | None | Low | Low | Whitelist numeric expressions |
| Math.sin/cos/PI | Illustrator JavaScript math | Deterministic expression IR | DIRECT | Broad JS language | None | None | Low | Low | Keep whitelist |
| Math.random | Illustrator JavaScript random | Seeded bounded/indexed random | EQUIVALENT | Native unseeded randomness intentionally rejected | None | Seed | Low | Low | Require explicit seed |
| Composition | Artboard and object placement | Safe margin, clipping, dominance proxy | EQUIVALENT | Professional auto-layout reasoning | Semantic roles | None | Low | Medium | Report violations; do not claim automatic design |
| Brush Material | Illustrator watercolor Brush | Versioned vector Brush Material | APPROXIMATED | Exact brush asset and internals | Brush record | Original licensed brush | Medium | Low | Track source and validation state |
| Brush along Path | Art Brush on editable Path | Deterministic layered vector strokes | APPROXIMATED | Exact edge texture | Vector Brush Material | Brush asset | Low | Low | Preserve source path |
| Transparency/Blend | Opacity and blend mode | Object/group/layer opacity and mix-blend-mode | EQUIVALENT | Illustrator pixel equivalence | None | Renderer | Medium | Low | SVG/PNG regression |
| Paper texture | Paper grain or texture | Hybrid reference only | UNSUPPORTED | Raster texture engine | Paper reference | Raster asset | High | Low | Do not render without asset |
