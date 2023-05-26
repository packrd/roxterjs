import os from "os";
import cluster from "cluster";
import Server from "./server.js";

const PrimaryProcess = () => {
    
    const processOsCPU = +process.env.ROXTER_OS_CPU_FORK || 0;
    const processCount = os.cpus().length * processOsCPU;

    if(processOsCPU > 0) {

        console.log(`Primary ${process.pid} is running`);
        console.log(`Forking Server with ${processCount} process\n`);
    
        for(let i = 0; i < processCount; i++){
            cluster.fork();
        }
    
        cluster.on("exit", (worker, code, signal) => {
            if(code !== 0 && !worker.exitedAfterDisconnect){
                console.log(`Worker ${worker.process.pid} died...`);
                cluster.fork();
            }
        })
    }
    else {
        cluster.fork();
    }
    
}

const WorkerProcess = async () => {
    await Server();
}

export const Cluster = cluster.isWorker ? WorkerProcess() : PrimaryProcess();
