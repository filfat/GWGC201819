import action_display from "../action_display";

const solve_time = 2;
const statements = [
    {
        label: "2 * 3 = 4",
        correct: false
    },
    {
        label: "10 ^ 2 = 100",
        correct: true
    },
    {
        label: "3 * 3 = 9",
        correct: true
    },
    {
        label: "pi = 3.14159265",
        correct: true
    },
    {
        label: "pi = 3.14169265",
        correct: false
    },
    {
        label: "11 / 2 = 5",
        correct: false
    },
    {
        label: "11 / 2 = 5.5",
        correct: true
    },
];

const math_completed = (state) => {
    if (state.terminal.input) {
        if (state.terminal.input === 'Y' && state.game.is_correct.current_problem.correct) return true;
        else if (state.terminal.input === 'N' && !state.game.is_correct.current_problem.correct) return true;
        
        state.terminal.input = '';
        return false;
    } else {
        let time = (new Date()) - state.game.is_correct.word_started;

        state.action.element.innerHTML = `<p><span>Is the statment correct (Y/N)?</span>
<span>(${state.game.is_correct.amountDone}/${state.game.is_correct.amount}) <span>${(solve_time - parseInt(time / 1000)).toString()} seconds left</span></span>
<span>  ${state.game.is_correct.current_problem.label}</span>
<span>> ${state.terminal.input}</span></p>`
        return false;
    }
}

const get_next_problem = (state) => {
    state.game.is_correct.word_started = (new Date());
    let next_problem = (statements[Math.floor(Math.random() * statements.length)]);

    if (next_problem == state.game.is_correct.current_problem) return get_next_problem(state);
    return next_problem;
}

const max_statements = 5;
const render = (state) => {
    if(!state.game.is_correct) {
        state.game.is_correct = {};
        state.game.is_correct.amount = Math.floor(Math.random() * max_statements) + 2;
        state.game.is_correct.amountDone = 0;
        state.game.is_correct.current_problem = get_next_problem(state);
        state.terminal.prefix = "y/n? ";

    } else if (state.game.is_correct.amountDone >= state.game.is_correct.amount) {
        state.terminal.prefix = "&gt; ";
        state.terminal.input = '';

        // reset action state
        state.game.is_correct = null;
        state.action.engine = "text";
        state.action.canvas_render = null;
        return true;
    }

    if(math_completed(state)) {
        state.terminal.input = '';
        state.game.is_correct.current_problem = get_next_problem(state);
        ++state.game.is_correct.amountDone;

        // TODO: Play fun chime
    } else if (solve_time - (((new Date()) - state.game.is_correct.word_started) / 1000 ) < 0) {
        state.terminal.input = '';
        state.game.is_correct.current_problem = get_next_problem(state);
        state.game.is_correct.amountDone = (state.game.is_correct.amountDone - 1) > 0 ? state.game.is_correct.amountDone - 1 : 0;

        // TODO: Play bad chime
    }
}

export default {
    render
}