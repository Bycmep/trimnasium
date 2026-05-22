import { Page } from "./domchain.js";
import { PageParse } from './domchainparse.js';
Page.prototype.parse = PageParse;
import { Ajax } from "./ajax.js";
import { Field } from "./field.js";
import { Spinner } from "./spinner2.js";
import { Alert } from "./alert.js";
import { getCSS } from "./loader.js";

export const main = async (loader) => {
    // TO DO
    // 1. Deletion of categories marked for replacement
    // Maybe should get rid of save concept
    // 3. Keep the screen blocked while requesting how many events has the category
    getCSS("../common.css");
    getCSS("../categories.css");
    const title = 'Modify Categories'; document.title = title;

    const categoriesDB = new Ajax('categories');
    const categories = await categoriesDB.get();
    const eventsDB = new Ajax('events');
    for (const c of categories) { c.id = parseInt(c.id); c.color = parseInt(c.color); }
    const categories_old = structuredClone(categories);
    const to_replace = {};

    Page.body.parse(`
        table.ui#table{ tr.title{ td<$colspan:2>('${title}') }
            tr.head{ td.b(Category) td.b(Color) }
            tr{ td.l.icon.big(➕) }
        }
    `);

    for (let i in categories) insertLine(i);
    function insertLine(n) { // inserts a category row with controls
        const category = categories[n];
        const row = Page.$table.child[Page.$table.child.length - 2].append("tr");
        const name = new Field({
            hardlimit: 32, nonEmpty: true,
            onChange: (value) => { category.name = value; saveCheck(); }
        });
        row.insert("td.b").insert(new Page(name.e)).class('field'); name.set(category.name); 
        const colorbox = new Page(`div.colorbox.c${category.color}`);
        row.insert("td.b.nolh").insert(colorbox);
        row.insert("td.icon").text('🗑').e.onclick = () => {
            new Alert(`Do you want to delete category <b>${category.name}</b>?`).
                buttons([ "Delete", "Cancel" ]).
                handler((i) => { if (i == 0) remove(category.id); });
        };
        async function remove(id) { // remove a category by id
            let n;
            for (let i in categories) if (categories[i].id == id) { n = i; break; }
            const count = await eventsDB.get({ cat: category.id, count: '' });
            if (count > 1) {
                const options = [ "Clear category" ]; const ids = [ 0 ];
                for (let i in categories) if (i != n) {
                    options.push(`Replace with <b>${categories[i].name}</b>`);
                    ids.push(categories[i].id);
                }
                options.push('Cancel');
                new Alert(`${count} event(s) belong to the category <b>${category.name}</b>.`).
                    buttons(options).handler((i) => {
                        if (i == options.length - 1) return;
                        to_replace[id] = ids[i]; doIt();
                    });
            } else doIt();
            function doIt() {
                row.remove(); categories.splice(n, 1); saveCheck();
            }
        }

        colorbox.e.onclick = () => { // pop up a color picker
            const locker = Page.body.insert("div.locker");
            const colorSelect = locker.insert("div.colorselect");
            function place() {
                const box = colorbox.getaBox();
                colorSelect.set({ _top: `${box.top}px`,
                    _left: `${ box.left + box.width/2 - boxSelect.width/2}px` });
            }
            const placer = new ResizeObserver(place);
            for (let i = 1; i <= 12; i++) {
                const select = colorSelect.insert(`div.c${i}`);
                select.e.onclick = () => {
                    colorbox.declass(`c${category.color}`).class(`c${i}`);
                    placer.unobserve(document.body);
                    locker.remove();
                    category.color = i;
                    saveCheck();
                };
            }
            const boxSelect = colorSelect.getaBox();
            place();
            placer.observe(document.body);
        };
    }
/*
    Page.$add.e.onclick = () => { // add a category
        categories.push({ name: 'New category', color: nextColor(), id: nextID() });
        insertLine(categories.length - 1); saveCheck();
        function nextID() {
            let id = 0;
            for (const c of categories) if (c.id > id) id = c.id;
            return id + 1;
        }
        function nextColor() {
            const taken = Array(13).fill(0);
            for (const c of categories) taken[c.color]++;
            let chosen = Math.floor(Math.random()*12 + 1);
            let result = chosen;
            for (let i = 0; i < 12; i++) {
                if (taken[chosen] == 0) return chosen;
                if (taken[chosen] < taken[result]) result = chosen;
                chosen++; if (chosen == 13) chosen = 1;
            }
            return result;
        }
    };

    Page.$save.e.onclick = () => { // save changes
        new Alert("Do you want to save changes?").
            buttons([ "Save", "Cancel" ]).handler(async (choice) => {
                if (choice == 1) return;
                const loader2 = loading();
                let i = 0, i_old = 0;
                while (i < categories.length || i_old < categories_old.length) {
                    const id = i < categories.length? categories[i].id : -1;
                    const id_old = i_old < categories_old.length? categories_old[i_old].id : -1;
                    console.log(id, id_old);
                    if (id_old == -1) {
                        await categoriesDB.post('create', categories[i]);
                        i++; continue;
                    }
                    if (id != id_old) {
                        await categoriesDB.post('delete', { id: id_old });
                        i_old++; continue;
                    }
                    if (categories[i].name != categories_old[i_old].name ||
                        categories[i].color != categories_old[i_old].color)
                            await categoriesDB.post('update', categories[i]);
                    i++; i_old++;
                }
                for (let id in to_replace)
                    await eventsDB.post('replacecat', { from: id, to: to_replace[id] });
                loader2.remove();
                history.back();
        });
    }

    Page.$cancel.e.onclick = () => { history.back(); }
*/
    loader.hide();

    function saveCheck() { // if there are changes, enable Save button
        Page.$save.e.disabled = !changes();
        function changes() {
            if (categories.length != categories_old.length) return true;
            for (let i in categories) {
                const c1 = categories[i], c2 = categories_old[i];
                if (c1.id != c2.id) return true;
                if (c1.name != c2.name) return true;
                if (c1.color != c2.color) return true;
            }
            return false;
        }
    }
}
