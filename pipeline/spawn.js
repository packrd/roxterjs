import { spawnSync } from "child_process";

async function Spawn ({ cmd = "echo", prompt }) {

  // ["text...",">","file"]
  //console.log("PROMPT --->", [...prompt])

  try {
    const result = await spawnSync(cmd, [...prompt], { shell: true });

    if (result.status !== 0) {
      const message = `
        ORIGINAL CMD: ${cmd}
        STDOUT: ${result.stdout && result.stdout.toString()}
        STDERR: ${result.stderr && result.stderr.toString()}
        STATUS: ${result.status}
        ERROR: ${result.error}
      `;
      throw new Error(message);
    }
  
    return result;
  }
  catch {
    throw new Error(`File not save ${__dirname__}`)
  }

}


export default Spawn;