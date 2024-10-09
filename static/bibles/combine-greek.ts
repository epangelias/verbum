const OTRaw = await Deno.readTextFile("LATVUL.json");
const OTData: {
    book: string;
    testament: string;
    chapters: {
        chapter: number;
        verses: { verse: number; text: string; notes: string }[];
    }[];
}[] = JSON.parse(OTRaw);
const structure = {
    books: OTData.map((book) => ({
        name: book.book,
        chapters: book.chapters.map((chap) => ({
            chapter: chap.chapter,
            name: `${book.book} ${chap.chapter}`,
            verses: chap.verses.map((verse) => ({
                verse: verse.verse,
                text: verse.text,
                name: `${book.book} ${chap.chapter}:${verse.verse}`,
                notes: verse.notes,
            })),
        })),
    })),
};

Deno.writeTextFile("LATVUL.json", JSON.stringify(structure));
