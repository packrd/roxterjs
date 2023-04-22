var __ACTIVE__ = false;

import {
    ScanPathsRoutes,
    RoutesTransform,
    BuildRoutes,
    routes,
    dirRoutes,
    Resets,
} from "./pipeline/pipes.js";

import {
    WatchPath,
    WatchFiles,
} from "./pipeline/watchs.js";

import Server from "./pipeline/server.js";

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

export const Start = async (props = false) => {

    await RunPipe();

    if(__ACTIVE__ && props)
        return Server(props);

    setTimeout(()=>Start(props), 3000);
}

/* import AppRoutes from "./app.route.js"
(async()=>await Start(AppRoutes))(); */