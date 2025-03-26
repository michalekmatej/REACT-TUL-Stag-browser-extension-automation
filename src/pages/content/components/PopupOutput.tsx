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
        <div className="popup-output relative bg-muted rounded w-full">
            <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                    <Button
                        className="absolute top-0.5 right-0.5 z-10 hover:bg-transparent"
                        size="sm"
                        variant="ghost"
                        onClick={clearOutput}
                    >
                        <X />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-red-500 fill-red-500 text-white">
                    <p className="text-xs">Vymazat výstup</p>
                </TooltipContent>
            </Tooltip>

            <ul className="popup-output-field text-[11px] p-2 absolute overflow-auto w-full max-h-[300px]">
                {outputs.map((output, index) => (
                    <li
                        key={index}
                        className={cn(
                            "whitespace-nowrap rounded-xs px-1 w-fit",
                            output.status === "error" && "text-red-500",
                            output.status === "success" && "text-green-500",
                            output.status === "finished" && "bg-green-600 text-white"
                        )}
                    >
                        {new Date(output.time).toLocaleDateString("cs-CZ")} -{" "}
                        {output.message}
                    </li>
                ))}
            </ul>
            {/* invisible ul for relative height */}
            <ul className="popup-output-field opacity-0 p-2 text-transparent text-[11px] max-h-[300px] pointer-events-none">
                {outputs.map((output, index) => (
                    <li key={index}>.</li>
                ))}
            </ul>

        </div>
    );
};

export default PopupOutput;
