import { createRoot } from "react-dom/client";
import Content from "./Content";
import "@assets/styles/tailwind.css";
import { handleInfoGrabbing, saveUserName } from "@/lib/infoGrabber";

const div = document.createElement("div");
div.id = "__root";
document.body.appendChild(div);

const rootContainer = document.querySelector("#__root");
if (!rootContainer) throw new Error("Can't find Content root element");
const root = createRoot(rootContainer);
root.render(<Content />);

try {
    console.log("content script loaded");
} catch (e) {
    console.error(e);
}

document.addEventListener('click', handleInfoGrabbing);
window.addEventListener('load', saveUserName);
saveUserName();

