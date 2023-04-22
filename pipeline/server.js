import './d.env.js';
import http from 'node:http';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3002;

export default async function Server ( Router = false ) {

    if(!Router)
        throw new Error("Routes to server is not defined!")

    const getStringFromUrl = async (req) => {
        let cks = '';
        for await (const chunk of req) 
            cks += await chunk.toString(); 
        return !cks ? '' : JSON.parse(cks);
    };
    
    const getStringFromQuery = (reqUrl) => {
        let Map = {};
    
        reqUrl?.split(/[\?|&|#,]+/)?.filter((d) => /=/g.test(d))?.map((d) => {
            const [key,value] = d?.split("=");
            Map[key] = value
        });
    
        return Map;
    }
    
    const clearToFix = (value) => value?.split(/[?|#]/gi)[0];
    
    await http.createServer(async (req,res) => {
    
        try {
    
            const { method, url, } = req;
            const fixUrl = await url.split("/")?.map((d) => clearToFix(d));
            const fixRoute = Object.keys(Router);
            let [UTL, KEYS] = [{},{}];
    
            for await(let fix of fixRoute){
    
                const fixCopy = fix;
                const firtsUrl = fix?.split(" ");
                const params = firtsUrl[1]?.split("/");
    
                const findParams = params.map((d,i) => d?.match(/\[([a-z\d_]+)\]/gi) ? { key:d, index:i } : false).filter(f=>f);   
                
                if(findParams[0]){
    
                    findParams.map((r) =>{ 
                        fix = fix?.replace(params[r.index],fixUrl[r.index]||"[unfound]");
                        KEYS[params[r.index].replace(/\[|\]/g,"")] = fixUrl[r.index];
                    });
        
                    UTL[fix] = Router[fixCopy];
                }
                else {
                    UTL[fix] = Router[fix];
                }
            }
    
            const Url = clearToFix(url);
            const body = await getStringFromUrl(req);
            const query = await getStringFromQuery(url);
        
            return await UTL[`[${method}] ${Url}`]({ 
                req, 
                res, 
                keys: KEYS, 
                body, 
                query,
                endJson:({ status, ...props }) => {
                    res.status = status || 201;
                    res.end(JSON.stringify({ ...props }));
                },
                end:(status, props) => {
                    res.status = status || 201 ;
                    res.end(props);
                }
            });
        }
    
        catch {
    
            res.statusCode = 404;
            res.end("Api directory not found");
        }
        
    }).listen(PORT, HOST, () => 
        console.log(`[ROXTER] > Running at http://${HOST}:${PORT}`)
    );
    
}