const cmd_list = {
    CLEAR: (args, terminal) => terminal.output = [],
    HELP: (args, terminal) => help(terminal, args),
    PRINT: (args, terminal) => printf(terminal, args.join(' ')),
    REBOOT: (args, terminal) => window.location.reload(),
    UNAME: (args, terminal) => printf(terminal, "KubrickOS 1.99\n(c) Heuristics LLC 2001"),
};
const cmd_list_help = {
    CLEAR: "Clears the screen.",
    HELP: "Provides help information.",
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

const handle_command = ({ terminal }) => {
    if(!terminal.submit) return false;
    printf(terminal, terminal.prefix + terminal.input);

    const command = terminal.input.split(' ')[0];
    const args = terminal.input.split(' ');
    terminal.submit = false;
    terminal.input = '';

    args.shift();

    // TODO: command
    if(cmd_list[command] !== undefined) cmd_list[command](args, terminal);
    else printf(terminal, `Unknown command "${command}".`);

    return true;
};

const printf = (terminal, text) => {
    terminal.output.push(text);
    return true;
};

const help = (terminal, args) => {
    if (args.length)
        return;
    
    let output = '';
    for(const cmd in cmd_list_help) {
        if(output) output += '\n';
        output += `${cmd}: ${(cmd_list_help[cmd]) || "No information available."}`;
    }

    printf(terminal, output);
}

export default {
    render,
    handle_command
};