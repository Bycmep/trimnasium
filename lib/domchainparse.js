export function PageParse(code) {
    let quoteChar;
    const isQuoted = (char) => {
        if (quoteChar) { if (char === quoteChar) quoteChar = false; return true; }
        if (char === "'" || char === '"') { quoteChar = char; return true; }
        return false;
    };

    const readBlock = (start, parent, grandparent) => {
        let pos = start;
        while (pos < code.length) {
            const char = code.charAt(pos++);
            if (isQuoted(char)) continue;
            if (char === '{') { 
                const new_parent = readElement(code.substring(start, pos - 1).trim(), parent);
                start = readBlock(pos, new_parent, parent);
                pos = start;
            } else if (char === '}') {
                readElement(code.substring(start, pos - 1).trim(), parent);
                if (!grandparent) throw new Error("Nesting error: closing bracket is unmatched.");
                return pos;
            }
        }
        readElement(code.substring(start, pos).trim(), parent);
        if (grandparent) throw new Error("Nesting error: opening bracket is unmatched.");
    };

    const readElement = (text, parent) => {
        if (!text) return parent;

        const TAG = 0, PARAM = 1, TEXT = 2, ID = 3, WSPACE = -1, NA = -2;
        const content = [ "", "", "", "" ];
        let obj = null;
        const createElement = _ => {
            const unquote = (s) => {
                if (s.length < 2) return s;
                const c = s.charAt(0);
                if (c !== "'" && c !== '"') return s;
                const cc = s.charAt(s.length - 1);
                if (c !== cc) return s;
                return s.substring(1, s.length - 1);
            };

            if (content[TAG][0] === "'" || content[TAG][0] === '"') {
                obj = parent.insert("text", unquote(content[TAG]));
            } else obj = parent.insert(content[TAG]);
            content[TAG] = "";

            if (content[PARAM]) {
                const map = {};
                const pair = [ "", "" ];
                let i = 0;
                const add_pair = _ => { if (pair[0]) map[pair[0]] = unquote(pair[1]);
                    pair[0] = ""; pair[1] = ""; i = 0; };
                for (const c of content[PARAM]) {
                    if (isQuoted(c)) { pair[i] += c; continue; }
                    if (c == ':' && i == 0) { i = 1; continue; }
                    if (c == ',') { add_pair(); continue; }
                    if (c > ' ') pair[i] += c;
                }
                add_pair();
                obj.set(map);
                content[PARAM] = "";
            }

            if (content[TEXT]) {
                obj.html(unquote(content[TEXT].trim())); content[TEXT] = "";
            }
            if (content[ID]) { obj.id(content[ID]); content[ID] = ""; }
            mode = WSPACE;
        }

        let i = 0, mode = WSPACE;
        while (i < text.length) {
            const c = text.charAt(i++);
            const quoted = isQuoted(c);
            if (mode == WSPACE) { if (quoted || c > ' ') { mode = TAG; content[mode] += c; }; continue; }
            if (quoted) content[mode] += c;
            else if (c <= ' ' && (mode === TAG || mode === ID || mode === NA )) createElement();
            else if (c === '<' && (mode === TAG || mode === ID || mode === NA)) mode = PARAM;
            else if (c === '>' && mode === PARAM) mode = NA;
            else if (c === '(' && (mode === TAG || mode === ID || mode === NA)) mode = TEXT;
            else if (c === ')' && mode === TEXT) mode = NA;
            else if (c === '#' && (mode === TAG || mode == NA)) mode = ID;
            else content[mode] += c;
        }
        createElement();
        return obj;

    };
    readBlock(0, this);

    return this;
}
