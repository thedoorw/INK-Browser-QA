# B4 fresh-main authority mismatch — 2026-10-03

Status: STOP under USER exception 2: native Path deformation authority is fundamentally inconsistent with the specified execution route. This is not candidate-ready or a test failure checkpoint, and no B4 completion is claimed.

Fresh branch: `work/ink-live-path-deformation-exposure-002`
Base: `d26539b3c98c11bf0d1da55b190ff5937b2a0f70`
Old branch was not merged, rebased, or extended. Reviewed effective intent of commits e4401332620c852a54e4d8068072004d4fabf539, 7621ab9fcb9312c3b98039020dbd9cf57106574f, 7e7109e8b0e31caf6ffdf8df3fd27310cc0c4246.

## Confirmed mismatch

USER requires all three operations to reuse src/vector/deformation.js → applyNonDestructiveDeformation() → native Path → existing Renderer / History.

- Existing deformation transform consumes foreshortening/perspective, taper, bend, perspectiveY, foldAxis, foldAngle. It does not consume a projective matrix or xOffset/yOffset.
- Repro with the old distort/perspective arguments {xOffset:12,yOffset:6}: parameters are stored in native deformation state, but subpaths remain exactly unchanged. Storing unsupported parameters is not execution proof.
- Old branch warp calls applyNonDestructiveDeformation(). Old branch distort/perspective instead introduces an adapter loop applying mapProjectivePoint() directly to anchors and handles, and explicitly leaves deformation state absent. The old tests assert Boolean(changed.deformation) === false for both.
- createDistortTransform and createPerspectiveTransform are aliases of createProjectiveTransform in src/editor/transform-advanced.js. Their mapping exists, but it is a separate existing transform planner, not a supported parameter route in applyNonDestructiveDeformation().
- Therefore replaying the old intent verbatim would violate the requested authority chain. Passing old arguments to the mandated routine would silently produce unchanged geometry. Adding matrix support to native deformation would modify that Core authority and needs a revised bounded authority decision.

Executed reproducible source probe: `node qa/evidence/b4-authority-assumption-probe.mjs`. Result: nativeSubpathsChanged=false, parametersStoredButNotConsumed=true, distortAndPerspectiveSameProjectivePlanner=true. This is source execution evidence only; no Canvas, hosted candidate, or formal Live PASS is claimed.

## Preservation and disposition

No product files changed. Complete product/source tree remains `30d55495650acd365acc2b1e92c7669fa01f1870`.
- chat-bounded-edit.js blob: `5e0126a837a93d863e13be99ea67fc31128c5425`
- capability-registry.js blob: `d45eb30ebe54212b857726a64601d6b326feb629`

A2 stroke.create.v1 and A3 page.paper.set.v1 remain intact. No UI, FORMAT_VERSION, Document, History, Renderer, raster or pointer changes. Existing A1/A2/A3/B0/B1/B2 evidence remains baseline; fresh regressions are not claimed.

B4 warp/distort/perspective qualification: NOT RUN / NOT PASS. PR acceptance, source integration and deployment: NOT EXECUTED.

Required owning authority decision: either authorize the existing projective-transform route specifically for distort/perspective with their native geometry/History semantics, or authorize a bounded extension of the existing deformation Core to handle projective mapping and reversible parameters. Do not create a second deformation model. Resume on this fresh branch only after that decision; then complete each operation's candidate, regression, integration and formal Live evidence.
