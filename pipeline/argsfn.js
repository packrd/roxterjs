export default function getArgumentsFn () {
    let callbackList = {}
    for(let args of arguments)
        callbackList[args instanceof Array ? "array" : typeof args] = args;
        return { ...callbackList, id: Math.floor(Math.random() * (1000 - 1) + 1000) };
}