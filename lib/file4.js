export class File {

    static async open(options) {
        const f = new File();
        try {
            f.file = false;
            [f.handle] = await window.showOpenFilePicker(options);
            f.file = await f.handle.getFile();
        } catch (error) { console.error('Error opening file.\n', error); return null; }
        return f;
    }

    static async save(options) {
        const f = new File();
        try {
            f.file = false;
            f.handle = await window.showSaveFilePicker(options);
            f.file = await f.handle.getFile();
        } catch (error) { console.error('Error creating file.\n', error); return null; }
        return f;
    }

    async #qwrite(content) {
        try {
            if (!this.wstream) this.wstream = await this.handle.createWritable();
            await this.wstream.write(content);
        } catch (error) { console.error('Error writing to file.\n', error); }
    }

    async write(content) {
        if (this.queued) await this.queued;
        this.queued = this.#qwrite(content);
    }

    async close() {
        try {
            if (this.queued) await this.queued;
            if (!this.wstream) return;
            await this.wstream.close();
            this.wstream = false; this.queued = false; 
        } catch (error) { console.error('Error writing to file.\n', error); }
    }

    async readText() {
        try {
            if (!this.file) this.file = await this.handle.getFile();
            return this.file.text();
        } catch (error) { console.error('Error reading file.\n', error); return null; }
    }

    async readData() {
        try {
            if (!this.file) this.file = await this.handle.getFile();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => { resolve(reader.result); }
                reader.readAsDataURL(this.file);
            });
        } catch (error) { console.error('Error reading file.\n', error); return null; }
    }

    static download(data, type, filename) {
        let e = document.createElement("a");
        e.href = window.URL.createObjectURL(new Blob([ data ], {type: type}));
        e.download = filename;
        e.click(); e.remove();
    }

}
