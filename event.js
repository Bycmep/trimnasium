import { Page } from "../lib/domchain.js";

export function createEvent(UI, cell, day, hour) {
    const box = cell.getaBox();
    console.log(UI, box, day, hour);
    Page.setRoot({ ini_x: `${ box.left }px`, ini_y: `${box.top}px`,
        ini_dx: `${ box.width }px`, ini_dy: `${box.height}px` });
    const screen = Page.body.insert("div.blocker");
    const event = screen.insert("div.event.open");
}