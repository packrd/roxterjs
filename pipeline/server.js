import './d.env.js';
import http from 'node:http';
import fs from "fs";
import path from "path";
import { pathToFileURL } from 'node:url';
import Spawn from './spawn.js';
import getArgumentsFn from './argsfn.js';
import os from "node:os";

const HOST = process.env.ROXTER_HOSTNAME || os.hostname() || "localhost";
const PORT = process.env.PORT || 3012;
const MODE_ROXTER = process.env.ROXTER_START_MODE || "PROD";

export default async function Server () {

    const fileRoute = path.resolve("./app.route.js");
    const isFileRoute = fs.statSync(fileRoute).isFile();

    if(!isFileRoute){
        await fs.writeFileSync(fileRoute,`export default {}`);
        Spawn({ cmd:"echo", prompt:[fileRoute]});
    }
    
    const importRoute = await import(pathToFileURL(fileRoute).toString());
    const Router = importRoute.default;   
    
    if(Router) await InitialServer(Router);
    
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

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, Issue-Key");

        if(req.method === "OPTIONS"){
            res.statusCode = 200;
            return res.end("OK");
        }
        
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
                req, 
                res, 
                keys, 
                body, 
                query,
                json:function({ status, ...props }) {
                    res.status = status || 201;
                    return res.end(JSON.stringify({ status, ...props }));
                },
                end:function() {
                    const { number = 201, string = "Roxter is OK" } = getArgumentsFn(...arguments);
                    res.status = number ;
                    return res.end(string);
                }
            });
        }
        else {
            res.end("RoxterJS API not found");
        }
        
    }).listen(PORT, HOST, () => console.log(`[ROXTER|MODE ${MODE_ROXTER}] > Running at http://${HOST}:${PORT}`));
}