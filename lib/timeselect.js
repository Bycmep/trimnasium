"use strict";

import { Page } from "./domchain.js";

class NumberInput {
    constructor(length) {
        this.onChange = this.onLeave = () => {};
        this.$o = Page.body.insert("span.NumberInput").set({ $tabindex: '0' });
        this.length = length;
        this.$e = this.$o.$e;
        const obj = this;

        const show = () => {
            const val = obj.pos? String(obj.value).padStart(obj.pos, '0') : '';
            obj.$o.text(val.padStart(obj.length, '_'));
        }
        
        const handler = (e) => {
            if (e.key === 'Enter') { obj.$e.blur(); return; }
            if (e.key === 'Escape') { obj.change = false; obj.$e.blur(); return; }
            if (e.key === 'Backspace') {
                if (!obj.pos) return;
                obj.value = Math.floor(obj.value/10); obj.pos--;
                show(); return;
            }
            const n = parseInt(e.key);
            if (Number.isNaN(n)) return;
            if (obj.pos == obj.length) return;
            obj.value = obj.pos? obj.value * 10 + n : n; obj.pos++;
            show();
        };

        obj.$e.onfocus = () => {
            obj.value = 0; obj.pos = 0; obj.change = true;
            obj.$e.addEventListener("keydown", handler);
            show();
        };

        obj.$e.onblur = () => {
            obj.$e.removeEventListener("keydown", handler);
            const valid = obj.validate? obj.validate(obj.value) : true;
            if (obj.change && valid) obj.onChange();
            else obj.onLeave();
        };
    }
}

export class NumSelect {
    constructor(number, min, max, increment, length) {
        this.number = number;
        this.$o = Page.body.insert("span.NumSelect");
        const obj = this;
        const numi = new NumberInput(length);
        const num = this.$o.insert(numi.$o);

        const show = () => {
            const s = String(this.number);
            let out = '';
            if (length > s.length) {
                out = '<span style="opacity:0">';
                for (let i = 0; i < length - s.length; i++) out += '0';
                out += '</span>';
            }
            num.html(out + this.number); 
        }
        show();
        const modify = (delta) => {
            this.number += delta;
            if (this.number < min) this.number = min;
            if (this.number > max) this.number = max;
            show();
        };
        numi.onChange = () => { this.number = numi.value; modify(0); };
        numi.onLeave = () => { show(); };

        const buttons = this.$o.insert("div").set({
            _display: 'inline-flex', _flexDirection: 'column'
        });
        const up = buttons.insert("img.button").set({
            src: "data:image/svg+xml;utf8,<svg width='24' height='18' xmlns='http://www.w3.org/2000/svg'><path d='M12,0 l12,18 h-24z'/></svg>"
        });
        const down = buttons.insert("img.button").set({
            src: "data:image/svg+xml;utf8,<svg width='24' height='18' xmlns='http://www.w3.org/2000/svg'><path d='M0,0 h24 l-12,18z'/></svg>"
        });
        up.$e.onclick = _ => { modify(increment); };
        down.$e.onclick = _ => { modify(-increment); };
    }
}

export class TimeSelect {
    constructor(minutes, increment) {
        this.minutes = minutes;
        this.maxTime = 24*60 - 1;
        this.minTime = 0;
        this.$o = Page.body.insert("span.TimeSelect");
        const obj = this;
        const hri = new NumberInput(2);
        const hr = this.$o.insert(hri.$o);
        const mini = new NumberInput(2);
        const min = this.$o.insert("text", ':').append(mini.$o);
        const am = this.$o.insert("span.am");
        const showTime = _ => {
            this.time = {};
            let h = Math.floor(this.minutes/60);
            this.time.am = h >= 12? 'pm' : 'am';
            h = h > 12? h - 12 : h;
            this.time.hr = String(h).padStart(2, '0');
            this.time.min = String(this.minutes%60).padStart(2, '0');
            hr.text(this.time.hr); min.text(this.time.min); am.text(this.time.am);
        }
        showTime();

        const modify = (delta) => {
            this.minutes += delta;
            if (this.minutes < obj.minTime) this.minutes = obj.minTime;
            if (this.minutes > obj.maxTime) this.minutes = obj.maxTime;
            showTime();
        };
        const fits = (t) => { return (t >= obj.minTime && t <= obj.maxTime); }
        hri.validate = (value) => { return value < 24; }
        hri.onChange = () => {
            const hr = obj.minutes >= 12*60? hri.value + 12 : hri.value;
            obj.minutes = hr*60 + obj.minutes%60;
            if (hri.value <= 12) {
                if (!fits(obj.minutes)) {
                    if (fits(obj.minutes + 12*60)) obj.minutes += 12*60;
                    else if (fits(obj.minutes - 12*60)) obj.minutes -= 12*60;
                }
            }
            modify(0);
        }
        hri.onLeave = showTime;
        mini.validate = (value) => { return value < 60; }
        mini.onChange = () => {
            obj.minutes = obj.minutes - obj.minutes%60 + mini.value;
            modify(0);
        }
        mini.onLeave = showTime;
        am.$e.onclick = () => {
            const new_time = obj.minutes >= 12*60? obj.minutes - 12*60 : obj.minutes + 12*60;
            if (fits(new_time)) {
                obj.minutes = new_time; showTime();
            }
        };

        const buttons = this.$o.insert("div").set({
            _display: 'inline-flex', _flexDirection: 'column'
        });
        const up = buttons.insert("img.button").set({
            src: "data:image/svg+xml;utf8,<svg width='24' height='18' xmlns='http://www.w3.org/2000/svg'><path d='M12,0 l12,18 h-24z'/></svg>"
        });
        const down = buttons.insert("img.button").set({
            src: "data:image/svg+xml;utf8,<svg width='24' height='18' xmlns='http://www.w3.org/2000/svg'><path d='M0,0 h24 l-12,18z'/></svg>"
        });
        up.$e.onclick = _ => { modify(increment); };
        down.$e.onclick = _ => { modify(-increment); };
     }
}
