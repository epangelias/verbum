export interface VerseData {
    name: string;
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
    name: string;
    testament: "OT" | "NT" | "AP";
    chapters: ChapterData[];
}

export interface BibleData {
    title: string;
    id: string;
    books: BookData[];
}

export interface BookListItem {
    name: string;
    bookNumber: number;
    testament: "OT" | "NT" | "AP";
    chapters: number;
}
