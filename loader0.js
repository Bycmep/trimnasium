export const Loader = {
    alpha: 0, speed: 8,
    show: () => {
        Loader.e = document.getElementById('_loader_');
        console.log(Loader.e, Loader.e.children, Loader.e.children[0].children );
        const body = Loader.e.children[0].children[1];
        const head = Loader.e.children[0].children[2];
        Loader.spin = setInterval(() => {
            body.setAttribute('transform', `rotate(${Loader.alpha}, 16, 16)`);
            const dx = -8*Math.sin((Loader.alpha)/180*Math.PI);
            const dy = -8 + 8*Math.cos((Loader.alpha)/180*Math.PI);
            head.setAttribute('transform', `translate(${dx}, ${dy})`)
            Loader.alpha = (Loader.alpha + Loader.speed)%360;
        }, 20);
        Loader.e.classList.remove('hide');
    },
    hide: () => {
        clearInterval(Loader.spin); Loader.e.classList.add('hide');
    },
    hideWhen: (check) => {
        Loader.checker = setInterval(() => {
            if (check()) { clearInterval(Loader.checker); Loader.hide(); }
        }, 1);
    }
};
Loader.show();