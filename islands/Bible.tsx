import {
    Signal,
    useComputed,
    useSignal,
    useSignalEffect,
} from "@preact/signals";
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
    selectedWord = useSignal<string>();
    selectedVerse = useSignal<number>();

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

    makeRawWord(word?: string) {
        if (!word) return;
        word = word.toLocaleLowerCase().replaceAll(",", "").replaceAll(".", "");
        if (word.length < 5) return word;
        return word.replace(/(que)$/, "")
            .replace(/(et|us|am|i|æ|ae|o|a|um|i|em|tem|s)$/, "");
    }

    selectedRawWord = useComputed(() =>
        this.makeRawWord(this.selectedWord.value)
    );
}

interface BibleProps {
    bibleState: BibleState;
}

export default function Bible({ bibleState }: BibleProps) {
    function matchWord(word: string) {
        const rawWord = bibleState.makeRawWord(word);
        if (
            !bibleState.selectedWord.value ||
            !bibleState.selectedRawWord.value || !rawWord
        ) return;
        return rawWord.startsWith(bibleState.selectedRawWord.value) ||
            bibleState.selectedRawWord.value.startsWith(rawWord);
    }

    function selectWord(word: string, verse: number) {
        if (bibleState.selectedVerse.value == verse) {
            bibleState.selectedVerse.value = undefined;
        } else if (word == bibleState.selectedWord.value) {
            bibleState.selectedWord.value = undefined;
            bibleState.selectedVerse.value = verse;
        } else {
            bibleState.selectedWord.value = word;
            bibleState.selectedVerse.value = undefined;
        }
    }

    return (
        <div class="bible">
            <div className="content-center">
                <div class="verses">
                    {bibleState.chapterData.value?.verses.map((verse) => (
                        <div
                            className="verse"
                            data-selected={bibleState.selectedVerse.value ==
                                verse.verse}
                        >
                            <p>
                                <span
                                    className="verse-number"
                                    data-note={!!verse.notes}
                                >
                                    {verse.verse}
                                </span>
                                <span>
                                    {verse.text.split(" ").map((word) => (
                                        <>
                                            <span
                                                class="word"
                                                data-selected={matchWord(word)}
                                                onClick={() =>
                                                    selectWord(
                                                        word,
                                                        verse.verse,
                                                    )}
                                            >
                                                {word}
                                            </span>
                                            {" "}
                                        </>
                                    ))}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
