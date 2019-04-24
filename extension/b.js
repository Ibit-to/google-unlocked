chrome.webRequest.onHeadersReceived.addListener(details => {
    details.responseHeaders.filter(header => (header.name.toLowerCase() === 'access-control-allow-origin'))
    details.responseHeaders.push({name: 'Access-Control-Allow-Origin', value: '*'})
    return {responseHeaders: details.responseHeaders}
}, {urls: ["https://www.lumendatabase.org/*"]}, ["blocking", "responseHeaders", "extraHeaders"]);


