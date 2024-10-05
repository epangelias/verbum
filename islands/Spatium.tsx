import { IS_BROWSER } from "fresh/runtime";
import { VerbumState } from "../lib/verbumState.ts";
import Bible, { BibleState } from "./Bible.tsx";
import { useEffect } from "preact/hooks";
import BibleSelector from "./BibleSelector.tsx";

export function Spatium() {
    const verbumState = new VerbumState();
    const bibleState = new BibleState({ verbumState });

    useEffect(() => {
        bibleState.bibleId = "LATVUL";
        bibleState.bookId = "Exodus";
        bibleState.chapterId = 1;
        if (IS_BROWSER) bibleState.loadChapter();
    }, []);

    return (
        <div class="spatium">
            <BibleSelector bibleState={bibleState} />
            <Bible bibleState={bibleState} />
        </div>
    );
}
