import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResponseMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface PopupOutputProps {
    outputs: ResponseMessage[];
    clearOutput: () => void;
}

const PopupOutput = ({ outputs, clearOutput }: PopupOutputProps) => {
    return (
        <div className="popup-output relative bg-muted p-2 rounded w-full">
            <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                    <Button
                        className="absolute top-0.5 right-0.5"
                        size="sm"
                        variant="ghost"
                        onClick={clearOutput}
                    >
                        <X />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p className="text-xs">Vymazat výstup</p>
                </TooltipContent>
            </Tooltip>
            <div
                className="w-full overflow-x-auto"
                style={{ maxWidth: "100%" }}
            >
                <ul className="popup-output-field text-[11px]">
                    {outputs.map((output, index) => (
                        <li
                            key={index}
                            className={cn(
                                "whitespace-nowrap",
                                output.status === "error" && "text-red-500",
                                output.status === "success" && "text-green-500"
                            )}
                        >
                            {output.time} - {output.message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PopupOutput;
