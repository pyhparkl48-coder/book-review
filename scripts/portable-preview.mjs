// Preview without spawning framework or Worker subprocesses on restricted hosts.
import {createRequire} from 'node:module';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
const require=createRequire(import.meta.url);
const viteRequire=createRequire(require.resolve('vite/package.json'));
const {build}=await import(pathToFileURL(viteRequire.resolve('rolldown')).href);
mkdirSync('.local-preview',{recursive:true});
writeFileSync('.local-preview/entry.tsx',`import React from 'react';import {createRoot} from 'react-dom/client';import App from '../app/components/ReadingApp';createRoot(document.getElementById('root')!).render(<App/>);`);
const bundle=await build({input:path.resolve('.local-preview/entry.tsx'),platform:'browser',plugins:[{name:'typescript',transform(code,id){if(/\.[jt]sx?$/.test(id))return {code:ts.transpileModule(code.replaceAll('process.env.NODE_ENV',JSON.stringify('production')),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText}}}],output:{file:'.local-preview/app.js',format:'esm'}});
writeFileSync('.local-preview/index.html',`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>문장 사이 · 나의 독서</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/style.css"></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>`);
console.log('Portable browser bundle built.');


await build({input:path.resolve('app/lib/server-coach.ts'),platform:'node',plugins:[{name:'typescript',transform(code,id){if(/\.tsx?$/.test(id))return {code:ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText}}}],output:{file:'.local-preview/coach.mjs',format:'esm'}});
