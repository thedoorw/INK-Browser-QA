import {probePsd,parsePsd,encodeFlattenedPsd} from './formats/psd.js';
import {probeTiff,parseTiff,encodeBaselineTiff} from './formats/tiff.js';
import {probeExr,parseExr,encodeBasicExr} from './formats/exr.js';
import {createRawAdapterRegistry} from './formats/adapters/raw-adapter.js';
export const rawAdapters=createRawAdapterRegistry();
export function probeFormat(input){for(const fn of [probePsd,probeTiff,probeExr]){const p=fn(input);if(p.matched)return p;}const r=rawAdapters.probe(input);return r.matched?r:{matched:false,format:null,status:r.status};}
export async function decodeFormat(input,{format=null,...options}={}){const p=format?{format}:probeFormat(input);if(p.format==='PSD'||p.format==='PSB')return parsePsd(input,options);if(p.format==='TIFF')return parseTiff(input,options);if(p.format==='EXR')return parseExr(input,options);if(p.format==='RAW')return rawAdapters.decode(input);throw new Error('INK_FORMAT_UNRECOGNIZED');}
export function encodeFormat(format,payload,options={}){if(format==='PSD')return encodeFlattenedPsd(payload,options);if(format==='TIFF')return encodeBaselineTiff(payload,options);if(format==='EXR')return encodeBasicExr(payload,options);if(format==='PSB')throw new Error('INK_PSB_ENCODE_ADAPTER_REQUIRED');if(format==='RAW')throw new Error('INK_RAW_EXPORT_NOT_REQUIRED');throw new Error(`INK_FORMAT_ENCODE_UNSUPPORTED:${format}`);}
export {probePsd,parsePsd,encodeFlattenedPsd,probeTiff,parseTiff,encodeBaselineTiff,probeExr,parseExr,encodeBasicExr,createRawAdapterRegistry};
