import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { VerbumState } from "../lib/verbumState.ts";
import { BookListItem, ChapterData } from "../lib/types.ts";
import BibleSelector from "./BibleSelector.tsx";
import { useEffect } from "preact/hooks";
import { useRef } from "preact/hooks";

export class BibleState {
    constructor({ verbumState }: { verbumState: VerbumState }) {
        this.verbumState = verbumState;
    }

    verbumState: VerbumState;
    bibleId?: string;
    bookId?: string;
    chapterId?: number;
    chapterData: Signal<ChapterData | null> = useSignal(null);
    bookList?: BookListItem[];
    chapters = useSignal([1]);

    async loadChapter() {
        if (!this.bibleId || !this.bookId || !this.chapterId) return;
        this.bookList = await this.verbumState.getBookList(this.bibleId);
        this.chapterData.value = await this.verbumState.getVerses(
            this.bibleId,
            this.bookId,
            this.chapterId,
        );
        this.chapters.value = new Array(
            this.bookList.find((b) => b.book === this.bookId)?.chapters,
        ).fill(0).map((_, i) => i + 1);
    }

    async nextChapter() {
        if (!this.chapterId || !this.bibleId) return;
        const bookList = await this.verbumState.getBookList(this.bibleId);
        const bookId = bookList.findIndex((b) => b.book === this.bookId);
        if (bookId == -1) return;
        const chapters = bookList[bookId].chapters;
        if (chapters == this.chapterId) {
            if (bookId == bookList.length - 1) return;
            this.chapterId = 1;
            this.bookId = bookList[bookId + 1].book;
        } else this.chapterId += 1;
        this.loadChapter();
    }

    async prevChapter() {
        if (!this.chapterId || !this.bibleId) return;
        const bookList = await this.verbumState.getBookList(this.bibleId);
        const bookId = bookList.findIndex((b) => b.book === this.bookId);
        if (bookId == -1) return;
        if (this.chapterId == 1) {
            if (bookId == 0) return;
            this.chapterId = bookList[bookId - 1].chapters;
            this.bookId = bookList[bookId - 1].book;
        } else this.chapterId -= 1;
        this.loadChapter();
    }

    toggleBible() {
        if (this.bibleId == "LATVUL") this.bibleId = "ENGVUL";
        else this.bibleId = "LATVUL";
        this.loadChapter();
    }

    setBook(book: string) {
        this.chapterId = 1;
        this.bookId = book;
        this.loadChapter();
    }

    setChapter(chapter: string | number) {
        this.chapterId = parseInt(chapter.toString());
        this.loadChapter();
    }
}

interface BibleProps {
    bibleState: BibleState;
}

export default function Bible({ bibleState }: BibleProps) {
    const selectedText = useSignal<string | undefined>("");

    function matchWord(word: string) {
        if (!selectedText.value) return;
        const raw = (w: string) =>
            w
                .toLocaleLowerCase()
                .replaceAll(",", "")
                .replaceAll(".", "")
                .replace(/(us|am|i|æ|ae|o|a|um|i|em)$/, "");
        return raw(word) == raw(selectedText.value);
    }

    return (
        <div class="bible">
            <div className="content-center">
                <div class="verses">
                    {bibleState.chapterData.value?.verses.map((verse) => (
                        <div className="verse">
                            <p>
                                <span className="verse-number">
                                    {verse.verse}
                                </span>
                                <span>
                                    {verse.text.split(" ").map((word) => (
                                        <>
                                            <span
                                                class="word"
                                                data-selected={matchWord(word)}
                                                onClick={() =>
                                                    selectedText.value = word}
                                            >
                                                {word}
                                            </span>
                                            {" "}
                                        </>
                                    ))}
                                </span>
                                <span class="note-icon">
                                    {verse.notes && "📝"}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
