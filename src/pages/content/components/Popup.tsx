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

const Popup = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [outputs, setOutputs] = useState<ResponseMessage[]>([]);
    const { terms, removeAllTerms, removeTerm } = useTermsStore();
    const [status, setStatus] = useState<Status>("idle");

    useEffect(() => {
        const handleWritingMessage = async function (
            message: ResponseMessage,
            sender: chrome.runtime.MessageSender,
            sendResponse: (response?: any) => void
        ) {
            if (message.type != "WRITING") return;
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
        // setStatus("loading");
        // setTimeout(() => {
        //     setStatus("success");
        //     setOutputs([
        //         {
        //             type: "success",
        //             time: new Date().toLocaleTimeString(),
        //             status: "success",
        //             message: "Zápis proběhl úspěšně",
        //         },
        //     ]);
        // }, 2000);

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
                            <Table className="text-xs">
                                <TableHeader className="bg-muted">
                                    <TableRow>
                                        <TableHead className="text-muted-foreground">
                                            Předmět
                                        </TableHead>
                                        <TableHead className="text-muted-foreground">
                                            Den
                                        </TableHead>
                                        <TableHead className="text-muted-foreground">
                                            Čas
                                        </TableHead>
                                        <TableHead className="text-muted-foreground">
                                            Typ
                                        </TableHead>
                                        <TableHead className="text-muted-foreground">
                                            Učitel
                                        </TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {terms.map((term, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="py-1">
                                                {term.cathedra}/
                                                <span className="font-bold">
                                                    {term.course}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-1">
                                                {term.day}
                                            </TableCell>
                                            <TableCell className="py-1">
                                                {term.timeStart} -{" "}
                                                {term.timeEnd}
                                            </TableCell>
                                            <TableCell className="py-0">
                                                <div
                                                    className={cn(
                                                        "py-1 px-2 rounded-full text-center",
                                                        term.type.toLowerCase() ==
                                                            "cv" &&
                                                            "bg-red-200",
                                                        term.type.toLowerCase() ==
                                                            "př" &&
                                                            "bg-green-200",
                                                        term.type.toLowerCase() ==
                                                            "se" &&
                                                            "bg-blue-200"
                                                    )}
                                                >
                                                    {term.type}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-1">
                                                {term.teacher}
                                            </TableCell>
                                            <TableCell className="p-0">
                                                <Tooltip delayDuration={500}>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="hover:text-destructive"
                                                            onClick={() =>
                                                                removeTerm(
                                                                    term.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom">
                                                        <p className="text-xs">
                                                            Odebrat termín
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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

                    <EnrollmentStatus status={status} />

                    {outputs.length > 0 && (
                        <div className="w-full max-w-full">
                            <PopupOutput
                                outputs={outputs}
                                clearOutput={clearOutput}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Popup;
