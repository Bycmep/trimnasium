export class Field {
    constructor (parameters) {
/*  default value is false unless specified
    maxlength: maximum text length, the submitted value will be trimmed, default: 255,
    placeholder: text to display when no value,
    hardlimit: maximum text length, checked at typing,
    onChange: a function to pass the text value to when the input is commited,
    onLeave: a function to call if the value is unchanged,
    nonEmpty: if true, clearing the value will restore the initial one,
    dictionary: an array of values to select from a drop-down list upon input,
    dictionaryMaxLength: max number of dictionary entries to show, default: 12,
    dictionaryOnly: only values from the dictionary are allowed,
    dictionaryAdd: a function to add a new value to the dictionary,
    dictionaryNoSort: don't sort the dictionary,
    allowedChar: a function to check if input chars are allowed,
    allowTags: tags are allowed in input,
    allowCR: carriage returns are allowed in input,
    noTrim: don't trim the whitespace */
        const element = this.e = document.createElement('div');
        const obj = this;
        obj.maxlength = parameters.hardlimit? parameters.hardlimit : 255;
        obj.dictionaryMaxLength = 12;
        if (parameters) for (const p in parameters) obj[p] = parameters[p];
        let dict, resizer; this.value = "";
        element.contentEditable = true; 

        this.#placeholder();
        element.style.cursor = "pointer";
        element.addEventListener("focus", start);
        element.addEventListener("blur", finish);
        element.addEventListener("keydown", keydown);
        element.addEventListener("keyup", keyup);
        element.addEventListener("paste", paste, true);

        function start() {
            element.style.cursor = "auto"; element.classList.add('isedited');
            if (!obj.value) { element.innerHTML = ""; }
            createDictionary();
            element.click();
        };

        function finish(e) {
            console.log('finish');
            if (obj.dict_active) { console.log('abort'); e.preventDefault(); return; }
            if (dict) {
                resizer.disconnect();
                dict.remove(); dict = false;
            }
            element.style.cursor = "pointer";
            element.classList.remove("isedited");

            let old_value = obj.value; obj.value = getText();
            if (obj.dictionary && obj.value && !obj.dictionary.includes(obj.value)) {
                if (obj.dictionaryOnly) obj.value = old_value;
                else {
                    obj.dictionary.push(obj.value);
                    if (!obj.dictionaryNoSort) obj.dictionary.sort();
                    if (obj.dictionaryAdd) obj.dictionaryAdd(obj.value);
                }
            }
    
            if (obj.nonEmpty && !obj.value) obj.value = old_value;
            element.innerText = obj.value;
            obj.#placeholder();
            if (old_value == obj.value && obj.onLeave) obj.onLeave(obj.value);
            else if (obj.onChange) obj.onChange(obj.value);
        };

        function keydown(e) {
            if (['Control', 'Alt'].includes(e.key)) obj[e.key] = true;
            if (e.key === "Escape") element.innerText = obj.value;
            if (e.key === "Escape" || (e.key === "Enter" && !obj.allowCR)) {
                e.preventDefault(); element.blur(); return;
            }
            if (e.key.length > 1 || obj.Control || obj.Alt) return;
            if ((obj.hardlimit && element.innerText.length >= obj.hardlimit) || 
                (obj.allowedChar && !obj.allowedChar(e.key))) e.preventDefault();
        };

        function keyup(e) {
            if (['Control', 'Alt'].includes(e.key)) obj[e.key] = false;
            if (obj.dictionary) fillDictionary();
        }
        
        function createDictionary() {
            if (!obj.dictionary) return;
            if (!obj.dictionaryNoSort) obj.dictionary.sort();
            dict = document.createElement("div"); document.body.appendChild(dict);
            dict.classList.add('dictionary');
            dict.style.position = 'absolute'; dict.style.cursor = "pointer";
            placeDictionary(); fillDictionary();
            dict.onmouseover = _ => { obj.dict_active = true; };
            dict.onmouseout = _ => { obj.dict_active = false; };
            resizer = new ResizeObserver(placeDictionary);
            resizer.observe(element);
        }

        function placeDictionary() {
            const box = element.getBoundingClientRect();
            dict.style.top = `${box.bottom + window.scrollY}px`;
            dict.style.left = `${box.left + window.scrollX}px`;
        }

        function fillDictionary() {
            dict.innerHTML = ""; const text = getText().toLowerCase(); let length = 0;
            for (const s of obj.dictionary) if (s.toLowerCase().includes(text)) {
                const e = document.createElement("div"); dict.appendChild(e); e.innerText = s;
                e.onclick = _ => { 
                    console.log(s);
                    obj.dict_active = false; element.innerText = s; finish(); };
                if (!obj.dictionaryMaxLength) continue;
                if (++length >= obj.dictionaryMaxLength) break;
            }
        }

        function paste(e) {
            e.preventDefault();
            let to_paste = obj.filter(e.clipboardData.getData('text/plain'));
            if (to_paste == "") return;
            document.execCommand('insertText', false, to_paste);
            if (obj.hardlimit && element.innerText.length > obj.hardlimit)
                element.innerText = element.innerText.substring(0, obj.hardlimit);
        }

        function getText() { return obj.filter(element.innerText).substring(0, obj.maxlength); }
    }

    #placeholder() {
        if (!this.placeholder || this.value) return;
        const span = document.createElement("span");
        this.e.appendChild(span);
        span.classList.add("placeholder");
        span.innerText = this.placeholder;
        span.style.pointerEvents = 'none';
    }

    filter(s) {
        if (s === '\r') return "";
        if (!this.allowTags) s = s.replace(/<[^>]*>?/gm, '');
        if (!this.allowCR) s = s.replace(/[\n\r]/g, '');
        if (this.allowedChar) {
            let filtered = "";
            for (const c of s) if (this.allowedChar(c)) filtered += c;
            s = filtered;
        }
        if (!this.noTrim) s = s.trim();
        return s;
    }

    set(s) {
        this.value = this.filter(s).substring(0, this.maxlength); this.e.innerHTML = this.value;
        this.#placeholder();
    }

}