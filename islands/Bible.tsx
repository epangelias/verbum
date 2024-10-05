import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { VerbumState } from "../lib/verbumState.ts";
import { BookListItem, ChapterData } from "../lib/types.ts";

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
    return (
        <div class="bible">
            <button onClick={() => bibleState.prevChapter()}>◀</button>
            <button onClick={() => bibleState.nextChapter()}>▶</button>
            <button onClick={() => bibleState.toggleBible()}>
                {bibleState.bibleId?.slice(0, 3)}
            </button>
            <select
                value={bibleState.bookId}
                onChange={(e) =>
                    bibleState.setBook((e.target as HTMLSelectElement).value)}
            >
                {bibleState.bookList?.map((b) => <option>{b.book}</option>)}
            </select>
            <select
                value={bibleState.chapterId}
                onChange={(e) =>
                    bibleState.setChapter(
                        (e.target as HTMLSelectElement).value,
                    )}
            >
                {bibleState.chapters.value.map((chap) => <option>{chap}
                </option>)}
            </select>
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
