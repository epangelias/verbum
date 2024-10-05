import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { VerbumState } from "../lib/verbumState.ts";
import { ChapterData } from "../lib/types.ts";

export class BibleState {
    constructor({ verbumState }: { verbumState: VerbumState }) {
        this.verbumState = verbumState;
    }

    verbumState: VerbumState;
    bibleId?: string;
    bookId?: string;
    chapterId?: number;
    chapterData: Signal<ChapterData | null> = useSignal(null);

    async loadChapter() {
        if (!this.bibleId || !this.bookId || !this.chapterId) return;
        this.chapterData.value = await this.verbumState.getVerses(
            this.bibleId,
            this.bookId,
            this.chapterId,
        );
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
}

interface BibleProps {
    bibleState: BibleState;
}

export default function Bible({ bibleState }: BibleProps) {
    return (
        <div class="bible">
            <button onClick={() => bibleState.prevChapter()}>◀</button>
            <button onClick={() => bibleState.nextChapter()}>▶</button>
            <button onClick={() => bibleState.toggleBible()}>
                {bibleState.bibleId?.slice(0, 3)}
            </button>
            <button>{bibleState.bookId}</button>
            <button>{bibleState.chapterData.value?.chapter}</button>
            <div class="verses">
                {bibleState.chapterData.value?.verses.map((verse) => (
                    <div className="verse">
                        <p>{verse.verse} {verse.text}</p>
                        {verse.notes && (
                            <details>
                                <summary>Note</summary>
                                {verse.notes}
                            </details>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
