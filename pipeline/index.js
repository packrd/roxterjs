var __ACTIVE__ = false;

import {
    ScanPathsRoutes,
    RoutesTransform,
    BuildRoutes,
    routes,
    Resets,
    //dirRoutes,
} from "./pipes.js";

import {
    WatchPath,
    WatchFiles,
} from "./watchs.js";

import { Cluster } from "./cluster.js";

async function StreamPipeline () {

    try {

        await ScanPathsRoutes();
        await RoutesTransform();
        await BuildRoutes();

        return true;
    }
    catch {
        return false;
    }
}

async function RunPipe() {

    const pipeline = await StreamPipeline();

    if(pipeline){
        WatchPath(routes);
        WatchFiles(routes, async () => {
            Resets();
            await StreamPipeline();
        });

        __ACTIVE__ = true;
    }
};

export default async function Initial (){

    const MODE_ROXTER = process.env.ROXTER_START_MODE || "PROD";

    if(MODE_ROXTER !== "PROD")
        await RunPipe();

    if(__ACTIVE__ || MODE_ROXTER === "PROD")
        return await Cluster;

    setTimeout(async()=> await Start(), 3000);
}