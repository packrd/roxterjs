import './d.env.js';
import http from 'node:http';
import fs from "fs";
import path from "path";
import { pathToFileURL } from 'node:url';
import Spawn from './spawn.js';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3002;

export default async function Server () {

    const fileRoute = path.resolve("./app.route.js");
    const isFileRoute = fs.statSync(fileRoute).isFile();

    if(!isFileRoute){
        await fs.writeFileSync(fileRoute,`export default {}`);
        Spawn({ cmd:"echo", prompt:[fileRoute]});
    }
    
    const importRoute = await import(pathToFileURL(fileRoute).toString());
    const Router = importRoute.default;   
    
    if(Router)
        InitialServer(Router);
    
}

async function InitialServer (Router) {

    const getStringFromUrl = async (req) => {
        let cks = '';
        for await (const chunk of req) 
            cks += await chunk.toString(); 
        return !cks ? '' : JSON.parse(cks);
    };
    
    const getStringFromQuery = async (reqUrl) => {
        let Map = {};
    
        await reqUrl?.split(/[\?|&|#,]+/)?.filter((d) => /=/g.test(d))?.map((d) => {
            const [key,value] = d?.split("=");
            Map[key] = value
        });
    
        return Map;
    }
    
    const clearToFix = (value) => value?.split(/[?|#]/gi)[0];
    
    http.createServer(async (req,res) => {
            
        const { method, url, } = req;
        const fixUrl = url.split("/")?.map((d) => clearToFix(d));
        const fixRoute = Object.keys(Router);

        const Url = clearToFix(url);
        const body = await getStringFromUrl(req);
        const query = await getStringFromQuery(url);

        let [UTL, keys] = [{},{}];

        for await (let fix of fixRoute){

            const fixCopy = fix;
            const firtsUrl = fix?.split(" ");
            const params = firtsUrl[1]?.split("/");

            const findParams = params.map((d,i) => d?.match(/\[([a-z\d_]+)\]/gi) ? { key:d, index:i } : false).filter(f=>f);   
            
            if(findParams[0]){

                await findParams.map((r) =>{ 
                    fix = fix?.replace(params[r.index],fixUrl[r.index]||"[unfound]");
                    keys[params[r.index].replace(/\[|\]/g,"")] = fixUrl[r.index];
                });
    
                UTL[fix] = Router[fixCopy];
            }
            else {
                UTL[fix] = Router[fix];
            }
        }

        const stream = UTL[`[${method}] ${Url}`]
        
        if(stream){

            return await UTL[`[${method}] ${Url}`]({ 
                req, res, keys, body, query,
                endJson:({ status, ...props }) => {
                    res.status = status || 201;
                    return res.end(JSON.stringify({ status, ...props }));
                },
                end:(status, props) => {
                    res.status = status || 201 ;
                    return res.end(props);
                }
            });
        }
        else {
            res.end("Roxter API not found");
        }
        
    }).listen(PORT, HOST, () => console.log(`[ROXTER] > Running at http://${HOST}:${PORT}`));
}