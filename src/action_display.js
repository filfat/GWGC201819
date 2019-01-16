import items from "./items";

const render = (state) => {
    const terminal = state.terminal;
    const action = state.action;

    if (action.engine === "text") {
        action.element.innerHTML = action.text_content;
        return true;
    } else if (action.engine === "canvas") {
        return action.canvas_render(state);
    }

    console.warning(`action_display->render->Unknown action_display state "${action.engine}"!`);
    set_text(state, '');
    
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