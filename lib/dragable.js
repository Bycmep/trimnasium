export class Dragable {
    #grab; #cursor;

    constructor(element) {
        this.element = element;
        const obj = this;

        function grab(e) {
            e.preventDefault();
            obj.x_old = obj.x = e.clientX + window.scrollX;
            obj.y_old = obj.y = e.clientY + window.scrollY;
            this.#cursor = element.style.cursor;
            element.style.cursor = 'grabbing';  
            document.addEventListener('mouseup', drop);
            document.addEventListener('mousemove', move);
            if (obj.ongrab) obj.ongrab(obj);
        }
        this.#grab = grab;
        function move(e) {
            e.preventDefault();
            obj.x = e.clientX + window.scrollX;
            obj.y = e.clientY + window.scrollY;
            obj.dx = obj.x - obj.x_old;
            obj.dy = obj.y - obj.y_old;
            if (obj.onmove) obj.onmove(obj);
        }
        function drop(e) {
            e.preventDefault();
            element.style.cursor = obj.#cursor;
            document.removeEventListener('mouseup', drop);
            document.removeEventListener('mousemove', move);
            if (obj.ondrop) obj.ondrop(obj);
        }
        element.addEventListener('mousedown', this.#grab);
    }

    leave() { this.element.removeEventListener('mousedown', this.#grab); }
}
