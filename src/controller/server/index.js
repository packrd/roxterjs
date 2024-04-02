import http from "node:http";
import path from "node:path";
import { pathToFileURL } from 'node:url';
import fs from "node:fs";
import { clearUrl } from "./clearUrl/index.js";
import { Body } from "./body/index.js";
import { getParams } from "./params/index.js";
import { MODE, HOST, PORT, FILE_PATH_ABSOLUTE } from "../../config/envs/index.js";
import Log from "../log/index.js";

const fileRoute = path.resolve(FILE_PATH_ABSOLUTE);

try {
  const stats = fs.statSync(fileRoute);
  if (!stats.isFile()) {
    fs.writeFileSync(fileRoute, `export default {}`);
    Log(`[ok]Created file router [green]*${FILE_PATH_ABSOLUTE}*`);
  }
} catch (err) {
  if (err.code === 'ENOENT') {
    fs.writeFileSync(fileRoute, `export default {}`);
    Log(`[ok]Created file router [green]*${FILE_PATH_ABSOLUTE}*`);
  } 
  else
    Log('[error] ao verificar ou criar arquivo:', err);
}

export default async function ServerRoxter () {

  const Start = ({ setHeaders = [] } = {}) => {
    http.createServer(async (req,res) => {
      try {
        
        if(setHeaders && setHeaders[0]){
          for(let { name, value } of setHeaders) 
            res.setHeader(name, value);
        }

        if(req.method === "OPTIONS"){
          res.statusCode = 200;
          return res.end("OK");
        }

        const { method, url, } = req;
        const importRoutes = await import(pathToFileURL(FILE_PATH_ABSOLUTE).toString());
        const ViewRoutes = importRoutes.default; 
        const pathUrl = clearUrl(url)?.split("/")?.filter(u=>!!u)?.join('/');
        const pathMethod = method?.toLocaleLowerCase() || "get";
        const Routes = Object.keys(ViewRoutes);
        const currentPathUrl = `${pathMethod}::${pathUrl}`;
        const regexSlug = /\[(.*?)\]/;
        let attempt = 0;
        
        for(let route of Routes) {

          let keys = {};
          const [methodRoute, urlRoute] = route.split('::');
          const currUrl = pathUrl.split('/');
          const params = getParams(url);

          const findSlugUrl = urlRoute?.split('/')?.filter(u=>!!u).map((u,index) => {
            const m = u.match(regexSlug);
            if (m && m[0]){ 
              keys[m[1]] = currUrl[index];
              return u.replace(m[0],currUrl[index]);
            } else return u;
          })?.join('/');
  
          if(`${methodRoute}::${findSlugUrl}` === currentPathUrl) {
            const body = (pathMethod !== "get") ? await Body(req) : {};
            return await ViewRoutes[route]({ req, res, keys, body, params });
          }

          attempt++;

          if(attempt >= Routes.length){
            res.writeHead(429, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }
        }
        res.writeHead(429, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      } 
      catch(error) {
        Log(`[error][red]Error handling request: ${error}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    })
    .listen(PORT, HOST, 
      () => Log(`[ok]Start mode... [green]*${MODE}* [white]| *Running* at [blue]*http://${HOST}:${PORT}*`)
    );
  }
  return { Start, }
}