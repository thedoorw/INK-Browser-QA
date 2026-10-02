# Tool → Options Bar Exposure — SUP-11 — 2026-10-02

Scope: every currently installed Tools group/subtool plus native Select/Eraser/Pan; command-only Crop/Frame/Zoom/Import and node-edit context are separately reconciled below. This is not a claim that all 496 atomics belong in Options Bar. Existing capabilities/state remain the authority.

| Tool / command | Capability | Applicable parameters / actions | Primary home | State owner | Disposition / evidence |
| --- | --- | --- | --- | --- | --- |
| pen | C29/C30/C31/C32 | quickColor, quickColorInput, quickSizeInput, quickOpacityInput, smoothingInput, pressureInput, taper | OPTIONS_BAR | app.toolSettings / updateBrushSetting | Mounted original control / existing handler; after-tool-options.json |
| pencil | C29/C30/C31/C32 | quickColor, quickColorInput, quickSizeInput, quickOpacityInput, smoothingInput, pressureInput, grain | OPTIONS_BAR | app.toolSettings / updateBrushSetting | Mounted original control / existing handler; after-tool-options.json |
| marker | C29/C30/C31/C32 | quickColor, quickColorInput, quickSizeInput, quickOpacityInput, smoothingInput, pressureInput, taper | OPTIONS_BAR | app.toolSettings / updateBrushSetting | Mounted original control / existing handler; after-tool-options.json |
| brush | C29/C30/C31/C32 | quickColor, quickColorInput, quickSizeInput, quickOpacityInput, smoothingInput, pressureInput, brushFlowInput, brushWetnessInput, brushBristleInput, taper, grain, softness | OPTIONS_BAR | app.toolSettings / updateBrushSetting | Mounted original control / existing handler; after-tool-options.json |
| airbrush | C29/C30/C31/C32 | quickColor, quickColorInput, quickSizeInput, quickOpacityInput, smoothingInput, pressureInput, brushFlowInput, brushWetnessInput, brushBristleInput, taper, grain, softness | OPTIONS_BAR | app.toolSettings / updateBrushSetting | Mounted original control / existing handler; after-tool-options.json |
| blender | C33 | paint-replay, stroke-session | OPTIONS_BAR | Stroke Session / paintReplay | Existing replay controls; no live smudge brush claimed; after-tool-options.json |
| smudge | C33 | paint-replay, stroke-session | OPTIONS_BAR | Stroke Session / paintReplay | Existing replay controls; no live smudge brush claimed; after-tool-options.json |
| lasso | C07 | select-all, select-clear | OPTIONS_BAR | app.selection / existing dispatch | Mounted original control / existing handler; after-tool-options.json |
| polygonalLasso | C07 | selectionMode | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| magneticLasso | C07 | selectionMode, edgeThreshold, searchRadius | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| quickSelection | C07 | selectionMode, tolerance, edgeThreshold | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| magicWand | C07 | selectionMode, tolerance, contiguous | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| objectSelection | C07 | selectionMode, tolerance, edgeThreshold | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| gradient | C22 | gradientType, gradientStart, gradientEnd, opacity | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| paintBucket | C22 | tolerance, contiguous, opacity | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| eyedropper | C22 | sampleRadius | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| colorSampler | C22 | sampleRadius | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| measure | C22 | Measurement gesture; no invented options | OPTIONS_BAR | createRasterToolController.options / setOption | No adjustable scalar owned; existing drag measurement / toast; after-tool-options.json |
| cloneStamp | C22 | radius, opacity, hardness | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| patternStamp | C22 | radius, opacity, hardness | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| healingBrush | C22 | radius, opacity, hardness | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| spotHealing | C22 | radius, opacity, hardness | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| patch | C22 | radius, opacity | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| dodge | C22 | radius, strength, hardness | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| burn | C22 | radius, strength, hardness | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| sponge | C22 | radius, strength, hardness, spongeMode | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| localBlur | C22 | radius, strength, hardness | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| localSharpen | C22 | radius, strength, hardness | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| colorReplacement | C22 | radius, strength, hardness, tolerance, replacementColor | OPTIONS_BAR | createRasterToolController.options / setOption | Shared adapter fields / existing pixel consumers; after-tool-options.json |
| shape:line | C11/C08 | quickColor, quickColorInput, quickSizeInput, quickOpacityInput, line, arrow, rect, ellipse, triangle, shapeFill, snap-angle | OPTIONS_BAR | app.shapeType / shapeFill / toolSettings / page.snap | Mounted original control / existing handler; after-tool-options.json |
| shape:arrow | C11/C08 | quickColor, quickColorInput, quickSizeInput, quickOpacityInput, line, arrow, rect, ellipse, triangle, shapeFill, snap-angle | OPTIONS_BAR | app.shapeType / shapeFill / toolSettings / page.snap | Mounted original control / existing handler; after-tool-options.json |
| shape:rect | C11/C08 | quickColor, quickColorInput, quickSizeInput, quickOpacityInput, line, arrow, rect, ellipse, triangle, shapeFill, snap-angle | OPTIONS_BAR | app.shapeType / shapeFill / toolSettings / page.snap | Mounted original control / existing handler; after-tool-options.json |
| shape:ellipse | C11/C08 | quickColor, quickColorInput, quickSizeInput, quickOpacityInput, line, arrow, rect, ellipse, triangle, shapeFill, snap-angle | OPTIONS_BAR | app.shapeType / shapeFill / toolSettings / page.snap | Mounted original control / existing handler; after-tool-options.json |
| shape:triangle | C11/C08 | quickColor, quickColorInput, quickSizeInput, quickOpacityInput, line, arrow, rect, ellipse, triangle, shapeFill, snap-angle | OPTIONS_BAR | app.shapeType / shapeFill / toolSettings / page.snap | Mounted original control / existing handler; after-tool-options.json |
| text:horizontal-tb | C20 | quickColor, quickColorInput, fontFamily, fontSize, text-direction | OPTIONS_BAR | app.font / uiBTextMode / Text authority | Mounted original control / existing handler; after-tool-options.json |
| text:vertical-rl | C20 | quickColor, quickColorInput, fontFamily, fontSize, text-direction | OPTIONS_BAR | app.font / uiBTextMode / Text authority | Mounted original control / existing handler; after-tool-options.json |
| text:vertical-lr | C20 | quickColor, quickColorInput, fontFamily, fontSize, text-direction | OPTIONS_BAR | app.font / uiBTextMode / Text authority | Mounted original control / existing handler; after-tool-options.json |
| select | C07 | select-all, select-clear | OPTIONS_BAR | app.selection / existing dispatch | Mounted original control / existing handler; after-tool-options.json |
| eraser | C29 | quickSizeInput, segment, object | OPTIONS_BAR | app.toolSettings / updateBrushSetting | Mounted original control / existing handler; after-tool-options.json |
| pan | Workspace/Camera | zoom-out, zoom-in, fit-content, reset-view | OPTIONS_BAR | page.camera / native view methods | Mounted original control / existing handler; after-tool-options.json |

| Command / edit context | Authority and primary home | Context route / verification |
| --- | --- | --- |
| Crop | C22; DIALOG; cropSelectedImage / image-crop / original History | Tools command remains clickable; no raster → concise prerequisite; valid raster → existing crop dialog, mutation and undo verified |
| Frame | Composition frameSelection; APPLICATION_MENU / COMPOSE panel | Tools shortcut remains clickable; no target → concise prerequisite; valid target → native frameSelection and undo verified |
| Path / stroke node editing | C10/C34; OPTIONS_BAR; native pathEditing / strokeEdit | Existing shellEditingContextControls proxy existing native node commands; no additional node/selection state |
| Zoom | Native camera; Tools flyout / PAN OPTIONS_BAR | Existing zoomBy / fitContent / resetView handlers |
| Image import | C22; FILE INPUT / APPLICATION_MENU | Native image tool is an import command; retains existing imageInput, does not claim a persistent parameterized tool |
| Selected-object line height / transform / material | C20/C13/C39; PROPERTIES | Persistent object parameters remain in Properties; not duplicated into a generic Options inventory |

Raster consumption proof: selection calls image-core selection algorithms; gradient/pail call gradientFill/paintBucketFill; retouch fields call applyRetouch with the declared strength/opacity/hardness parameters; sampling uses sampleRasterColor. Native proof: beginStroke consumes moved dynamics; beginShape consumes revealed size/opacity; commitTextEditor consumes existing writingMode. See the browser checks for representative produced-object assertions, continuous input/focus and tool-switch persistence.
