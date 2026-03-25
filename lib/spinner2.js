export class Spinner2 {
    constructor(parameters) {
        this.speed = 20;
        if (parameters) for (const p in parameters) this[p] = parameters[p];
        this.e = document.createElement('div');
        this.e.innerHTML = `
<svg width="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="0"
<defs>
    <radialGradient id="fade" cx="100%" cy="50%" r="100%">
      <stop offset="30%" /><stop offset="100%" stop-opacity="0.4" />
    </radialGradient>
    <radialGradient id="fade2" cx="50%" cy="50%" r="50%">
      <stop offset="60%" /><stop offset="100%" stop-opacity="0.3" />
    </radialGradient>
</defs>
<path id="body" fill="url(#fade)" d="M4,16 c0,-6.6 5.4,-12 12,-12 6.6,0 12,5.4 12,12 0,6.6 -5.4,12 -12,12 h-9 c-0.55,0 -1,-0.45 -1,-1 0,-0.55 0.45,-1 1,-1 h9 l-1,-3 h-9 c-0.55,0 -1,-0.45 -1,-1 0,-0.55 0.45,-1 1,-1 h8 c2.6,0 7,0 7,-5 0,-4.4 -3.5,-8 -7,-8 -3,0 -7,0 -10,8z" />
<path id="head" fill="url(#fade2)" d="M0,0 h3 l1.5,-3 1.5,5 c0,2.5 -2,4.5 -4.5,4.5 -2.5,0 -4.5,-2 -4.5,-4.5 l1.5,-5z" />
</svg>`;

        const body = this.e.children[0].children[2];
        const head = this.e.children[0].children[3];
        let alpha = 0, da = this.speed;
        function spin() {
            body.setAttribute('transform', `rotate(${alpha}, 16, 16)`);
            let dx = 16 - 10*Math.sin((alpha)/180*Math.PI);
            let dy = 11 + 8*Math.cos((alpha)/180*Math.PI);
            head.setAttribute('transform', `translate(${dx}, ${dy})`)
            alpha = (alpha + da)%360;
        }
        spin();
        this.spinner = setInterval(spin, 40);
    }

    stop() {
        clearInterval(this.spinner);
    }
}
