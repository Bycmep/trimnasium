export class Alert {
    constructor(text, buttons, handler, css) {
        this.css = css? css : `
@keyframes _alert_in_ { from { opacity: 0; } to { opacity: 1; } }
@keyframes _alert_out_ { from { opacity: 1; } to { opacity: 0; } }
div._alert_ {
    position: fixed; left: 0; top: 0; right: 0; bottom: 0;
    background-color: rgba(0,0,0,0.3);
    display: flex; align-items: center; justify-content: center;
    div { background-color: white; border: 0.05em solid black; border-radius: 0.7em;
        text-align: center; padding: 0.6em 1em; 
        &.in { animation: _alert_in_ 0.2s both; }
        &.out { animation: _alert_out_ 0.2s both; }
    }
    p.buttons { text-align: center; margin: 0.5em 0; }
    button { width: 6em; margin: 0 0.5em; }
}
        `;
        const obj = document.createElement('div');
        obj.classList.add('_alert_');
        document.body.appendChild(obj);
        const style = document.createElement('style');
        style.innerText = this.css;
        obj.appendChild(style);
        const alert = document.createElement('div');
        obj.appendChild(alert);
        alert.innerHTML = text;
        const p = document.createElement('p');
        p.classList.add('buttons');
        alert.appendChild(p);
        for (let i in buttons) {
            const b = document.createElement('button');
            b.innerText = buttons[i];
            p.appendChild(b);
            b.onclick = () => {
                alert.classList.remove('in');
                alert.classList.add('out');
                setTimeout(() => { obj.remove(); handler(i); }, 200); 
            }
        }
        alert.classList.add('in');
    }
}
