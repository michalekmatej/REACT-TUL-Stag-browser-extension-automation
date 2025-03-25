import { CourseInfo } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function parseTitle(title: string): CourseInfo {
    // example title: "Rozvrhové akce: KMA/MA2-E"
    // return: { cathedra: "KMA", course: "MA2-E" }
    const [cathedra, course] = title.split(": ")[1].split("/");
    return { cathedra, course };
}

export function removeNewlinesAndTabs(input: string) {
    return input.replace(/[\n\t]/g, "");
}
