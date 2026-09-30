# Photoshop UI Reference Authority

This folder is the durable GitHub reference authority for the INK Photoshop-alignment program.

## Stored reference assets

- `reference/ui/photoshop/ps-1.png` — original Photoshop structural reference. Blob: `3862dcb076f00796b7f71d981dba35f2ae8fd108`.
- `reference/ui/photoshop/PS-2.png` — original Photoshop structural / collapsed-state reference. Blob: `d2706106d3c1b484c1fb63603e761aa9ea99fc0d`.
- `reference/ui/photoshop/PS-3.png` — Photoshop Preferences / UI-detail reference. Blob: `8df6f2df2049d020725d31f6ff017acf6d4a61ae`.
- `reference/ui/photoshop/PvsI-1.png` — USER-selected Photoshop ↔ INK comparison reference. Blob: `ac93b52ceeb7b87de47fb03247a5aa910a930dc7`.
- `reference/ui/photoshop/PvsI-2.png` — USER-selected Photoshop ↔ INK comparison reference. Blob: `0ea63f34981b8b31b9d20f2b9e61a62c17698f45`.
- `reference/ui/photoshop/PvsI-3.png` — USER-selected Photoshop ↔ INK comparison reference. Blob: `a37083853892a856f3189c32d29b9a237fa6f4a9`.

## Authority

`ps-* / PS-*` files are upstream Photoshop reference artifacts.

`PvsI-*` files are the current USER-selected comparison authority for structure, dimensions, density, grouping and control grammar.

The USER-locked INK light palette remains an explicit override; Photoshop dark colors are not the target palette.

Executors must inspect these exact repository assets. If a specific tool cannot render repository binary images directly, it may materialize/download the exact raw asset or use an attached mirror of the same file; the GitHub path/blob remains the authority.

Do not replace these files with re-created approximations unless the USER explicitly approves the replacement.