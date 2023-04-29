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

import Server from "./server.js";

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

export const Start = async () => {

    await RunPipe();

    if(__ACTIVE__)
        return await Server();

    setTimeout(async()=> await Start(), 3000);
}