import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
const root=process.env.GAUGE_SOURCE;
if (!root) throw new Error('Set GAUGE_SOURCE to a Gauge app checkout with dependencies installed');
const require=createRequire(root+'/package.json');
const esbuild=require('esbuild');
const postcss=require('postcss');
const out=path.resolve('.rendered-session'); await mkdir(out,{recursive:true});
await esbuild.build({entryPoints:['mockups/session-preview/viewer.tsx'],bundle:true,outfile:out+'/viewer.js',format:'esm',jsx:'automatic',nodePaths:[root+'/node_modules'],alias:{'@':root+'/src'},loader:{'.module.css':'local-css'},plugins:[{name:'mock-navigation',setup(b){b.onResolve({filter:/^next\/(navigation|link)$/},a=>({path:a.path,namespace:'mock'}));b.onLoad({filter:/.*/,namespace:'mock'},a=>({contents:a.path.endsWith('navigation')?'export const usePathname=()=>"/preview/runs/sample";':'import React from "react";export default function Link(p){return React.createElement("a",p)};',loader:'js',resolveDir:root}));}}]});
const css=await postcss([require('postcss-preset-mantine')]).process(await readFile(out+'/viewer.css','utf8'),{from:out+'/viewer.css'});await writeFile(out+'/viewer.css',css.css);
const tw=await postcss([require('@tailwindcss/postcss')]).process(await readFile(root+'/src/app/tailwind.css','utf8'),{from:root+'/src/app/tailwind.css'});await writeFile(out+'/tailwind.css',tw.css);
for(const f of ['Switzer-Variable.woff2','Px-Grotesk-Regular.woff2','Px-Grotesk-Mono-Regular.woff2','JetBrainsMono-Variable.woff2']) await copyFile(root+'/src/fonts/'+f,out+'/'+f);
await writeFile(out+'/index.html',`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="viewer.css"><link rel="stylesheet" href="tailwind.css"><style>
@font-face{font-family:Switzer;src:url(Switzer-Variable.woff2)}@font-face{font-family:Px;src:url(Px-Grotesk-Regular.woff2)}@font-face{font-family:PxMono;src:url(Px-Grotesk-Mono-Regular.woff2)}@font-face{font-family:JetBrains;src:url(JetBrainsMono-Variable.woff2)}
:root{--font-switzer:Switzer;--font-px-grotesk:Px;--font-px-grotesk-mono:PxMono;--font-terminal:JetBrains;color-scheme:dark}body{margin:0;background:#101114}*{box-sizing:border-box}#capture{--mantine-radius-md:2px}
</style></head><body><div id="root"></div><script type="module" src="viewer.js"></script></body></html>`);
console.log(out);
