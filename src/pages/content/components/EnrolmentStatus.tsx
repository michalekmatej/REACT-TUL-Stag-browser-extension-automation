import { Spinner } from "@/components/ui/spinner";
import { Status } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle, X } from "lucide-react";

interface EnrollmentStatusProps {
    status: Status;
}

const EnrollmentStatus = ({ status }: EnrollmentStatusProps) => {
    if (status === "idle") return null;

    return (
        <div
            className={cn(
                "p-2 rounded-md text-xs flex gap-2 items-center",
                status === "loading" && "bg-primary text-primary-foreground",
                status === "success" && "bg-green-200 text-green-800",
                status === "error" && "bg-red-200 text-red-800"
            )}
        >
            <div>
                {status === "loading" && <Spinner className="text-primary-foreground w-4 h-4" />}
                {status === "success" && <CheckCircle size={16} />}
                {status === "error" && <X size={16} />}
            </div>
            <div>
            {status === "loading" && "Probíhá zápis..."}
            {status === "success" && "Zápis proběhl úspěšně"}
            {status === "error" && "Chyba při zápisu"}
            </div>
        </div>
    );
};

export default EnrollmentStatus;