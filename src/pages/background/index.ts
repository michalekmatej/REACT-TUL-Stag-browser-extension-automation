import API from "@/lib/api";
import { ResponseStatus } from "@/lib/types";
import { termsToSubjects } from "@/lib/utils";

console.log("background script loaded");

type MessageType = "SEND_TERMS" | "WRITING";

const sendOutput = (message: string, status: ResponseStatus) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id!, {
            type: "WRITING",
            time: new Date().toLocaleTimeString("cs-CZ"),
            status,
            message,
        });
    });
};


// Základní background script pro případné rozšíření funkcionality
chrome.runtime.onInstalled.addListener(() => {
    console.log("Rozšíření bylo nainstalováno");
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.startsWith("https://stag.tul.cz")) {
            chrome.cookies.get(
                {
                    url: tab.url,
                    name: "JSESSIONID",
                },
                function (cookie) {
                    if (cookie) {
                        console.log(cookie.value);
                    } else {
                        console.log("Cookie not found");
                    }
                }
            );
        }
    });
});

chrome.runtime.onMessage.addListener(async function (
    message,
    sender,
    sendResponse
) {
    if (message.type != "SEND_TERMS") return;

    console.log("Received terms:", message.terms);
    sendOutput("Zahajuji zapisování...", "starting");

    const terms = message.terms;
    const subjects = termsToSubjects(terms);

    let successCount = 0;
    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];

        // open section
        const response = await API.openSection(subject);

        // open subject
        const response2 = await API.openSubject(subject);

        // write subject
        const response3 = await API.writeSubject(subject);
        const text = await response3.text();

        let message = `[${i + 1}/${subjects.length}] Předmět ${
            subject.cathedra
        }/${subject.course} `;
        if (text.startsWith("ZAPIS") || text.startsWith("ODZAPIS")) {
            successCount++;
            message += "úspěšně zapsán";
        } else message += `se nepodařilo zapsat :( - ${text.split("\n")[0]}`;

        console.log(message);
        sendOutput(
            message,
            text.startsWith("ZAPIS") || text.startsWith("ODZAPIS")
                ? "success"
                : "error"
        );
    }

    sendOutput(
        `Zapsáno ${successCount}/${subjects.length} předmětů`,
        "finished"
    );

    if (successCount == subjects.length)
        sendOutput("Všechny předměty zapsány, díky za využití :) ", "thanks");
});
