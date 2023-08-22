import path from "path";
import fs from "fs";
import Spawn from "./spawn.js";

function SaveRoutes(){
    const __filename__ = path.resolve("app.route.js");
    Spawn({ cmd:"echo", prompt:[__filename__]});
}

async function WatchFiles (routes = [], callback = false) {
    if(routes[0]){
        for await (let i of routes) {
            const __filename__ = path.resolve(i?.opendir.slice(1).split("/").filter(a=>a).join("/"));
            await fs.watch(__filename__, async () => {
                if(callback) callback();
                await Spawn({ cmd:"echo", prompt:[__filename__]});
            });
        }
        SaveRoutes();
    }
}

async function WatchPath (paths = [], callback = false) {
    const __dirname__ = path.resolve(process.env.ROXTER_PATH || "src");
    const pathMap = paths.map(d=>path.resolve(d?.pathdir.slice(1).split("/").filter(a=>a).join("/")));
    
    for await (let i of [...pathMap, __dirname__]){
        fs.watch(i, async () => { 
            if(callback) callback();
            await Spawn({ cmd:"echo", prompt:[i]});
        });
    }
    SaveRoutes();
}


export {
    WatchFiles,
    WatchPath,
}
