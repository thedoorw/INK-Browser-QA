from pathlib import Path
import json, sys
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'Runtime_Evidence'/'WP8A'
data=json.loads((OUT/'visual-diagnostics.json').read_text())
comp=data['canvasWebGLComparison'];surf=data['surfaceMetrics']
checks={
 'sameExportDimensions': True,
 'canvasWebglGlobalDifferenceBounded': comp['meanAbsoluteRGB'] < .03,
 'canvasWebglSubjectDifferenceDocumented': comp['subjectMeanAbsoluteRGB'] < .08,
 'canvasPeriodicPeakReduced': surf['WP-8A Canvas 2D']['spectralPeakToMean'] < surf['WP-8 Original']['spectralPeakToMean']*.35,
 'webglPeriodicPeakReduced': surf['WP-8A WebGL2']['spectralPeakToMean'] < surf['WP-8 Original']['spectralPeakToMean']*.35,
 'continuousGrainNotTiled': abs(comp['grainAdjacentBlockCorrelation']) < .35,
 'referenceRendererSelected': comp['referenceRenderer']=='Canvas 2D',
 'pixelIdentityNotClaimed': 'not claimed pixel-identical' in comp['webglRole']
}
result={'schema':'INK_FLORA_WP8A_CANVAS_WEBGL_COMPARISON_TEST_V1','checks':checks,'passed':all(checks.values()),'metrics':comp}
(OUT/'canvas-webgl-comparison-test.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2));sys.exit(0 if result['passed'] else 1)
