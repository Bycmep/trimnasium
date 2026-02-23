export class Phone {
    constructor(parameters) {
        const obj = this;
        obj.template = "(___) ___-____";
        if (parameters) for (const p in parameters) obj[p] = parameters[p];
        const e = document.createElement('input');
        e.type = 'tel';
        const tchars = obj.template.split("");
        obj.phonelength = 0;
        for (const c of tchars) if (c === '_') obj.phonelength++;

        let old_sel = 0, old_value = "";

        obj.olddigits = 0;
        const digits = (s) => {
            let n = 0;
            for (const c of s) if (c >= '0' && c <= '9') n++;
            return n;
        }

        e.oninput = () => {
            let i, digits = 0, value = '';
            for (i = 0; i < e.selectionStart; i++) {
                const c = e.value.charAt(i);
                if (c >= '0' && c <= '9') digits++;
            }
            i = 0;
            for (const c of e.value) {
                if (c >= '0' && c <= '9') {
                    while (tchars[i] != '_') value += tchars[i++]; 
                    value += c; i++;
                    if (i >= tchars.length) break;
                }
            }
            e.value = value;
            for (i = 0; i < value.length; i++) {
                if (digits == 0) break;
                const c = e.value.charAt(i);
                if (c >= '0' && c <= '9') digits--;
            }
            e.setSelectionRange(i, i);
        }
        e.onblur = () => {
            if (obj.onChange) obj.onChange(obj.get());
        }
        this.e = e;
    }

    get() {
        let res = "";
        for (const c of this.e.value) if (c >= '0' && c <= '9') res += c;
        if (res.length === this.phonelength) return res;
        return undefined;
    }

    set(value) {
        this.e.value = value; this.e.oninput();
    }
}
