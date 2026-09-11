# Migration: INK v1.5.0 to v1.5.1

v1.5.1 is an in-place compatible upgrade. `.ink` `formatVersion` remains 4. Existing AI Command, Recipe, Preview, selective edit, audit, rollback, vector, raster, stroke, brush, import, validation and calibration structures are retained.

New CHAT connection settings and credentials are runtime-only. Credential values are never migrated into or serialized with a document. Existing v1.5.0 documents load with default `PROPOSE` permission and no external connection.

If a Plan was created before the document changed, rebuild its Context and Preview. v1.5.1 checks document, layer, target, selection, capability and asset hashes before execution and does not apply a stale Plan automatically.
