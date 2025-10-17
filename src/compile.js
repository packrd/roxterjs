import FileCompile from "./controller/fileCompile/index.js";
import FindEndpoints from "./controller/findEndpoints/index.js";
import Nest from "./controller/nest/index.js";
import ServerRoxter from "./controller/server/index.js";
import fs from "node:fs";

export default async function StartProcess(rootDir = null) {
  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir, { recursive: true });
  }

  const endpoints = FindEndpoints(rootDir);
  const nest = Nest(endpoints);
  const router = await ServerRoxter();

  FileCompile(nest);
  return router;
}
