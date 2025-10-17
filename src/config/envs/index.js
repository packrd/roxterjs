import os from "os";

const $libmode = process.env.ROXTER_MODE
  ? `${process.env.ROXTER_MODE}`?.trim()?.toLocaleLowerCase()
  : "dev";

const $port = process.env.ROXTER_PORT
  ? `${process.env.ROXTER_PORT}`?.trim()
  : process.env.PORT
  ? `${process.env.PORT}`?.trim()
  : "4444";

const $fileRoutes = "app.routes.js";
const $filePath = ".";
const $routePath = process.env.ROXTER_PATH_ROUTE
  ? `${process.env.ROXTER_PATH_ROUTE}/routes`?.trim()?.toLocaleLowerCase()
  : "./routes";

const $timeout = process.env.ROXTER_TIMEOUT
  ? `${process.env.ROXTER_TIMEOUT}`?.trim()?.toLocaleLowerCase()
  : "10000";

const $cpus = process.env.ROXTER_CPUS
  ? `${process.env.ROXTER_CPUS}`?.trim()?.toLocaleLowerCase()
  : "0";

const $processCount = os.cpus().length * Number($cpus);

export const HOST = $libmode === "prod" ? os.hostname() : "localhost";
export const PORT = +$port;
export const MODE = $libmode;
export const FILE_ROUTES = $fileRoutes;
export const FILE_PATH = $filePath;
export const PATH_ROUTE = $routePath;
export const FILE_PATH_ABSOLUTE = `${FILE_PATH}/${FILE_ROUTES}`;
export const TIMEOUT = $timeout;
export const CPUS = $cpus;
export const PROCESS = $processCount;
