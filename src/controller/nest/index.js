export default function Nest(arr = []) {
    const nest = {};
    const imports = [];
    arr.forEach(({ relativePath, method, absolutePath, ext }, index) => {
        const parts = relativePath.split('/');
        const rename = method + '___' + (index + 1);
        let currentObj = nest;
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                const [fileName] = part.split('.');
                currentObj[fileName] = { name: rename }; 
                imports.push({ relativePath, absolutePath, method, name: rename, ext });
            } else {
                currentObj[part] = currentObj[part] || {};
                currentObj = currentObj[part];
            }
        }
    });
    return { nest, imports };
}
