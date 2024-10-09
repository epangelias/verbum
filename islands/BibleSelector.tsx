import { BibleState } from "./Bible.tsx";

interface BibleSelectorProps {
    bibleState: BibleState;
}

export default function BibleSelector({ bibleState }: BibleSelectorProps) {
    return (
        <header class="bible-selector">
            <div className="content-center">
                <button class="arrow" onClick={() => bibleState.prevChapter()}>
                    ◀
                </button>
                <button class="lang" onClick={() => bibleState.toggleBible()}>
                    {bibleState.bibleId?.slice(0, 3)}
                </button>
                <select
                    class="book"
                    value={bibleState.bookId}
                    onChange={(e) =>
                        bibleState.setBook(
                            (e.target as HTMLSelectElement).value,
                        )}
                >
                    {bibleState.bookList?.map((b) => <option>{b.name}</option>)}
                </select>
                <select
                    class="chapter"
                    value={bibleState.chapterId}
                    onChange={(e) =>
                        bibleState.setChapter(
                            (e.target as HTMLSelectElement).value,
                        )}
                >
                    {bibleState.chapters.value.map((chap) => (
                        <option>{chap}</option>
                    ))}
                </select>
                <button class="arrow" onClick={() => bibleState.nextChapter()}>
                    ▶
                </button>
            </div>
        </header>
    );
}
