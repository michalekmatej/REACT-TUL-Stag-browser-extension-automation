import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Term } from "@/lib/types";

interface TermsStore {
    terms: Term[];
    addTerm: (term: Term) => void;
    removeTerm: (id: string) => void;
    updateTerm: (term: Term) => void;
    removeAllTerms: () => void;
}

const useTermsStore = create<TermsStore>()(
    persist(
        (set) => ({
            terms: [],
            addTerm: (term) =>
                set((state) => ({ terms: [...state.terms, term] })),
            removeTerm: (id) =>
                set((state) => ({
                    terms: state.terms.filter((term) => term.id !== id),
                })),
            updateTerm: (term) =>
                set((state) => ({
                    terms: state.terms.map((t) =>
                        t.id === term.id ? term : t
                    ),
                })),
            removeAllTerms: () => set({ terms: [] }),
        }),
        {
            name: "enrollment-terms-store",
        }
    )
);

export default useTermsStore;
