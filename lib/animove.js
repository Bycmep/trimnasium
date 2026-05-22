export function aniMove(element, from, to, speed, clear) {
    return new Promise((resolve) => {

        const name = `_ani${ String(Math.random()).substring(2)}`;
        for (const p in from) element.style[p] = from[p];

        const style = document.createElement("style");
        let css = `@keyframes ${name} { from { `;
        for (const p in from) css += `${p}: ${from[p]}; `;
        css += `} to { `;
        for (const p in to) css += `${p}: ${to[p]}; `;
        css += `}}\n.${name} { animation: ${name} ${speed}s both; }`;
        style.textContent = css;
        document.head.appendChild(style);
        element.classList.add(name);

        setTimeout(() => {
            if (clear) for (const p in to) element.style[p] = '';
            else for (const p in to) element.style[p] = to[p];
            style.remove();
            element.classList.remove(name);
            resolve();
        }, speed*1000);

    });
}