import os from "os";

const $libmode = (process.env.ROXTER_MODE)?`${process.env.ROXTER_MODE}`?.trim()?.toLocaleLowerCase():"dev";
const $port = (process.env.ROXTER_PORT)?`${process.env.ROXTER_PORT}`?.trim()?.toLocaleLowerCase():3333;
const $hostname = (process.env.ROXTER_HOSTNAME)?`${process.env.ROXTER_HOSTNAME}`?.trim()?.toLocaleLowerCase():false;
const $fileRoutes = (process.env.ROXTER_FILE_ROUTES)?`${process.env.ROXTER_FILE_ROUTES}`?.trim()?.toLocaleLowerCase():'app.routes.js';
const $timeout = (process.env.ROXTER_TIMEOUT)?`${process.env.ROXTER_TIMEOUT}`?.trim()?.toLocaleLowerCase():'10000';
const $cpus = (process.env.ROXTER_CPUS)?`${process.env.ROXTER_CPUS}`?.trim()?.toLocaleLowerCase():'0';
const $processCount = os.cpus().length * Number($cpus);

export const HOST = ($libmode==="prod")?os.hostname():$hostname||"localhost";
export const PORT = $port;
export const MODE = $libmode;
export const FILE_ROUTES = $fileRoutes;
export const TIMEOUT = $timeout;
export const CPUS = $cpus;
export const PROCESS = $processCount;
