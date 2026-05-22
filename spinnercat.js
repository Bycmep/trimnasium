export class Spinner {
    constructor(parameters) {
        this.speed = 20;
        this.e = document.createElement('div');
        this.e.innerHTML = `
<svg width="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="0">
<defs><radialGradient id="fade" cx="100%" cy="50%" r="100%"><stop offset="30%" /><stop offset="100%" stop-opacity="0.4" /></radialGradient></defs>
<path fill="url(#fade)" d="M4,16 c0,-6.6 5.4,-12 12,-12 6.6,0 12,5.4 12,12 0,6.6 -5.4,12 -12,12 h-9 c-0.55,0 -1,-0.45 -1,-1 0,-0.55 0.45,-1 1,-1 h9 l-1,-3 h-9 c-0.55,0 -1,-0.45 -1,-1 0,-0.55 0.45,-1 1,-1 h8 c2.6,0 7,0 7,-5 0,-4.4 -3.5,-8 -7,-8 -3,0 -7,0 -10,8z" />
<path fill="#333" d="M11.5,20 c0,-2.2 1.8,-4 4,-4 2.2,0 4,1.8 4,4 0,2 -1.8,4 -4,4 -2.2,0 -4,-1.8 -4,-4z m0.25,-1 l-0.5,-4 c0,-1.2 0.5,-1.2 1,-1 l3,3 h0.5 l3,-3 c0.5,-0.2 1,-0.2 1,1 l-0.5,4z" />
        </svg>`;
        const body = this.e.children[0].children[2];
        const head = this.e.children[0].children[3];
        let alpha = 0;
        function spin() {
            const da = 8;
            body.setAttribute('transform', `rotate(${alpha}, 16, 16)`);
            const dx = - 6*Math.sin((alpha)/180*Math.PI);
            const dy = -5 + 8*Math.cos((alpha)/180*Math.PI);
            head.setAttribute('transform', `translate(${dx}, ${dy})`)
            alpha = (alpha + da)%360;
        }
        spin();
        this.spinner = setInterval(spin, 40);
    }
    show() {
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
    hide() {
        clearInterval(this.spinner);
    }
}
