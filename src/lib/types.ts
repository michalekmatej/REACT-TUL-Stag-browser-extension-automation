
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

export interface Subject {
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

export interface OutputMessage {
    type: string;
    time: string;
    status: string;
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
