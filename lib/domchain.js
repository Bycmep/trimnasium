export class Page {
    static body = new Page(document.body);
    #svg;

    constructor(element, parent, svg) {
        this.e = element;
        this.parent = parent;
        this.#svg = svg;
    }

    static #create(type, parent, properties) {
        if (type instanceof Page) { // moving
            if (type.parent) {
                const index = type.parent.child.indexOf(type);
                if (index != -1) type.parent.child.splice(index, 1);
            }
            type.parent = parent; return type.set(properties);
        }
        const tag = type.split('.');
        const svg = (parent.#svg || tag[0].toLowerCase() === 'svg');
        if (tag[0].toLowerCase() === 'text' && !svg) return new Page(document.createTextNode(properties), parent, false);
        const e = (svg)? 
            document.createElementNS("http://www.w3.org/2000/svg", tag[0]) :
            document.createElement(tag[0]);
        for (let i = 1; i < tag.length; i++) e.classList.add(tag[i]);
        return new Page(e, parent, svg).set(properties);
    }

    insert(type, properties) {
        const created = Page.#create(type, this, properties);
        if (!this.child) this.child = [ created ];
        else this.child.push(created);
        this.e.appendChild(created.e);
        return created;
    }

    append(type, properties) {
        const created = Page.#create(type, this.parent, properties);
        const index = this.parent.child.indexOf(this);
        if (index + 1 === this.parent.child.length) this.parent.e.appendChild(created.e);
        else this.parent.e.insertBefore(created.e, this.parent.child[index + 1].e);
        this.parent.child.splice(index + 1, 0, created);
        return created;
    }

    prepend(type, properties) {
        const created = Page.#create(type, this.parent, properties);
        const index = this.parent.child.indexOf(this);
        this.parent.child.splice(index, 0, created);
        this.parent.e.insertBefore(created.e, this.e);
        return created;
    }

    set(properties) {
        for (const property in properties) {
            const value = properties[property];
            const first_char = property.charAt(0);
            if (first_char === '_') { this.e.style[property.substring(1)] = value; continue; }
            if (first_char === '$') { this.e.setAttribute(property.substring(1), value); continue; }
            this.e[property] = value;
        }
        return this;
    }

    up(levels) {
        if (!levels) return this.parent;
        let object = this;
        for (let i = 0; i < levels; i++) object = object.parent;
        return object;
    }

    next(num) {
        if (num === undefined) num = 1;
        const index = this.parent.child.indexOf(this) + num;
        if (num < 0 || num >= this.parent.child.length) return undefined;
        return this.parent.child[num];
    }

    prev(num) {
        if (num === undefined) num = 1;
        return this.next(-num);
    }

    class(classname) { this.e.classList.add(classname); return this; }

    declass(classname) {
        if (!classname) this.e.removeAttribute('class');
        else this.e.classList.remove(classname);
        return this;
    }

    id(id) { Page[`$${id}`] = this; this.e.id = id; return this; }

    html(value) { this.e.innerHTML = value; return this; }

    text(value) { 
        if (this.#svg) this.e.textContent = value;
        else this.e.innerText = value;
        return this;
    }

    getBox() { return this.e.getBoundingClientRect(); }

    clear() { this.e.innerHTML = "";  this.child = undefined; return this; }

    remove() {
        this.e.remove();
        if (!this.parent) return;
        const index = this.parent.child.indexOf(this);
        if (index != -1) this.parent.child.splice(index, 1);
    }

    static inject(css) {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
        return new Page(style);
    }
}