

self.fetch = new Proxy(self.fetch, {
    apply(target, self, args) {
        const [href, options] = args;

        if (href.includes('.traineddata.gz')) {
            const validateResponse = response => {
                if (response.ok) {
                    return response;
                }
                throw new Error(`[Extract Text From Image] Failed to download traineddata: ${response.statusText} (${response.status})`);
            };

            const fetchTrainedData = async () => {
                let cache;
                try {
                    cache = await caches.open('traineddata');
                } catch (error) {
                    console.warn('[Extract Text From Image] CacheStorage is unavailable. This may impact performance. Possible causes: Brave browser or disabled cookies.');
                }

                if (cache) {
                    const cachedResponse = await cache.match(href);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                }

                try {
                    const response = await Reflect.apply(target, self, args).then(validateResponse);
                    if (cache) {
                        cache.put(href, response.clone());
                    }
                    return response;
                } catch (error) {
                    console.warn('[Extract Text From Image] Error downloading traineddata:', href, error);
                    const fallbackUrl = `https://github.com/naptha/tessdata/blob/gh-pages/${href.split('.com/')[1]}?raw=true`;
                    return Reflect.apply(target, self, [fallbackUrl, options]).then(validateResponse);
                }
            };

            return fetchTrainedData().then(response => {
                return Object.assign(response, {
                    async arrayBuffer() {
                        const reader = response.body.getReader();
                        const chunks = [];
                        let bytesRead = 0;
                        const totalLength = Number(response.headers.get('Content-Length'));

                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            bytesRead += value.byteLength;
                            postMessage({
                                status: 'progress',
                                data: {
                                    status: 'loading language traineddata',
                                    progress: bytesRead / totalLength
                                }
                            });

                            chunks.push(value);
                        }
                        return new Blob(chunks).arrayBuffer();
                    }
                });
            });
        } else {
            return Reflect.apply(target, self, args);
        }
    }
});
