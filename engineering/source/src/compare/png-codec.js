import { deflateSync, inflateSync } from 'node:zlib';

const SIG = Buffer.from([137,80,78,71,13,10,26,10]);
const crcTable = (()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
const crc32 = b => {let c=0xffffffff;for(const x of b)c=crcTable[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
const chunk=(type,data)=>{const t=Buffer.from(type);const out=Buffer.alloc(12+data.length);out.writeUInt32BE(data.length,0);t.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc32(Buffer.concat([t,data])),8+data.length);return out;};
export class PNGImage { constructor({width,height,data=null}){this.width=width;this.height=height;this.data=data||Buffer.alloc(width*height*4);} }
export function encodePNG(image){const {width,height}=image;const raw=Buffer.alloc(height*(1+width*4));for(let y=0;y<height;y++){raw[y*(1+width*4)]=0;Buffer.from(image.data).copy(raw,y*(1+width*4)+1,y*width*4,(y+1)*width*4);}const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(width,0);ihdr.writeUInt32BE(height,4);ihdr[8]=8;ihdr[9]=6;ihdr[10]=0;ihdr[11]=0;ihdr[12]=0;return Buffer.concat([SIG,chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);}
export function decodePNG(bytes){
 const b=Buffer.from(bytes);if(!b.subarray(0,8).equals(SIG))throw new Error('PNG_SIGNATURE_INVALID');let p=8,w,h,ct,bd,interlace,idats=[];
 while(p<b.length){const len=b.readUInt32BE(p),type=b.toString('ascii',p+4,p+8),d=b.subarray(p+8,p+8+len);p+=12+len;if(type==='IHDR'){w=d.readUInt32BE(0);h=d.readUInt32BE(4);bd=d[8];ct=d[9];interlace=d[12];}else if(type==='IDAT')idats.push(d);else if(type==='IEND')break;}
 if(bd!==8||![2,6].includes(ct)||interlace!==0)throw new Error('PNG_UNSUPPORTED_FORMAT');const bpp=ct===6?4:3,stride=w*bpp,raw=inflateSync(Buffer.concat(idats)),decoded=Buffer.alloc(h*stride);let prev=Buffer.alloc(stride),off=0;
 for(let y=0;y<h;y++){const f=raw[off++],row=Buffer.alloc(stride);for(let x=0;x<stride;x++){const a=x>=bpp?row[x-bpp]:0,up=prev[x]||0,ul=x>=bpp?prev[x-bpp]:0,v=raw[off++];let r;if(f===0)r=v;else if(f===1)r=(v+a)&255;else if(f===2)r=(v+up)&255;else if(f===3)r=(v+Math.floor((a+up)/2))&255;else if(f===4){const q=a+up-ul,pa=Math.abs(q-a),pb=Math.abs(q-up),pc=Math.abs(q-ul);r=(v+(pa<=pb&&pa<=pc?a:pb<=pc?up:ul))&255;}else throw new Error('PNG_FILTER_UNSUPPORTED');row[x]=r;}row.copy(decoded,y*stride);prev=row;}
 if(ct===6)return new PNGImage({width:w,height:h,data:decoded});const out=Buffer.alloc(w*h*4);for(let i=0,j=0;i<decoded.length;i+=3,j+=4){out[j]=decoded[i];out[j+1]=decoded[i+1];out[j+2]=decoded[i+2];out[j+3]=255;}return new PNGImage({width:w,height:h,data:out});}
