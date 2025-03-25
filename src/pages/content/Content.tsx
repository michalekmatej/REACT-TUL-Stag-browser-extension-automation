import { Button } from "@/components/ui/button";
import useTermsStore from "@/lib/stores/termsStore";
import Popup from "@/pages/content/components/Popup";

const Content = () => {
    const { terms, addTerm } = useTermsStore();

    const addNewTerm = () => {
        const term = {
            id: "1",
            cathedra: "Math",
            course: "Math",
            day: "Monday",
            timeStart: "8:00",
            timeEnd: "9:00",
            room: "123",
            teacher: "Mr. Teacher",
            type: "Lecture",
            semester: "1",
            checked: true,
        };
        addTerm(term);
    };

    return (
        <div>
            <Popup />
            <div className="bg-orange-500 fixed left-2 top-2">
                <Button onClick={addNewTerm}>Add new term</Button>
            </div>
        </div>
    );
};

export default Content;
