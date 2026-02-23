export class Ajax {
    static URL = 'api.php';
    constructor (object) {
        this.object = object;
    }

    async get(parameters) {
        let s = Ajax.URL + '?' + this.object;
        if (parameters) for (const p in parameters) s += `&${p}=${parameters[p]}`;
        return this.request(s);
    }

    async post(parameters) {
        return this.request(parameters, 'POST');
    }

    async request(parameters, method) {
        let formdata;
        if (method) {
            formdata = new FormData();
            formdata.append('_obj_', this.object);
            for (let p in parameters) formdata.append(p, parameters[p]);
        }

        let data;
        try {
            const response = method? await fetch(Ajax.URL, { method: method, body: formdata }) :
                await fetch(parameters);
            if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
            const result = await response.text();
            try {
                data = JSON.parse(result);
            } catch (e) {
                const tmp = document.createElement("div");
                tmp.innerHTML = result;
                tmp.remove();
                throw new Error(tmp.innerText);
            }
        } catch (e) { console.error(e); }

        if (data.log) console.info(data.log.replaceAll('^', '\n'));
        return data.data;
    }
}

