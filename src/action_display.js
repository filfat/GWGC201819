import items from "./items";

const render = ({ terminal, action }) => {
    if (action.engine === "text") {
        action.element.innerHTML = action.text_content;
        return true;
    }

    return false;
};

const set_text = ({ action }, text) => {
    action.engine = "text";
    action.text_content = text;
    return true;
}

export default {
    render,
    set_text
};