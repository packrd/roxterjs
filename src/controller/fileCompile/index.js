import fs from "node:fs";
import { FILE_PATH_ABSOLUTE, FILE_PATH } from "../../config/envs/index.js";

export default async function Compile({ imports }) {
  const createImports = imports.map(
    ({ absolutePath, name }) =>
      `import ${name} from "${absolutePath?.replace(FILE_PATH, ".")}";`
  );
  const createExports = imports.map(
    ({ relativePath, method, name }) =>
      `"${method}::/${relativePath}": ${name},`
  );
  const writeFile = `${createImports.join(
    "\n"
  )}\n\nexport default {\n${createExports.join("\n")}\n}`;
  fs.writeFileSync(FILE_PATH_ABSOLUTE, writeFile, "utf-8");
}
