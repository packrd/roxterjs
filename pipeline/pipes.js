import fs from 'fs';
import path from "path";

const __DIRNAME__ = process.env.ROXTER_PATH || "./src";
const __FILENAME__ = process.env.FILENAME || "app.route.js";

let routes = [];
let dirRoutes = [];

async function ScanPathsRoutes (__dirname__ = __DIRNAME__) {

    try {
    
        await fs.readdirSync(__dirname__).map(async Origin => {
    
            let __dirend__ = `${__dirname__}/${Origin}`;
    
            if(fs.statSync(__dirend__).isDirectory())
                return ScanPathsRoutes(__dirend__);
    
            else {
    
                __dirend__ = __dirend__?.replace(__DIRNAME__,"")?.toLocaleLowerCase();
    
                /get|put|post|delete|options|$(^[.js|.ts])/gi.test(__dirend__?.split("/")) 
                    ? dirRoutes.push(__dirend__)
                    : null;
            }
        });

        dirRoutes = [...new Set([...dirRoutes])];
        return true;
    }

    catch {
        return false;
    }

}

async function RoutesTransform () {

    try {

        const scanPathRoutes = dirRoutes;
    
        if(!scanPathRoutes || !scanPathRoutes[0])
            return false;
        
        await scanPathRoutes?.map(route => {
    
            const workdir = route?.split("/");
    
            const fromImport = workdir[workdir?.length-1];
            const dirArray = workdir?.slice(0,workdir.length-1)?.join("/").split("/");
            const method = fromImport?.split(".")[0]?.toUpperCase();
            const router = route?.split(".");
            const opendir = `${process.env.ROXTER_PATH||"./src"}${route}`;
            const pathdir = `${process.env.ROXTER_PATH||"./src"}${dirArray.join("/")}`;
    
            routes.push({
                dirArray,
                method,
                opendir,
                pathdir,
                route:dirArray.join("/"),
                filext:`.${router[1]||"js"}`,
            });
    
        });
    
        routes = [...new Set([...routes])];
        return true;
    }
    catch {
        return false;
    }

}

async function BuildRoutes () {

    const routesTransform = routes;
    const renameFileImport = (value) => value.replace(/\/|\[|\]/gi,"");

    if(!routesTransform)
        return;

    const Imports = await routesTransform?.map(route => {
        const rename = `${renameFileImport(route?.route)}${route?.method?.toLocaleLowerCase()}`;
        return `import ${rename} from \"${route.opendir}\";`
    });

    const Layers = await routesTransform?.map(route => {
        const rename = `${renameFileImport(route?.route)}${route?.method?.toLocaleLowerCase()}`;
        return `\"[${route?.method}] ${route?.route}\": ${rename},`
    });

    const __SCRIPT__ = `${Imports?.join("\n")}\n\n export default {\n\n\t${Layers.join("\n\t")}\n\n }`;

    return await Subscribe(__SCRIPT__);

}

async function Subscribe (values = "") {

    try {
        const __dirname__ = path.resolve(__FILENAME__);

        /* if(fs.statSync(__dirname__).isFile())
            await fs.unlinkSync(__dirname__); */
    
        //await fs.writeFileSync(__dirname__,`export default {}`)

        if(__dirname__ && values)
            fs.writeFileSync(__dirname__, values, "utf-8");
    
        //await Spawn({ cmd: "echo", prompt: [__dirname__]});

        return true;
    }
    catch {
        return false;
    }
}

function Resets () {
    routes = [];
    dirRoutes = [];
}

export {
    dirRoutes,
    routes,
    ScanPathsRoutes,
    RoutesTransform,
    BuildRoutes,
    Resets,
}