

self.fetch = new Proxy(self.fetch, {
    apply(target, self, args) {
        const [href, options] = args;

        if (href.includes('.traineddata.gz')) {
           
            const validate = r => {
                if (r.ok) {
                    return r;
                }
                throw Error('[Extract Text From Image] Cannot download traineddata (' + r.status + ')');
            };

            const promise = new Promise(resolve => {
                resolve();
            }).then(async () => {
                let cache = null;

                
                try {
                    cache = await caches.open('traineddata');
                } catch (e) {
                    console.warn('[Extract Text From Image] CacheStorage interface is not available which may affect performance. Might be the Brave browser or disabled cookies.');
                }

                if (cache) {
                    const er = await cache.match(href);
                    if (er) {
                        // console.log('[Extract Text From Image] trained data cache hit');
                        return er;
                    }
                }

                const r = await Reflect.apply(target, self, args).then(validate).catch(e => {
                    console.warn('[Extract Text From Image] Cannot download the traineddata', href, e);
                    const path = href.split('.com/')[1];

                    return Reflect.apply(target, self, [`https://github.com/naptha/tessdata/blob/gh-pages/${path}?raw=true`, options]).then(validate);
                });

                // save
                if (cache) {
                    cache.put(href, r.clone());
                }

                // return
                return Object.assign(r, {
                    async arrayBuffer() {
                        const reader = r.body.getReader();
                        const chunks = [];
                        let bytes = 0;

                        const length = Number(r.headers.get('Content-Length'));

                        // eslint-disable-next-line no-constant-condition
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) {
                                break;
                            }

                            bytes += value.byteLength;
                            postMessage({
                                status: 'progress',
                                data: {
                                    status: 'loading language traineddata',
                                    progress: bytes / length
                                }
                            });

                            chunks.push(value);
                        }
                        const ab = await new Blob(chunks).arrayBuffer();
                        return ab;
                    }
                });

            });

            return promise;
        }
        else {
            return Reflect.apply(target, self, args);
        }
    }
});

self.importScripts('tesseract/worker.min.js');
