import useTermsStore from "@/lib/stores/termsStore";
import useUserStore from "@/lib/stores/userStore";
import { CombinedInfo, SectionInfo, TermInfo } from "@/lib/types";
import { parseTitle, removeNewlinesAndTabs } from "@/lib/utils";

// Constants for DOM selectors
const SELECTORS = {
    SECTION_WRAPPER: "td#struktura2",
    DIALOG: 'div[role="dialog"].ui-dialog',
    DIALOG_TITLE: ".ui-dialog-title",
};

// DOM element indexes for extracting term information
const ROW_INDEXES = {
    SEMESTER: 1,
    TYPE: 2,
    ROOM: 3,
    DAY: 5,
    MORE_INFO: 7,
};

/**
 * Extracts section information from a clicked element
 */
function extractSectionInfo(target: HTMLElement): SectionInfo | null {
    if (target.tagName.toLowerCase() !== "a") return null;

    const wrapper = document.querySelector(SELECTORS.SECTION_WRAPPER);
    if (!wrapper) return null;
    if (!wrapper.contains(target)) return null;

    const sectionTitle = target.innerText.trim();
    const sectionId = target.id.split("_")[1];

    return { sectionTitle, sectionId };
}

/**
 * Extracts term information from a checkbox click event
 */
function extractTermInfo(event: Event): TermInfo | null {
    const target = event.target as HTMLElement;

    // Only process checkbox clicks
    if ((target as HTMLInputElement).type !== "checkbox") return null;
    const checkbox = target as HTMLInputElement;

    // Find the active dialog
    const dialogs = document.querySelectorAll(SELECTORS.DIALOG);
    if (!dialogs.length) {
        console.error("No dialogs found");
        return null;
    }

    const lastDialog = dialogs[dialogs.length - 1] as HTMLElement;
    if (!lastDialog || !lastDialog.contains(checkbox)) {
        console.error("No dialog with checkbox found");
        return null;
    }

    // Extract course info from dialog title
    const titleElement = lastDialog.querySelector<HTMLElement>(
        SELECTORS.DIALOG_TITLE
    );
    if (!titleElement || !titleElement.innerText) return null;
    const { cathedra, course } = parseTitle(titleElement.innerText);

    // Navigate DOM to find row details
    const td = checkbox.parentElement;
    if (!td) return null;

    const row = td.parentElement;
    if (!row) return null;

    // Extract term details from row cells
    const semester =
        row.children[ROW_INDEXES.SEMESTER]
            ?.querySelector(".bigger")
            ?.textContent?.trim() || "";
    const type =
        row.children[ROW_INDEXES.TYPE]
            ?.querySelector(".bigger")
            ?.textContent?.trim() || "";
    const room =
        row.children[ROW_INDEXES.ROOM]
            ?.querySelector(".bigger")
            ?.textContent?.trim() || "";
    const day =
        row.children[ROW_INDEXES.DAY]
            ?.querySelector(".bigger")
            ?.textContent?.trim() || "";

    const moreInfo = row.children[ROW_INDEXES.MORE_INFO] as HTMLElement;
    if (!moreInfo) return null;

    const timeStart = removeNewlinesAndTabs(
        moreInfo.children[0]?.textContent?.trim() || ""
    )
        .split("(")[0]
        .trim();
    const timeEnd = removeNewlinesAndTabs(
        moreInfo.children[1]?.textContent?.trim() || ""
    )
        .split("(")[0]
        .trim();

    // Get teacher from the last child element
    const lastChild = moreInfo.children[moreInfo.children.length - 1];
    const teacher = lastChild?.children[0]?.textContent?.trim() || "";

    const termInfo: TermInfo = {
        cathedra,
        course,
        day,
        timeStart,
        timeEnd,
        room,
        teacher,
        type,
        semester,
        id: checkbox.value,
        checked: checkbox.checked,
    };
    return termInfo;
}

/**
 * Updates the terms store based on term selection state
 */
function updateTermsStore(info: CombinedInfo): void {
    const { terms, addTerm, removeTerm, updateTerm } = useTermsStore.getState();
    // check if term is already in the store
    // if it is, and checked is false, remove it
    // if it is, and checked is true, edit it
    // if it is not, and checked is true, add it
    const index = terms.findIndex((term) => term.id === info.id);
    if (index !== -1) {
        if (!info.checked) {
            removeTerm(info.id);
        } else {
            updateTerm(info);
        }
    } else if (info.checked) {
        addTerm(info);
    }
}

/**
 * Main event handler that processes section and term selection
 */
// Track current section and term information
let sectionInfo: SectionInfo = { sectionTitle: "", sectionId: "" };

export function handleInfoGrabbing(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Try to extract section information
    const newSectionInfo = extractSectionInfo(target);
    if (newSectionInfo) {
        sectionInfo = newSectionInfo;
        return;
    }

    // Try to extract term information
    const termInfo = extractTermInfo(event);
    if (!termInfo) return;

    // Combine section and term information
    const combinedInfo: CombinedInfo = {
        ...sectionInfo,
        ...termInfo,
    };

    // Update the terms store
    updateTermsStore(combinedInfo);

    const { terms } = useTermsStore.getState();

    // Log selected terms for debugging
    console.group("Selected Terms Information");
    console.table(terms);
    console.log(terms);
    console.groupEnd();
}

export function extractUserName() {
    const element = document.querySelector(
        ".app_header > .app_header_right .falseLink.hideForMobile > span"
    );
    if (!element) return null;
    const userName = element.textContent?.trim();
    return userName;
}

export function saveUserName() {
    const { setUserName } = useUserStore.getState();

    const userName = extractUserName();
    if (!userName) return;
    setUserName(userName);
}
