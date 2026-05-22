export class Alert {
    #e; #p; #handler;
    constructor(text) {
        this.#e = document.createElement('div');
        this.#e.classList.add('_alert_');
        const alert = document.createElement('div');
        this.#e.appendChild(alert);
        alert.innerHTML = text;
        this.#p = document.createElement('p');
        this.#p.classList.add('buttons');
        alert.appendChild(this.#p);
        this.buttons(['OK']);
        this.#handler = () => {};
        document.body.appendChild(this.#e);
    }
    class(classname) {
        this.#e.classList.add(classname);
        return this;
    }
    buttons(buttons) {
        const obj = this;
        obj.#p.innerHTML = '';
        for (let i in buttons) {
            const b = document.createElement('button');
            b.innerHTML = buttons[i];
            obj.#p.appendChild(b);
            b.onclick = () => {
                obj.#e.remove();
                obj.#handler(i); 
            }
        }
        return this;
    }
    handler(handler) {
        this.#handler = handler;
        return this;
    }
}
