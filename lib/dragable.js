export class Dragable {
    #grab;

    constructor(element) {
        this.element = element;
        const obj = this;
        const x = (e) => e.clientX || e.targetTouches[0].pageX + window.scrollX;
        const y = (e) => e.clientY || e.targetTouches[0].pageY + window.scrollY;

        function grab(e) {
            e.preventDefault();
            obj.x_old = obj.x = x(e);
            obj.y_old = obj.y = y(e);
            document.addEventListener('mouseup', drop);
            document.addEventListener('touchend', drop);
            document.addEventListener('mousemove', move);
            document.addEventListener('touchmove', move);

            if (obj.ongrab) obj.ongrab(obj);
        }
        this.#grab = grab;
        function move(e) {
            if (e.clientX) e.preventDefault();
            obj.x = x(e);
            obj.y = y(e);
            obj.dx = obj.x - obj.x_old;
            obj.dy = obj.y - obj.y_old;
            if (obj.onmove) obj.onmove(obj);
        }
        function drop(e) {
            e.preventDefault();
            document.removeEventListener('mouseup', drop);
            document.removeEventListener('touchend', drop);
            document.removeEventListener('mousemove', move);
            document.removeEventListener('touchmove', move);
            if (obj.ondrop) obj.ondrop(obj);
        }
        element.addEventListener('mousedown', this.#grab);
        element.addEventListener('touchstart', this.#grab);
    }

    leave() {
        this.element.removeEventListener('mousedown', this.#grab);
        this.element.removeEventListener('touchstart', this.#grab);
    }
}
