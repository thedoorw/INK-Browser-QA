# INK UI REBUILD 001 — G7 Brand Contract Evidence

STATUS: `G7_BRAND_CONTRACT / SOURCE_PASS`

Approved visible-logo source authority:

```text
SOURCE_NAME = W-300.jpg
STAGING_PATH = /INK-DEV-ASSET-STAGING/INK_APPROVED_VISIBLE_LOGO_W-300.jpg
DIMENSIONS = 300x300
BYTES = 19801
SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
ROLE = OFFICIAL_INK_VISIBLE_LOGO
```

## Asset transfer verification

Before source mutation, DEV materialized the exact staged JPEG and verified:

```text
SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
DIMENSIONS = 300x300
BYTES = 19801
JPEG = PASS
```

The approved bytes were then committed to:

`product/source/assets/INK_MARK_SOURCE_W-300.jpg`

Asset installation checkpoint:

`c50e10aec6826876ee6b7cedc8af9271538b7274`

GitHub re-fetch proof:

```text
GIT_BLOB_SHA = bb640a245af35c993c4fe322fbe8744830e872b6
BYTE_LENGTH = 19801
GITHUB_BASE64_EXACT_MATCH_TO_STAGING = PASS
```

Therefore GitHub is now the final SSOT for the approved visible-logo bytes.

## Visible-logo authority

Web and Portable continue to use the existing single visible-logo route:

`assets/INK_MARK_SOURCE_W-300.jpg?v=0.1`

The route appears in the application-menu mark and topbar brand placement, but the unique visible-logo asset route count is exactly one.

Focused QA now requires:

- unique visible-logo route count = 1;
- route = `assets/INK_MARK_SOURCE_W-300.jpg`;
- exact file SHA256 = `08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8`;
- visible logo must not route to `favicon.svg`;
- visible logo must not route to `ink-mark.svg`.

Focused SHA-contract checkpoint:

`1893abd440dc7401156c1bd2c7b9f2a77309f450`

## Favicon authority

Favicon remains unchanged:

`assets/favicon.svg?v=0.1`

No favicon source or route change was made in this G7 delta.

`ink-mark.svg` remains non-authoritative and was not substituted for the approved visible-logo asset.

## Gate result

```text
G7_VISIBLE_LOGO_SHA256 = 08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8
VISIBLE_LOGO_AUTHORITY = 1
FAVICON_AUTHORITY = 1
VISIBLE_LOGO_EXACT_ASSET_APPROVAL = PASS
CORE_MUTATION = 0
G7_BRAND_CONTRACT = SOURCE_PASS
```

G8 Runtime / visual evidence remains MR-owned and was not started by DEV.

`DEV_HANDOFF → STOP`
