import { IS_BROWSER } from "fresh/runtime";
import { VerbumState } from "../lib/verbumState.ts";
import Bible, { BibleState } from "./Bible.tsx";
import { useEffect } from "preact/hooks";
import BibleSelector from "./BibleSelector.tsx";
import { InfoBoxState } from "./InfoBox.tsx";
import InfoBox from "./InfoBox.tsx";

export function Spatium() {
    const verbumState = new VerbumState();
    const bibleState = new BibleState({ verbumState });
    const infoBoxState = new InfoBoxState({ bibleState });

    useEffect(() => {
        bibleState.bibleId = "LATVUL";
        bibleState.bookId = "Genesis";
        bibleState.chapterId = 1;
        if (IS_BROWSER) bibleState.loadChapter();
    }, []);

    return (
        <div class="spatium">
            <BibleSelector bibleState={bibleState} />
            <Bible bibleState={bibleState} />
            <InfoBox infoBoxState={infoBoxState} />
        </div>
    );
}
