import "./controller/dotenv/index.js";
import cluster from "cluster";
import StartProcess from "./compile.js";
import { CPUS, PROCESS, PATH_ROUTE } from "./config/envs/index.js";
import Log from "./controller/log/index.js";

const PrimaryProcess = async ({ ...props }) => {
  const processOsCPU = +CPUS;
  const processCount = +PROCESS;

  if (processOsCPU > 0) {
    Log(`[ok]Primary [green]*${process.pid}* [white]is running...`);
    Log(`[ok]Forking Server with [green]*${processCount}* [white]process`);

    for (let i = 0; i < processCount; i++) {
      cluster.fork({ ...props });
    }

    cluster.on("exit", (worker, code, signal) => {
      if (code !== 0 && !worker.exitedAfterDisconnect) {
        Log(`[error]Worker [green]*${worker.process.pid}* [red]died`);
        cluster.fork({ ...props });
      }
    });
  } else {
    cluster.fork({ ...props });
  }
};

const WorkerProcess = async () => {
  return await StartProcess(PATH_ROUTE);
};

export default async function RoxterJs() {
  if (cluster.isWorker) return await WorkerProcess();
  return {
    Start: async (props = {}) => await PrimaryProcess(props),
  };
}
