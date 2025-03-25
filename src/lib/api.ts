import { stringifyUrl } from "@/lib/utils";

interface Subject {
    sectionId?: string;
    cathedra: string;
    course: string;
    semester: string;
    akce?: string;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Params = Record<string, string>;

class API {
    static url = "https://stag.tul.cz/StagPortletsJSR168/PredzapisServlet";
    // static cookie = "JSESSIONID=760B8DAB876C043D5241F0AB4D5041D5";

    static headers = {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
        Host: "stag.tul.cz",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        // "Cookie": API.cookie,
    };

    static async call(
        url: string,
        params: Params,
        method: HttpMethod
    ): Promise<Response> {
        const response = await fetch(
            stringifyUrl({
                url: url,
                query: params,
            }),
            {
                method: method,
                headers: API.headers,
                cache: "no-cache",
            }
        );

        return response;
    }

    static async openSection(subject: Subject): Promise<Response> {
        const params: Params = {
            action: "vyberBloku",
            blokidno: subject.sectionId || "",
            time: new Date().toString(),
        };

        const response = await API.call(API.url, params, "POST");
        return response;
    }

    static async openSubject(subject: Subject): Promise<Response> {
        const params: Params = {
            action: "vyberPredmetu",
            prac_zkr: subject.cathedra,
            zkr_predm: subject.course,
            semestr: subject.semester,
            statut: "A",
            portalLocale: "cs",
            time: new Date().toString(),
        };

        const response = await API.call(API.url, params, "POST");
        return response;
    }

    // this function needs subject in request format
    static async writeSubject(subject: Subject): Promise<Response> {
        const params: Params = {
            action: "zapisZmen",
            akce: subject.akce || "",
            katedra: subject.cathedra,
            predmet: subject.course,
            status: "A",
            time: new Date().toString(),
        };

        const response = await API.call(API.url, params, "POST");
        return response;
    }

    static async isUserLoggedIn(): Promise<boolean> {
        const url =
            "https://stag.tul.cz/portal/studium/moje-studium/predzapis.html";
        // if server returns 200, user is logged in
        const response = await API.call(url, {}, "GET");
        return response.status === 200;
    }
}

export default API;
