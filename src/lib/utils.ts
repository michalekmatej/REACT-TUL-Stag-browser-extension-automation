import { Course, CourseInfo, Term } from "@/lib/types";
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

export function stringifyUrl({ url, query }: { url: string; query?: Record<string, any> }) {
    // Zajistí, že `url` bude mít správný základ (pokud není)
    let finalUrl = url;

    // Pokud existují query parametry, připojí je k URL
    if (query && Object.keys(query).length > 0) {
        // Převod objektu query na pole key=value
        const queryString = Object.keys(query)
            .map(key => {
                const value = query[key];
                // Pokud má parametr hodnotu `null` nebo `undefined`, bude ignorován
                if (value !== null && value !== undefined) {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                }
                return '';
            })
            .filter(Boolean)  // Filtruje prázdné hodnoty
            .join('&');

        // Přidá dotazový řetězec k URL
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString;
    }

    return finalUrl;
}

export function termsToSubjects(terms:Term[]): Course[] {
    // Example term object:
    // const term = {
    //     cathedra,
    //     course,
    //     day,
    //     timeStart,
    //     timeEnd,
    //     room,
    //     teacher,
    //     type,
    //     semester,
    //     id: checkbox.value,
    //     checked: checkbox.checked,
    //     sectionId,
    //     sectionTitle,
    // };

    // Create a map to group by predmet (course)
    const groupedData: Record<string, Course> = {};

    // Loop through each section and group them by predmet
    terms.forEach(t => {
        const identifier = `${t.cathedra}/${t.course}`;

        // If the course already exists in the map, append the t.id to the "akce" string
        if (groupedData[identifier]) {
            groupedData[identifier].akce += t.id + '#';
        } else {
            // Otherwise, create a new entry for the course
            groupedData[identifier] = {
                akce: t.id + '#',
                cathedra: t.cathedra,
                course: t.course,
                day: t.day,
                timeStart: t.timeStart,
                timeEnd: t.timeEnd,
                room: t.room,
                teacher: t.teacher,
                type: t.type,
                semester: t.semester,
                sectionId: t.sectionId || '',
                sectionTitle: t.sectionTitle || '',
            };
        }
    });

    // Convert the map values into an array
    return Object.values(groupedData);
}