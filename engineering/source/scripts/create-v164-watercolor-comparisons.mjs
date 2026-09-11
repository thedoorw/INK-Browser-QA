import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { decodePNG, encodePNG, imageDifference } from '../src/compare/image-difference.js';
const root=path.resolve('.'),out=path.join(root,'Validation','v1.6.4','visual-comparisons');await mkdir(out,{recursive:true});
async function make(a,b,name){const A=decodePNG(await readFile(a)),B=decodePNG(await readFile(b));const r=imageDifference(A,B,6);await writeFile(path.join(out,`${name}.side-by-side.png`),encodePNG(r.sideBySide));await writeFile(path.join(out,`${name}.difference.png`),encodePNG(r.difference));await writeFile(path.join(out,`${name}.overlay.png`),encodePNG(r.overlay));await writeFile(path.join(out,`${name}.metrics.json`),JSON.stringify(r.metrics,null,2));return r.metrics;}
const oldResult=path.join(root,'Validation','v1.6.3','VW-VIDEO-01','result','VW-VIDEO-01-result.png');
const videoRef=path.join(root,'Validation','v1.6.3','VW-VIDEO-01','video-reference','video-reference.png');
const newResult=path.join(root,'Validation','v1.6.4','watercolor-benchmark','WC-05','result','WC-05-result.png');
const v163=await make(oldResult,newResult,'v1.6.3-vs-v1.6.4');
const video=await make(videoRef,newResult,'video-reference-vs-v1.6.4');
const score={format:'INK-WATERCOLOR-VISUAL-ASSESSMENT',version:'1.0',benchmark:'WC-05',comparisonType:'HUMAN_REVIEW_WITH_PROCEDURAL_REFERENCE',scores:{brushLikeness:6,watercolorEdge:6,internalPigmentVariation:7,petalNaturalness:5,corollaNaturalness:5,leafStemNaturalness:6,washQuality:6,splatterQuality:7,paperIntegration:4,overallProceduralSimilarity:5},scale:'0-10',summary:'Visible improvement over v1.6.3 through irregular profiles, pigment concentration, non-rectangular wash and seeded splatter. Results remain visibly vector-structured and do not reach professional Illustrator watercolor reference quality.',decision:'VALIDATION REQUIRED',pixelMetricsAreNotQualityScores:true,metrics:{v163Comparison:v163,videoReferenceComparison:video}};await writeFile(path.join(out,'visual-assessment.json'),JSON.stringify(score,null,2));console.log(JSON.stringify(score,null,2));
