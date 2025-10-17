export function getParams(url) {
  const params = {};
  const queryString = url.split("?")[1];
  if (queryString) {
    const keyValuePairs = queryString.split("&");
    keyValuePairs.forEach((keyValuePair) => {
      const [key, value] = keyValuePair.split("=");
      params[key] = decodeURIComponent(value);
    });
  }
  return params;
}
