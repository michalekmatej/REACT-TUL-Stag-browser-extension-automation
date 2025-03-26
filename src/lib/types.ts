export interface Term {
    cathedra: string;
    course: string;
    day: string;
    timeStart: string;
    timeEnd: string;
    room: string;
    teacher: string;
    type: string;
    semester: string;
    id: string;
    checked: boolean;
    sectionId?: string;
    sectionTitle?: string;
}

export interface Course {
    akce: string;
    cathedra: string;
    course: string;
    day: string;
    timeStart: string;
    timeEnd: string;
    room: string;
    teacher: string;
    type: string;
    semester: string;
    sectionId: string;
    sectionTitle: string;
}

export interface ResponseMessage {
    type: string;
    time: number; // timestamp
    status: ResponseStatus;
    message: string;
}

export interface ApiResponse {
    text(): Promise<string>;
    status: number;
}

export interface SectionInfo {
    sectionTitle: string;
    sectionId: string;
}

export interface CourseInfo {
    cathedra: string;
    course: string;
}

export interface TermInfo extends CourseInfo {
    day: string;
    timeStart: string;
    timeEnd: string;
    room: string;
    teacher: string;
    type: string;
    semester: string;
    id: string;
    checked: boolean;
}

export interface CombinedInfo extends SectionInfo, TermInfo {}

export type Status = "idle" | "loading" | "success" | "error";
export type ResponseStatus =
    | "starting"
    | "success"
    | "error"
    | "finished"
    | "thanks";
