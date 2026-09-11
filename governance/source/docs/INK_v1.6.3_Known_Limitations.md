# INK v1.6.3 RC Known Limitations

- The exact third-party Dagubi Illustrator brush artwork, internal parameters, and license-cleared asset are not embedded.
- The primary custom brush subtype and whether its internal artwork contains raster texture remain unresolved; INK therefore uses the evidence-supported name `generic vector path brush`.
- VW-VIDEO-01 demonstrates procedural equivalence, not pixel equivalence with Adobe Illustrator.
- The complete tutorial workflow is Hybrid because an embedded RGB paper image at 250 ppi is observed; the source paper asset is not redistributed.
- Pigment absorption, granulation, diffusion, and physical paper interaction are not simulated.
- Spirograph translation still has unsupported operations outside the validated whitelist.
- Illustrator cross-host pixel equivalence remains external validation pending.
