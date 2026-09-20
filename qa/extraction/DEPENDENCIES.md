# Tested / optional extraction dependencies

- ImageTracerJS 1.2.6: Unlicense, included verbatim license in vendored source.
  Upstream blob `97f6558a304ff574e176067e1ca2edfd6c06186a`,
  https://github.com/jankovicsandras/imagetracerjs/blob/master/imagetracer_v1.2.6.js
  Only UMD export tail changed to ESM/globalThis. Algorithm unchanged.
  Fixed black/white palette; no random color sampling. Browser and Node JS.
- OpenCV Python 4.13.0 (`opencv-python-headless==4.13.0.92`): benchmark only;
  Apache-2.0 plus bundled third-party notices. https://opencv.org/license/
- OpenCV.js: optional injected runtime. Not shipped with product. Runtime version
  must be passed explicitly to adapter. Execution status recorded in evidence.
- VTracer Python 0.6.15: MIT license verified in installed distribution
  `vtracer-0.6.15.dist-info/licenses/LICENSE` (copyright TSANG, Hao Fung 2024).
  https://github.com/visioncortex/vtracer — native benchmark only; injected
  converter interface is ready for a separately verified WASM build.
- SAM-class: optional source-bound binary mask input; no weights or inference
  runtime shipped. No available PyTorch/ONNX runtime or verified browser model
  bundle in repository. Model inference is NOT TESTED; threshold masks are not SAM.
- Potrace: not embedded, not executed; GPL decision remains out of scope.

Python deps were installed in disposable scratch, not product or package.
Native execution does not certify browser/WASM performance or memory.
