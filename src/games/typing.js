import action_display from "../action_display";

const type_time = 10;
const phrases = [
    "using namespace std;",
    "int main () {",
    "system.start();",
    "0x0010ab",
];

const word_completed = (state) => {
    if (state.terminal.input === state.game.typing.currentPhrase) return true;

    else {
        let time = (new Date()) - state.game.typing.word_started;

        state.action.element.innerHTML = `<p><span>(${state.game.typing.amountDone}/${state.game.typing.amount}) <span>${(type_time - parseInt(time / 1000)).toString()} seconds left</span></span>
<span>${state.game.typing.currentPhrase}</span>
<span>${state.terminal.input}</span></p>`
        return false;
    }
}

const get_next_phrase = (state) => {
    state.game.typing.word_started = (new Date());
    return (phrases[Math.floor(Math.random() * phrases.length)]).toUpperCase();
}

const max_phrases = 5;
const render = (state) => {
    debugger;
    if(!state.game.typing) {
        state.game.typing = {};
        state.game.typing.amount = Math.floor(Math.random() * max_phrases) + 2;
        state.game.typing.amountDone = 0;
        state.game.typing.currentPhrase = get_next_phrase(state);
        state.terminal.prefix = "enter code: ";
    } else if (state.game.typing.amountDone >= state.game.typing.amount) {
        state.terminal.prefix = "> ";
        state.terminal.input = '';

        // reset action state
        state.game.typing = {};
        state.action.engine = "text";
        state.action.canvas_render = null;

        // TODO: Notifiy door that it's hacked
        return alert('door hacked!');
    }

    if(word_completed(state)) {
        state.terminal.input = '';
        state.game.typing.currentPhrase = get_next_phrase(state);
        ++state.game.typing.amountDone;

        // TODO: Play fun chime
    } else if (type_time - (((new Date()) - state.game.typing.word_started) / 1000 ) < 0) {
        state.terminal.input = '';
        state.game.typing.currentPhrase = get_next_phrase(state);
        state.game.typing.amountDone = (state.game.typing.amountDone - 1) > 0 ? state.game.typing.amountDone - 1 : 0;

        // TODO: Play bad chime
    }
}

export default {
    render
}