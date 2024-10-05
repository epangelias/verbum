import { IS_BROWSER } from "fresh/runtime";
import { VerbumState } from "../lib/verbumState.ts";
import Bible, { BibleState } from "./Bible.tsx";
import { useEffect } from "preact/hooks";

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
            <Bible bibleState={bibleState} />
        </div>
    );
}
