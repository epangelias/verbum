import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { VerbumState } from "../lib/verbumState.ts";
import { BibleState } from "./Bible.tsx";
import { useEffect } from "preact/hooks";
import * as gmf from "https://deno.land/x/gfm@0.6.0/mod.ts";

interface InfoTab {
    title: string;
    icon: string;
    prompt: string;
    purpose: "verse" | "word";
    showHebrew?: boolean;
    showGreek?: boolean;
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
        prompt:
            "Profoundly explain the Hebrew word behind the selected word in the selected verse.",
        purpose: "word",
        showHebrew: true,
    },
    {
        title: "Greek",
        icon: "🇬🇷",
        prompt:
            "Profoundly explain the Greek word behind the selected word in the selected verse. The word either comes from the LXX or the NT Greek",
        purpose: "word",
        showGreek: true,
    },
    {
        title: "Jerome",
        icon: "📜",
        prompt:
            "St. Jerome's commentary on why he may have translated the word in this way",
        purpose: "word",
    },
    {
        title: "Roots",
        icon: "🌱",
        prompt:
            "List word roots selected word, include its etymology, include an english word that is derived from it or one of its roots if possible..",
        purpose: "word",
    },
    {
        title: "Word forms",
        icon: "📚",
        prompt: "Show all the linguistic forms of the selected word",
        purpose: "word",
    },
    {
        title: "Verses",
        icon: "🔍",
        prompt:
            "Quote other verses that include the selected word. Fully quote each verse.",
        purpose: "word",
    },
    {
        title: "Memorize",
        icon: "🧠",
        prompt: "Help memorize the selected word",
        purpose: "word",
    },
    {
        title: "Examples of Usage",
        icon: "📝",
        prompt: "List examples of usage of the selected word",
        purpose: "word",
    },
    {
        title: "Synonyms",
        icon: "🔄",
        prompt:
            "List synonyms for the selected word in the same language with meaning.",
        purpose: "word",
    },
    {
        title: "Pronunciation",
        icon: "🔊",
        prompt: "Show pronunciation of the selected word",
        purpose: "word",
    },
    {
        title: "Cognates",
        icon: "🧬",
        prompt: "List cognates of the selected word in related languages.",
        purpose: "word",
    },
    {
        title: "Hebrew Gematria",
        icon: "🔢",
        prompt: "Show the gematria value of the selected Hebrew word.",
        purpose: "word",
        showHebrew: true,
    },
    {
        title: "Hebrew Pictographic Meaning",
        icon: "🎨",
        prompt:
            "Explain the pictographic meaning of the selected word, focusing on ancient Hebrew letters.",
        purpose: "word",
        showHebrew: true,
    },
    {
        title: "Greek Isopsephy",
        icon: "🔢",
        prompt:
            "Show the isopsephy value of the selected Greek word using the word.",
        purpose: "word",
        showGreek: true,
    },

    // Verses
    {
        title: "Notes",
        icon: "📝",
        prompt: "Notes for the selected verse",
        purpose: "verse",
    },
    {
        title: "Explanation",
        icon: "📚",
        prompt: "Explanation for the selected verse",
        purpose: "verse",
    },
    {
        title: "Cross-Reference",
        icon: "🔗",
        prompt: "List cross reference verses for the selected verse",
        purpose: "verse",
    },
    {
        title: "All Interpretations",
        icon: "⚖️",
        prompt: "List all interpretations of the selected verse",
        purpose: "verse",
    },
    {
        title: "Symbology",
        icon: "🔑",
        prompt:
            "Elaborate on the symbology, prophetic, or advanced understanding of the verse.",
        purpose: "verse",
    },
    {
        title: "Jerome Commentary",
        icon: "📜",
        prompt:
            "Show Saint Jerome's commentary on why he translated this verse in the way he did",
        purpose: "verse",
    },
    {
        title: "Jerome",
        icon: "🦁",
        prompt: "Show Saint Jerome's understanding for the selected verse",
        purpose: "verse",
    },
    {
        title: "Augustine",
        icon: "⛪",
        prompt: "Show Augustine's understanding for the selected verse",
        purpose: "verse",
    },
    {
        title: "Paracelsus",
        icon: "🧪",
        prompt: "Show Paracelsus' understanding for the selected verse",
        purpose: "verse",
    },
    {
        title: "Kabbalism",
        icon: "🕎",
        prompt: "Show Kabbalism's understanding for the selected verse",
        purpose: "verse",
    },
    {
        title: "Luther",
        icon: "📚",
        prompt: "Show Luther's understanding for the selected verse",
        purpose: "verse",
    },
    {
        title: "Jewish Tradition",
        icon: "🕍",
        prompt:
            "Show the ancient Jewish tradition's understanding for the selected verse",
        purpose: "verse",
        showHebrew: true,
    },

    // AI GENERATED

    {
        title: "Historical Background",
        icon: "🏛️",
        prompt: "Provide the historical background of the selected verse.",
        purpose: "verse",
    },
    {
        title: "Early Church Fathers",
        icon: "⛪",
        prompt:
            "Summarize what the early Church Fathers wrote about this verse.",
        purpose: "verse",
    },
    {
        title: "Theological Debates",
        icon: "⚔️",
        prompt:
            "List theological debates or controversies surrounding this verse.",
        purpose: "verse",
    },
    {
        title: "Doctrinal Importance",
        icon: "🛐",
        prompt: "Explain the doctrinal significance of the selected verse.",
        purpose: "verse",
    },
    {
        title: "Parallels in Apocrypha",
        icon: "📜",
        prompt:
            "Show parallels from the Apocrypha or other non-canonical texts.",
        purpose: "verse",
    },
    {
        title: "Poetic Structure",
        icon: "🎶",
        prompt:
            "Analyze the poetic structure or chiastic elements in the selected verse.",
        purpose: "verse",
    },
    {
        title: "Hebrew Parallelism",
        icon: "🔄",
        prompt: "Explain the Hebrew parallelism found in the verse.",
        purpose: "verse",
        showHebrew: true,
    },
    {
        title: "Prophecies Fulfilled",
        icon: "🔮",
        prompt: "List the prophecies fulfilled by the selected verse.",
        purpose: "verse",
    },
    {
        title: "Typology",
        icon: "🕊️",
        prompt:
            "Show typological connections between the selected verse and other biblical figures or events.",
        purpose: "verse",
    },
    {
        title: "Targum",
        icon: "📖",
        prompt: "Show how the verse is explained in the Targum.",
        purpose: "verse",
    },
    {
        title: "Messianic Prophecies",
        icon: "✝️",
        prompt: "Explain how this verse relates to messianic prophecies.",
        purpose: "verse",
    },
    {
        title: "Moral Teachings",
        icon: "🧭",
        prompt: "List moral teachings derived from the selected verse.",
        purpose: "verse",
    },
    {
        title: "Canonical Significance",
        icon: "📚",
        prompt:
            "Explain the canonical significance of this verse within the Bible.",
        purpose: "verse",
    },
    {
        title: "Ancient Manuscripts",
        icon: "🧾",
        prompt:
            "List significant differences in ancient manuscripts for the selected verse.",
        purpose: "verse",
    },
    {
        title: "Variant Readings",
        icon: "📜",
        prompt: "Show significant variant readings from ancient sources.",
        purpose: "verse",
    },
    {
        title: "Qumran",
        icon: "🏺",
        prompt:
            "Explain any connections between this verse and the Dead Sea Scrolls.",
        purpose: "verse",
    },
    {
        title: "Gnostic Interpretation",
        icon: "🌀",
        prompt: "Show Gnostic interpretations of the selected verse.",
        purpose: "verse",
    },
    {
        title: "Aramaic Targum",
        icon: "📝",
        prompt: "Show how this verse was explained in Aramaic Targums.",
        purpose: "verse",
    },
    {
        title: "Midrash",
        icon: "📚",
        prompt: "Show Midrashic commentary on the selected verse.",
        purpose: "verse",
    },
    {
        title: "Cultural References",
        icon: "🎭",
        prompt: "List cultural references that come from this verse.",
        purpose: "verse",
    },
    {
        title: "Archeological Evidence",
        icon: "🗿",
        prompt: "Provide archeological evidence supporting this verse.",
        purpose: "verse",
    },
    {
        title: "Artistic Representations",
        icon: "🎨",
        prompt: "Show famous artistic representations inspired by this verse.",
        purpose: "verse",
    },
    {
        title: "Music or Hymns",
        icon: "🎶",
        prompt: "List hymns or music inspired by this verse.",
        purpose: "verse",
    },
    {
        title: "Soteriology",
        icon: "✝️",
        prompt: "Explain how this verse ties into the doctrine of salvation.",
        purpose: "verse",
    },
    {
        title: "Eschatology",
        icon: "🌅",
        prompt: "Explain eschatological interpretations of this verse.",
        purpose: "verse",
    },
    {
        title: "Angels/Demons",
        icon: "👼",
        prompt: "List any references to angels or demons in this verse.",
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
    responseContent = useSignal("");
    loading = useSignal(false);
    currentPrompt = "";

    async openTab(tabId: number) {
        this.selectedTab.value = tabId;
        this.responseContent.value = "";
        const bible = this.verbumState.bibleList.find((b) =>
            b.id == this.bibleState.bibleId
        );
        const verse = this.bibleState.chapterData.value?.verses.find(
            (v) =>
                v.verse ==
                    (this.bibleState.selectedVerse.value ||
                        this.bibleState.selectedWordVerse.value),
        );
        let prompt = `${
            infoTabs[tabId].prompt
        }\nResponse should be under 50 words if possible. Respond in basic markdown format, use bold instead of titles. \nVersion: ${bible?.title} (${bible?.id})\n${
            this.bibleState.selectedWord
                ? `Word: ${this.bibleState.selectedWord}\n\nContext: `
                : `\nDo not quote or translated the selected verse.\n\nVerse: `
        }${verse?.name} ${verse?.text}`;

        if (infoTabs[tabId].showGreek) {
            const bookData = await this.verbumState.getBibleData("LXXTR");
            const book = bookData.books.find((b) =>
                b.name == this.bibleState.bookId
            );
            const chapter = book?.chapters.find((c) =>
                c.chapter == this.bibleState.chapterId
            );
            const verse = chapter?.verses.find((v) =>
                v.verse ==
                    (this.bibleState.selectedVerse.value ||
                        this.bibleState.selectedWordVerse.value)
            );
            if (verse) prompt += `\n\nGreek verse for reference: ${verse.text}`;
        }

        if (infoTabs[tabId].showHebrew) {
            const bookData = await this.verbumState.getBibleData("WLC");
            const book = bookData.books.find((b) =>
                b.name == this.bibleState.bookId
            );
            const chapter = book?.chapters.find((c) =>
                c.chapter == this.bibleState.chapterId
            );
            const verse = chapter?.verses.find((v) =>
                v.verse ==
                    (this.bibleState.selectedVerse.value ||
                        this.bibleState.selectedWordVerse.value)
            );
            if (verse) {
                prompt += `\n\nHebrew verse for reference: ${verse.text}`;
            }
        }
        console.log(prompt);
        this.currentPrompt = prompt;

        if (this.getPromptCache(prompt)) {
            this.responseContent.value = this.getPromptCache(prompt)!;
            this.loading.value = false;
            return;
        }

        if (verse?.notes && infoTabs[tabId].title == "Notes") {
            this.responseContent.value = verse.notes;
            this.loading.value = false;
            return;
        }

        this.loading.value = true;
        const body = JSON.stringify({ prompt });
        const res = await fetch("/api/get-info", { body, method: "POST" });
        this.responseContent.value = await res.text();

        if (
            prompt != this.currentPrompt
        ) return;

        this.catchPrompt(prompt, this.responseContent.value);
        this.loading.value = false;
    }

    catchPrompt(prompt: string, result: string) {
        localStorage.setItem(`prompt:${prompt}`, result);
    }
    getPromptCache(prompt: string) {
        if (!localStorage.getItem(`prompt:${prompt}`)) return null;
        return localStorage.getItem(`prompt:${prompt}`);
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

    const __html = gmf.render(infoBoxState.responseContent.value);

    return (
        <div class="info-box">
            <div className="content-center">
                <div className="tabs-container">
                    <div className="tabs">
                        {tabs.map((tab) => (
                            <button
                                data-selected={infoBoxState.selectedTab.value ==
                                    infoTabs.indexOf(tab)}
                                onClick={() =>
                                    infoBoxState.openTab(infoTabs.indexOf(tab))}
                            >
                                <span className="emoji">{tab.icon}</span>
                                <span class="button-text">
                                    {" " + tab.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="content">
                    <h3>
                        {infoTabs.at(infoBoxState.selectedTab?.value)?.title}
                    </h3>
                    <blockquote>{selectionContent}</blockquote>
                    {infoBoxState.loading.value
                        ? <div className="loader"></div>
                        : (
                            <p dangerouslySetInnerHTML={{ __html }}>
                                {infoBoxState.responseContent.value}
                            </p>
                        )}
                </div>
            </div>
        </div>
    );
}
