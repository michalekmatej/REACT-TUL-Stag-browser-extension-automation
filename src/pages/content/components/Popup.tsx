import { ResponseMessage, Status } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useTermsStore from "@/lib/stores/termsStore";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import PopupOutput from "@/pages/content/components/PopupOutput";
import { cn } from "@/lib/utils";
import EnrollmentStatus from "@/pages/content/components/EnrolmentStatus";
import PopupTable from "@/pages/content/components/PopupTable";

const Popup = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [outputs, setOutputs] = useState<ResponseMessage[]>([]);
    const { terms, removeAllTerms, removeTerm } = useTermsStore();
    const [status, setStatus] = useState<Status>("idle");

    useEffect(() => {
        const handleWritingMessage = async function (message: any) {
            if (message.type != "WRITING") return;
            message = message as ResponseMessage;
            console.log(message);

            setOutputs((prev) => [...prev, message]);
            if (message.status == "finished") setStatus("success");
            if (message.status == "error") setStatus("error");
        };

        chrome.runtime.onMessage.addListener(handleWritingMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleWritingMessage);
        };
    }, []);

    const enroll = () => {
        setStatus("loading");
        chrome.runtime.sendMessage({
            type: "SEND_TERMS",
            terms: terms,
        });
    };

    const deleteAll = () => {
        removeAllTerms();
    };

    const clearOutput = () => {
        setOutputs([]);
        setStatus("idle");
    };

    return (
        <div className="fixed top-2 right-2 min-w-[380px] max-w-[600px] w-auto flex flex-col items-end z-9999">
            {/* Trigger Button */}
            <Button
                className="mb-2 hover:brightness-90 hover:bg-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "Zavřít popup" : "Otevřít popup"}
            </Button>

            {/* Popup Window */}
            {isOpen && (
                <div className="popup-window w-full bg-background p-4 flex flex-col gap-2 rounded shadow-lg border border-border">
                    <div className="text-lg font-bold border-b pb-2">
                        Vybrané termíny předmětů
                    </div>
                    {/* <div>uživatel: {userName}</div> */}
                    <div className="popup-table">
                        {terms.length > 0 ? (
                            <PopupTable terms={terms} removeTerm={removeTerm} />
                        ) : (
                            <p className="text-muted-foreground">
                                Zatím nejsou vybrány žádné předměty
                            </p>
                        )}
                    </div>
                    <div className="popup-buttons flex gap-2 justify-between">
                        <Button onClick={enroll} disabled={status == "loading"}>
                            Provést zápis
                        </Button>
                        <Button variant="destructive" onClick={deleteAll}>
                            Odstranit vše
                        </Button>
                    </div>

                    {/* <EnrollmentStatus status={status} /> */}

                    {outputs.length > 0 && (
                        <PopupOutput
                            outputs={outputs}
                            clearOutput={clearOutput}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Popup;
