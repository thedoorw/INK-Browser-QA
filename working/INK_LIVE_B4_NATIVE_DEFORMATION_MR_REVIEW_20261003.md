# B4 Path deformation — MR exact-source acceptance, 2026-10-03

USER authority: AUTHORIZE_BOUNDED_EXTENSION_OF_EXISTING_DEFORMATION_CORE. Direct CHAT anchor mutation, second deformation model and FORMAT_VERSION change remain unauthorized.

Task branch: work/ink-live-path-deformation-exposure-002
Exact candidate: 938016b79e10c6ac1c06ad930be35a67654c381b
Complete product/source tree: 8d35c9a8a3f69d2f51cf02703fd78b9d8b090e4b
PR: #131

Reviewed four product files: src/editor/transform-advanced.js plans distinct bounded quads with unchanged existing math/consumers; src/vector/deformation.js rebuilds the serializable mapping and alone mutates anchors and handles from baseSubpaths; src/editor/chat-bounded-edit.js performs validation, planning and existing scoped History orchestration; src/agent/capability-registry.js exposes three bounded descriptors. No UI, raster, Document, History, Renderer redesign, pointer emulation or FORMAT_VERSION change. Latest Paper singleton repair is preserved.

Distort moves the upper-left X and upper-right Y independently while retaining the lower edge. Perspective constrains opposing edge pairs about the center. Existing xOffset/yOffset schema suffices. Folded/degenerate mappings fail before mutation. Parameters retain mode, offsets, source/destination quads and matrix. Reapplication starts from baseSubpaths; reset restores exact original geometry.

Local: 65/65 focused + legacy deformation/reset, transform-advanced projective, bounded-edit, Paint Session bounds and P1 integration tests PASS. Historical v163 suite required the local QA source symlink to current product/source; no product change was needed for that harness repair.

Hosted final request: clusterB-B4-final-candidate-regressions-003. Run 37088355232; artifact 11261835640; digest sha256:c0ac8df74e4fa0288af4beb0e2d84e8e40d70e5070e1a5d20385cbb9952f8b15. Exact candidate B4 warp/distort/perspective PASS individually, including native stable id, retained base, state, Canvas and Preview delta, History, exact Undo/Redo, reset and repeat-from-base. Distort result differs from Perspective on the same original Path and same offsets. Fresh-browser A1 Paint Session, A2 four-kind native Stroke, A3 Paper and B2 brightnessContrast regressions all PASS. Capability inventory remains 23 named tools and includes the three new edit descriptors.

Preview baseline fnv1a32:a94d0df7; warp fnv1a32:08317eb1; distort fnv1a32:9f578833; perspective fnv1a32:5105c73e. Canvas baseline ca5e221b; warp ac22a30d; distort 4e17a235; perspective b1149dd5.

MR disposition: ACCEPT exact candidate for PR integration. Merge must preserve identical complete product/source tree; then pin accepted merged SHA in Live wrapper/BUILD_INFO and run formal Live B4. Live is not closed by candidate PASS.
