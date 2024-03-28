import fs from "node:fs";
import path from "node:path";
import Log from "../log/index.js";

export default function findEndpoints(rootDir) {
    const endpoints = [];
    function traverseDirectory(directory) {
        const files = fs.readdirSync(directory);
        try {    
            files.forEach(file => {
                const filePath = path.join(directory, file);
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    traverseDirectory(filePath);
                } else if (stats.isFile() && (file.endsWith('.js') || file.endsWith('.ts'))) {
                    const fileName = path.parse(file).name;
                    if (['post', 'get', 'put', 'delete'].some(prefix => fileName.startsWith(prefix))) {
                        const relativePath = path.relative(rootDir, filePath).replace(/\\/gi, '/')?.replace(file,'')?.slice(0,-1);
                        const absolutePath = filePath?.replace(/\\/gi,'/');
                        const method = file.split(".")[0];
                        const ext = file.split(".")[1];
                        endpoints.push({
                            relativePath,
                            absolutePath,
                            method,
                            ext,
                        });
                    }
                }
            });
        }
        catch (error) {
            Log(`[error]Error in Find Endpoits: ${JSON.stringify(error)}`);
        }
    }
    traverseDirectory(rootDir);
    return endpoints;
}