export const Loader = {
    toshow: false, spin: false,
    e: document.createElement('div'),
    alpha: 0, speed: 8,
    show: () => {
        if (Loader.toshow) return;
        Loader.toshow = setTimeout(() => {
            Loader.toshow = false;
            Loader.spin = setInterval(() => {
                Loader.body.setAttribute('transform', `rotate(${Loader.alpha}, 16, 16)`);
                const dx = -8*Math.sin((Loader.alpha)/180*Math.PI);
                const dy = -8 + 8*Math.cos((Loader.alpha)/180*Math.PI);
                Loader.head.setAttribute('transform', `translate(${dx}, ${dy})`)
                Loader.alpha = (Loader.alpha + Loader.speed)%360;
            }, 20);
            Loader.e.classList.add('show');
        }, 200);
    },
    hide: () => {
        if (Loader.toshow) { clearTimeout(Loader.toshow); Loader.toshow = false; return; }
        if (!Loader.spin) return;
        clearInterval(Loader.spin); Loader.e.classList.remove('show'); Loader.spin = false;
    }
};

Loader.e.id = "_loader_";
Loader.e.innerHTML = `
<svg width="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="0">
<defs><radialGradient id="fade" cx="100%" cy="50%" r="100%"><stop offset="30%" /><stop offset="100%" stop-opacity="0.4" /></radialGradient></defs>
<path fill="url(#fade)" d="M4,16 c0,-6.6 5.4,-12 12,-12 6.6,0 12,5.4 12,12 0,6.6 -5.4,12 -12,12 h-10 c-0.55,0 -1,-0.45 -1,-1 0,-0.55 0.45,-1 1,-1 h10 l-1,-3 h-10 c-0.55,0 -1,-0.45 -1,-1 0,-0.55 0.45,-1 1,-1 h9 c2.6,0 7,0 7,-5 0,-4.4 -3.5,-8 -7,-8 -3,0 -7,0 -10,8z" />
<path fill="#333" d="M11.5,22 c0,-2.2 1.8,-4 4,-4 2.2,0 4,1.8 4,4 0,2 -1.8,4 -4,4 -2.2,0 -4,-1.8 -4,-4z m0.25,-1 l-0.5,-4 c0,-1.2 0.5,-1.2 1,-1 l3,3 h0.5 l3,-3 c0.5,-0.2 1,-0.2 1,1 l-0.5,4z" />
</svg>`;
document.body.appendChild(Loader.e);
Loader.body = Loader.e.children[0].children[1];
Loader.head = Loader.e.children[0].children[2];
Loader.show();