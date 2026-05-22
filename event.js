import { Page } from "../lib/domchain.js";
import { aniMove } from "./lib/animove.js";
import { Field } from "./lib/field.js";


export function createEvent(UI, cell, day, hour) {
    const box = cell.getaBox();
    const screen = Page.body.insert("div.blocker");
    const event = screen.insert("div.eventscreen");
    aniMove(event.e, { left: `${box.left}px`, top: `${box.top}px`,
        width: `${box.width}px`, height: `${box.height}px` },
        { left: '8vw', top: '8vh', width: '84vw', height: '84vh' }, 0.2, true
    ).then(showUI);

    function showUI() {
        console.log(UI, day, hour);
        function toTime(min) {
            return Math.floor(min/60).toString().padStart(2, '0')
                + ':' + (min%60).toString().padStart(2, '0');
        }

        const datalist = event.insert("datalist").id('times');
        for (let min = hour*60; min < hour*60 + 30; min += 5)
            datalist.insert("option", { value: toTime(min) });
        event.parse(`
            table{ tr{ th<$colspan:2>(New Appointment) }
                tr.spacer
                tr{ td.r(Time) td.l{ input<type:time,$list:times>#time } }
                tr{ td.r(Duration) td.l{ input<type:number,min:15,max:120,step:5,value:60>#duration "min" } }
                tr{ td.r(Category) td.l#rating }
                tr{ td.r(Dog) td.l#rating }
                tr{ td.r td.l#details }
                tr{ td.r(Phone) td#photos }
                tr{ td.r(Services) td{ br#notes } }
                tr{ td.r(Notes) td.l{ br#notes } }
                tr{ td<$colspan:2>{ p.buttons{ button#save(Save) button#cancel(Cancel) }}}
                tr.spacer
            }
        `);
        const field = {};
        field.notes = new Field({ hardlimit: 4000, allowCR: true });
        for (const f in field) Page[`$${f}`].replace(new Page(field[f].e)).class('field');




        Page.$time.set({ value: toTime(hour*60) });

    }

}

