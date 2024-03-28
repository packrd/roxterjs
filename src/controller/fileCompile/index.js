import fs from "node:fs";
import { FILE_ROUTES } from "../../config/envs/index.js";

export default async function Compile ({ imports }){
  const createImports = imports.map(({ absolutePath, name })=>`import ${name} from "${absolutePath}";`);
  const createExports = imports.map(({ relativePath, method, name })=>`"${method}::/${relativePath}": ${name},`);
  const writeFile = `${createImports.join("\n")}\n\nexport default {\n${createExports.join("\n")}\n}`;
  fs.writeFileSync(FILE_ROUTES, writeFile, "utf-8");
}
