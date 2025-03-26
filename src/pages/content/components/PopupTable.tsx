import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Term } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";

interface PopupTableProps {
    terms: Term[];
    removeTerm: (id: string) => void;
}

const PopupTable = ({ terms, removeTerm }: PopupTableProps) => {
    return (
        <Table className="text-xs">
            <TableHeader className="bg-muted">
                <TableRow>
                    <TableHead className="text-muted-foreground">
                        Předmět
                    </TableHead>
                    <TableHead className="text-muted-foreground">Den</TableHead>
                    <TableHead className="text-muted-foreground">Čas</TableHead>
                    <TableHead className="text-muted-foreground">Typ</TableHead>
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
                            <span className="font-bold">{term.course}</span>
                        </TableCell>
                        <TableCell className="py-1">{term.day}</TableCell>
                        <TableCell className="py-1">
                            {term.timeStart} - {term.timeEnd}
                        </TableCell>
                        <TableCell className="py-0">
                            <div
                                className={cn(
                                    "py-1 px-2 rounded-full text-center",
                                    term.type.toLowerCase() == "cv" &&
                                        "bg-red-200",
                                    term.type.toLowerCase() == "př" &&
                                        "bg-green-200",
                                    term.type.toLowerCase() == "se" &&
                                        "bg-blue-200"
                                )}
                            >
                                {term.type}
                            </div>
                        </TableCell>
                        <TableCell className="py-1">{term.teacher}</TableCell>
                        <TableCell className="p-0">
                            <Tooltip delayDuration={500}>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="hover:text-destructive"
                                        onClick={() => removeTerm(term.id)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="bg-red-500 fill-red-500 text-white">
                                    <p className="text-xs">Odebrat termín</p>
                                </TooltipContent>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default PopupTable;
