"use strict";

/** Sends XMLHttpRequests to server via promises. The response is parsed as JSON, then passed on if no execution errors are detected. Server execution messages are output to console. */
export class Ajax {
    /**
     * @param { String } url - URL to send requests to
     */
    constructor (url) {
        this.url = url;
    }

    #call (method, input) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            if (!input) input = {};

            request.onreadystatechange = _ => {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        let data;
                        try {
                            data = JSON.parse(request.responseText);
                        } catch (e) {
                            const tmp = document.createElement("div");
                            tmp.innerHTML = request.responseText;
                            console.error(tmp.innerText);
                            tmp.remove();
                            return;
                        }
                        if (data.log) console.info(data.log.replaceAll('^', '\n'));
                        if (data.err) return;
                        if (resolve) resolve(data.data);
                    } else reject(request.status);
                }
            };
    
            if (method == "GET") {
                let params = "";
                for (const i in input) {
                    if (params) params += "&";
                    params += `${i}=${input[i]}`;
                }
                request.open("GET", `${this.url}?${params}`, true);
                request.send();
            } else {
                request.open(method, this.url, true);
                request.setRequestHeader("Content-type", "application/json");
                request.send(JSON.stringify(input));
            }
        });
    }
    /**
     * A promise to send an HTTP request using GET method.
     * @param { Map } input - arguments to send
     * @returns { Promise } the value is a map with "err" record (true if an error was detected), "log" record (execution log, it is also output to console); other records depend on the request
     */
    get(input) {
        return this.#call("GET", input);
    }
    /**
     * A promise to send an HTTP request using POST method.
     * @param { Map } input - arguments to send
     * @returns { Promise } the value is a map with "err" record (true if an error was detected), "log" record (execution log, it is also output to console); other records depend on the request
     */
    post(input) {
        return this.#call("POST", input);
    }
    /**
     * A promise to send an HTTP request using UPDATE method.
     * @param { Map } input - arguments to send
     * @returns { Promise } the value is a map with "err" record (true if an error was detected), "log" record (execution log, it is also output to console); other records depend on the request
     */
    put(input) {
        return this.#call("PUT", input);
    }
    /**
     * A promise to send an HTTP request using DELETE method.
     * @param { Map } input - arguments to send
     * @returns { Promise } the value is a map with "err" record (true if an error was detected), "log" record (execution log, it is also output to console); other records depend on the request
     */
    delete(input) {
        return this.#call("DELETE", input);
    }
}