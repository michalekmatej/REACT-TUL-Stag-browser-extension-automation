import { OutputMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useTermsStore from "@/lib/stores/termsStore";
import { extractUserName } from "@/lib/infoGrabber";
import useUserStore from "@/lib/stores/userStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Popup = () => {
    const [isActive, setIsActive] = useState(true);
    const [outputs, setOutputs] = useState<OutputMessage[]>([]);
    const { terms, removeAllTerms } = useTermsStore();
    // const { userName } = useUserStore();

    const enroll = () => {
        console.log("Potvrzeno");
        // chrome.runtime.sendMessage({
        //     type: "SEND_TERMS",
        //     terms: TermsStore.terms,
        // });
    };

    const deleteAll = () => {
        removeAllTerms();
    };

    const eraseOutput = () => {
        setOutputs([]);
    };

    return (
        <div className="fixed top-2 right-2 min-w-[350px] flex flex-col items-end z-9999">
            {/* Trigger Button */}
            <Button
                className="mb-2 hover:brightness-90 hover:bg-primary"
                onClick={() => setIsActive(!isActive)}
            >
                {isActive ? "Zavřít popup" : "Otevřít popup"}
            </Button>

            {/* Popup Window */}
            {isActive && (
                <div className="popup-window w-full bg-white p-4 rounded shadow-lg">
                    <div className="text-xl font-bold mb-4 border-b pb-2">
                        Vybrané termíny předmětů
                    </div>
                    {/* <div>uživatel: {userName}</div> */}
                    <div className="popup-content mb-4">
                        {terms.length > 0 ? (
                            // <ul className="pl-5 space-y-2">
                            //     {terms.map((term, index) => (
                            //         <li key={index} className="text-gray-700">
                            //             {term.cathedra}/{term.course} -{" "}
                            //             {term.day} {term.timeStart} -{" "}
                            //             {term.timeEnd} - {term.teacher} (
                            //             {term.type})
                            //         </li>
                            //     ))}
                            // </ul>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Předmět</TableHead>
                                        <TableHead>Den</TableHead>
                                        <TableHead>Čas</TableHead>
                                        <TableHead>Typ</TableHead>
                                        <TableHead>Učitel</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {terms.map((term, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{term.cathedra}/{term.course}</TableCell>
                                            <TableCell>{term.day}</TableCell>
                                            <TableCell>{term.timeStart} - {term.timeEnd}</TableCell>
                                            <TableCell>{term.type}</TableCell>
                                            <TableCell>{term.teacher}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-gray-500">
                                Zatím nejsou vybrány žádné předměty
                            </p>
                        )}
                    </div>
                    <div className="popup-buttons flex gap-2 justify-between mb-4">
                        <Button onClick={enroll}>Provést zápis</Button>
                        <Button variant="destructive" onClick={deleteAll}>
                            Odstranit vše
                        </Button>
                    </div>
                    <div className="popup-output bg-gray-100 p-4 rounded">
                        <button
                            className="text-red-500 font-bold float-right focus:outline-none"
                            onClick={eraseOutput}
                        >
                            X
                        </button>
                        <ul className="popup-output-field list-disc pl-5 space-y-2 mt-6">
                            {outputs.length > 0 ? (
                                outputs.map((output, index) => (
                                    <li
                                        key={index}
                                        className={`text-sm ${
                                            output.status === "error"
                                                ? "text-red-500"
                                                : "text-green-500"
                                        }`}
                                    >
                                        {output.time} - {output.message}
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500">Žádný výstup</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Popup;
