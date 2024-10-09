import { BibleData } from "./types.ts";
import { getData, setData } from "./local-db.ts";

export class VerbumState {
    bibleData: Record<string, BibleData> = {};
    bibleList = [{ title: "Latin Vulgate", id: "LATVUL" }, {
        title: "English Vulgate",
        id: "ENGVUL",
    }, {
        title: "King James Version",
        id: "KJV",
    }, {
        title: "Greek Septuagint & Textus Receptus",
        id: "LXXTR",
    }, {
        title: "Masoretic Hebrew",
        id: "WLC",
    }];

    async getBibleData(id: string) {
        if (this.bibleData[id]) return this.bibleData[id] as BibleData;
        let data = await getData("bibleData-" + id);
        if (data) return this.bibleData[id] = data as BibleData;
        const res = await fetch(`/bibles/${id}.json`);
        if (!res.ok) throw new Error("Failed to fetch bible data");
        data = await res.json();
        this.bibleData[id] = data;
        setData("bibleData-" + id, data);
        return data as BibleData;
    }

    async getBookList(id: string) {
        const data = await this.getBibleData(id);
        return data.books.map(({ name, bookNumber, testament, chapters }) => ({
            name,
            bookNumber,
            testament,
            chapters: chapters.length,
        }));
    }

    async getVerses(id: string, book: string, chapter: number) {
        const data = await this.getBibleData(id);
        const bookData = data.books.find((b) => b.name === book);
        if (!bookData) throw new Error("Book not found");
        const chapterData = bookData.chapters.find((c) =>
            c.chapter === chapter
        );
        if (!chapterData) throw new Error("Chapter not found");
        return chapterData;
    }
}
