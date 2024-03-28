import "./controller/dotenv/index.js";
import os from "os";
import cluster from "cluster";
import StartProcess from "./compile.js";
import { CPUS } from "./config/envs/index.js";
import Log from "./controller/log/index.js";

const PrimaryProcess = async () => {
    const processOsCPU = +CPUS;
    const processCount = os.cpus().length * processOsCPU;

    if (processOsCPU > 0) {
        Log(`[ok]Primary [green]*${process.pid}* [white]is running...`);
        Log(`[ok]Forking Server with [green]*${processCount}* [white]process`);

        for (let i = 0; i < processCount; i++) {
            cluster.fork();
        }

        cluster.on("exit", (worker, code, signal) => {
            if (code !== 0 && !worker.exitedAfterDisconnect) {
                Log(`[error]Worker [green]*${worker.process.pid}* [red]died`);
                cluster.fork();
            }
        });
    } else {
        cluster.fork();
    }
};

const WorkerProcess = async (rootDir) => {
    return await StartProcess(rootDir);
};

export default async function RoxterJs (rootDir) {
  if (cluster.isWorker) 
    return await WorkerProcess(rootDir);
  return {
      Start: async () => await PrimaryProcess()
  };
}

/* const roxter = await RoxterJs('./../test/src');
roxter.Start(); */