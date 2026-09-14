# INK Device Validation Tool

Location: `qa/device-validation/device-validation.html`

Purpose: retained as a QA / engineering validation page for stylus and touch-device testing. It is not a product entry point and is not required for INK Runtime startup.

Current checks include stylus sampling, pressure range, start/end stroke feel, latency, jitter, turns, long-stroke stability, fast-stroke tracking, tilt, eraser behavior, palm rejection, and overall manual feel.

Runtime ownership remains under the INK input modules (for example `product/source/src/input/`). Moving this page out of `product/source/` does not remove or disable the main program's stylus functionality.

Keep this tool available for future device validation and regression checks when stylus behavior is being tuned or re-verified.
