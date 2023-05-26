import path from "path";
import fs from "fs";
import Spawn from "./spawn.js";

function SaveRoutes(){
    const __filename__ = path.resolve("app.route.js");
    Spawn({ cmd:"echo", prompt:[__filename__]});
}

function WatchFiles (routes = [], callback = false) {
    if(routes[0]){
        for (let i of routes) {
            const __filename__ = path.resolve(i?.opendir.slice(1).split("/").filter(a=>a).join("/"));
            fs.watch(__filename__, () => {
                if(callback) callback();
                Spawn({ cmd:"echo", prompt:[__filename__]});
                SaveRoutes();
            });
        }
    }
}

function WatchPath (paths = [], callback = false) {
    const __dirname__ = path.resolve(process.env.ROXTER_PATH || "src");
    const pathMap = paths.map(d=>path.resolve(d?.pathdir.slice(1).split("/").filter(a=>a).join("/")));
    
    for(let i of [...pathMap, __dirname__]){
        fs.watch(i, () => { 
            if(callback) callback();
            Spawn({ cmd:"echo", prompt:[i]});
            SaveRoutes();
        });
    }
}


export {
    WatchFiles,
    WatchPath,
}
