import http from 'node:http';
import {readFileSync} from 'node:fs';
import {handleCoach} from '../.local-preview/coach.mjs';
try{process.loadEnvFile('.env')}catch{}
const files={'/':['.local-preview/index.html','text/html; charset=utf-8'],'/app.js':['.local-preview/app.js','text/javascript'],'/style.css':['app/globals.css','text/css'],'/favicon.svg':['public/favicon.svg','image/svg+xml']};
http.createServer(async(req,res)=>{
 try{
  if(req.url==='/api/coach'){
   if(req.method!=='POST'){res.writeHead(405);res.end();return}
   let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>100000){res.writeHead(413,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'기록이 너무 깁니다.'}));return}}
   const request=new Request('http://'+req.headers.host+'/api/coach',{method:'POST',headers:{origin:req.headers.origin||'','Content-Type':'application/json'},body:raw});
   const response=await handleCoach(request,process.env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
  }
  const file=files[req.url?.split('?')[0]];if(!file){res.writeHead(404);res.end();return}
  res.writeHead(200,{'Content-Type':file[1],'Cache-Control':'no-cache'});res.end(readFileSync(file[0]));
 }catch{res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'서버 오류가 발생했습니다. 입력을 보관한 뒤 다시 시도해주세요.'}))}
}).listen(5173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:5173'));
