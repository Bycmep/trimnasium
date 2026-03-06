export class Spinner {
    constructor(parameters) {
        this.shape = [ [0,0], [1,2], [0,11], [-1,2] ];
        this.speed = 100; this.fade = 0.75; this.color = '#000'; this.parts = 12;
        if (parameters) for (const p in parameters) this[p] = parameters[p];
        this.e = document.createElement('div');
        const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        this.e.appendChild(svg);
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', this.color);
        svg.setAttribute('stroke-width', 0);
        svg.style.width = '100%'; svg.style.height = '100%';
        const part = [], delta = 2*Math.PI/this.parts;
        let angle = 0;
        for (let i = 0; i < this.parts; i++) {
            const cos = Math.cos(angle), sin = Math.sin(angle); angle += delta;
            let path;
            for (const p of this.shape) {
                const x = 12 + p[0]*cos - (p[1] - 12)*sin, y = 12 + p[0]*sin + (p[1] - 12)*cos;
                if (path) path += `${x},${y} `; else path = `M${x},${y} L`;
            }
            path += 'z';
            part[i] = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            part[i].setAttribute('d', path);
            svg.appendChild(part[i]);
        }
        
        let phase = 0;
        this.spinner = setInterval(() => {
            let opa = 1, n = phase;
            for (let i = 0; i < this.parts; i++) {
                part[n].setAttribute('opacity', opa);
                opa *= this.fade;
                if (n == 0) n = this.parts; n --;
            }
            phase ++; if(phase == this.parts) phase = 0;
        }, this.speed);
    }

    stop() {
        clearInterval(this.spinner);
    }
}
