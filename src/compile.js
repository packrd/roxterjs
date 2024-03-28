import Compile from "./controller/fileCompile/index.js";
import findEndpoints from "./controller/findEndpoints/index.js";
import Nest from "./controller/nest/index.js";
import ServerRoxter from "./controller/server/index.js";
import Log from "./controller/log/index.js";

export default async function StartProcess (rootDir = null) {

  if(!rootDir){
    Log('[error] [red]*Erro:* [white]*Root folder* for routes management is incorrect')
    return;
  }

  const endpoints = findEndpoints(rootDir);
  const nest = Nest(endpoints);
  const router = await ServerRoxter();
  
  Compile(nest);
  return router;  
}