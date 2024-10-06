import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { VerbumState } from "../lib/verbumState.ts";
import { BibleState } from "./Bible.tsx";
import { useEffect } from "preact/hooks";

interface InfoTab {
    title: string;
    icon: string;
    prompt: string;
    purpose: "verse" | "word";
}

const infoTabs: InfoTab[] = [
    {
        title: "Define",
        icon: "📖",
        prompt: "Define the selected word",
        purpose: "word",
    },
    {
        title: "Hebrew",
        icon: "🇮🇱",
        prompt: "Explain the Hebrew meaning of the selected word",
        purpose: "word",
    },
    {
        title: "Greek",
        icon: "🇬🇷",
        prompt: "Explain the Greek meaning of the selected word (LXX or NT)",
        purpose: "word",
    },
    {
        title: "Roots & Etymology",
        icon: "🌱",
        prompt: "List roots and etymology for the selected word",
        purpose: "word",
    },
    {
        title: "Metaphysical",
        icon: "🔮",
        prompt: "List metaphysical significance of the selected word",
        purpose: "word",
    },
    {
        title: "Other Verses",
        icon: "🔍",
        prompt: "Quote other verses with the selected word",
        purpose: "word",
    },
    {
        title: "Cross-Reference",
        icon: "🔗",
        prompt: "List cross reference verses for the selected verse",
        purpose: "verse",
    },
    {
        title: "Notes",
        icon: "📝",
        prompt: "Notes for the selected verse",
        purpose: "verse",
    },
    {
        title: "Metaphysics",
        icon: "🔮",
        prompt: "Metaphysics for the selected verse",
        purpose: "verse",
    },
    {
        title: "All Interpretations",
        icon: "🔍",
        prompt: "List all interpretations for the selected verse",
        purpose: "verse",
    },
    {
        title: "Ancient Interpretations",
        icon: "🔍",
        prompt:
            "List ancient interpretations for the selected verse, you may include Jewish, Kabbalistic, Gnostic, Martin Lutherian, Alchemical, Paracelsus, and Early Christian interpretations",
        purpose: "verse",
    },
];

interface InfoBoxProps {
    infoBoxState: InfoBoxState;
}

export class InfoBoxState {
    constructor({ bibleState }: { bibleState: BibleState }) {
        this.bibleState = bibleState;
        this.verbumState = bibleState.verbumState;
    }

    bibleState: BibleState;
    verbumState: VerbumState;
    selectedTab = useSignal(0);
    responseCache = new Map<string, string>();
    responseContent = useSignal("");

    openTab(tabId: number) {
        this.selectedTab.value = tabId;
    }
}

export default function InfoBox({ infoBoxState }: InfoBoxProps) {
    const filterPurpose = infoBoxState.bibleState.selectedWord.value
        ? "word"
        : "verse";
    const tabs = infoTabs.filter((tab) => tab.purpose == filterPurpose);

    if (
        !infoBoxState.bibleState.selectedVerse.value &&
        !infoBoxState.bibleState.selectedWord.value
    ) return <></>;

    const verses = infoBoxState.bibleState.chapterData.value?.verses || [];

    const selectionContent = infoBoxState.bibleState.selectedWord.value ||
        verses.find((v) =>
            v.verse == infoBoxState.bibleState.selectedVerse.value
        )?.text;

    useEffect(() => {
        infoBoxState.openTab(infoTabs.indexOf(tabs[0]));
    }, [selectionContent]);

    return (
        <div class="info-box">
            <div className="content-center">
                <div className="tabs">
                    {tabs.map((tab) => (
                        <button
                            data-selected={infoBoxState.selectedTab.value ==
                                infoTabs.indexOf(tab)}
                            onClick={() =>
                                infoBoxState.openTab(infoTabs.indexOf(tab))}
                        >
                            <span className="emoji">{tab.icon}</span>
                            <span class="button-text">{" " + tab.title}</span>
                        </button>
                    ))}
                </div>
                <div className="content">
                    <blockquote>{selectionContent}</blockquote>
                    <p>{infoBoxState.responseContent.value}</p>
                </div>
            </div>
        </div>
    );
}
