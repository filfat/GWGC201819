const cmd_list = {
    CLEAR: (args, terminal) => terminal.output = [],
    PRINT: (args, terminal) => printf(terminal, args.join(' ')),
};

const render = (terminal) => {
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

const handle_command = (terminal) => {
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

export default {
    render,
    handle_command
};