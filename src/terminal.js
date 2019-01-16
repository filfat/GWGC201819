import filesystem from "./filesystem";
import action from "./action_display";

const cmd_list = {
    CLEAR: (args, { terminal }) => terminal.output = [],
    HELP: (args, { terminal }) => help(terminal, args),
    LS: (args, state) => ls(state),
    OPEN: (args, state) => open(state, args.join(' ')),
    PRINT: (args, { terminal }) => printf(terminal, args.join(' ')),
    REBOOT: (args, state) => window.location.reload(),
    UNAME: (args, state) => printf(state, "KubrickOS 1.99\n(c) Heuristics LLC 2001"),
};
const cmd_list_help = {
    CLEAR: "Clears the screen.",
    HELP: "Provides help information.",
    LS: "Lists files in a directory.",
    OPEN: "Opens a text file.",
    PRINT: "Displays a string.",
    REBOOT: "Reboots the system.",
    UNAME: "Displays system information.",
};

const render = ({ terminal }) => {
    let output = '';

    //TODO: Max-lines or scroll
    for (let i = 0; i < terminal.output.length; i++) {
        output += terminal.output[i] + '\n';
    }

    // Input
    output += terminal.prefix + terminal.input;

    terminal.element.innerHTML = `${output}`;
    return true;
};

const handle_command = (state) => {
    const terminal = state.terminal;
    if(!terminal.submit) return false;
    printf(state, terminal.prefix + terminal.input);

    const command = terminal.input.split(' ')[0];
    const args = terminal.input.split(' ');
    terminal.submit = false;
    terminal.input = '';

    args.shift();

    // TODO: command
    if(cmd_list[command] !== undefined) cmd_list[command](args, state);
    else printf(state, `Unknown command "${command}".`);

    return true;
};

const printf = ({ terminal }, text) => {
    terminal.output.push(text);
    return true;
};

const help = (state, args) => {
    const terminal = state.terminal;
    if (args.length)
        return;
    
    let output = '';
    for(const cmd in cmd_list_help) {
        if(output) output += '\n';
        output += `${cmd}: ${(cmd_list_help[cmd]) || "No information available."}`;
    }

    printf(state, output);
}

const ls = (state) => {
    const terminal = state.terminal;
    let output = '';

    for(const file in filesystem.files) {
        if(output) output += '\n';
        output += `${file}`;
    }

    action.set_text(state, output);
}

const open = (state, file) => {
    const terminal = state.terminal;
    const f = filesystem.files[file];

    if(!file) return printf(terminal, "Usage: OPEN [filename]");
    else if (!f) return printf(terminal, `The file "${file}" does not exist!`);

    action.set_text(state, f.content);
}

export default {
    render,
    handle_command
};