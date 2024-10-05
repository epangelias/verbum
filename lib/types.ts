export interface VerseData {
    chapter: number;
    verse: 1;
    text: string;
    notes: string;
}

export interface ChapterData {
    chapter: number;
    verses: VerseData[];
}

export interface BookData {
    bookNumber: number;
    book: string;
    testament: "OT" | "NT" | "AP";
    chapters: ChapterData[];
}

export interface BibleData {
    title: string;
    id: string;
    books: BookData[];
}

export interface BookListItem {
    book: string;
    bookNumber: number;
    testament: "OT" | "NT" | "AP";
    chapters: number;
}
