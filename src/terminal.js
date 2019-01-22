import filesystem from "./filesystem";
import action from "./action_display";
import crew from "./crew";
import inventory from "./inventory";
import mail from "./apps/mail";

const cmd_list = {
    CLEAR: (args, state) => { state.terminal.output = []; action.set_text(state, ''); },
    DEBUG: (args, state) => { debug(state) },
    HELP: (args, state) => help(state, args),
    LS: (args, state) => ls(state, args),
    MAIL: (args, state) => mail.cmd(state, args),
    MOVE: (args, state) => crew.move_crew_member(state, args),
    OPEN: (args, state) => open(state, args.join(' ')),
    PRINT: (args, state) => printf(state, args.join(' ')),
    REBOOT: (args, state) => { state.running = false; window.location.reload() },
    SELECT: (args, state) => select(state, args),
    UNAME: (args, state) => printf(state, "KubrickOS 1.99\n(c) Heuristics LLC 2001"),
    USE: (args, state) => inventory.use(state),
};
const cmd_list_help = {
    CLEAR: "Clears the screen.",
    HELP: "Provides help information.",
    LS: "Lists files in a directory.",
    MAIL: "Mail manager.", // FIXME: Update desc
    MOVE: "Moves the select crew member one step in the specified direction.",
    OPEN: "Opens a text file.",
    PRINT: "Displays a string.",
    REBOOT: "Reboots the system.",
    SELECT: "Selects a crew member or an item.",
    UNAME: "Displays system information.",
    USE: "Uses the currently selected item on the currently selected crew member.",
};

const render = ({ terminal }) => {
    let output = '';

    //TODO: Max-lines or scroll
    for (let i = 0; i < terminal.output.length; i++) {
        output += terminal.output[i] + '\n';
    }

    // Input
    output += terminal.prefix + terminal.input;
    output += '<div class="cursor"></div>'

    if (output !== terminal.element.innerHTML)
        terminal.element.innerHTML = `${output}`;
    return true;
};

const handle_command = (state) => {
    const terminal = state.terminal;
    if(!terminal.submit) return false;
    else if (state.action.engine !== "text") return false;

    printf(state, terminal.prefix + terminal.input);
    terminal.history.entries.push(terminal.input);

    const command = terminal.input.split(' ')[0];
    const args = terminal.input.split(' ');
    terminal.submit = false;
    terminal.input = '';

    args.shift();

    // Scroll to bottom
    setTimeout(() => {
        terminal.element.scrollTop = terminal.element.scrollHeight - terminal.element.clientHeight;

        //mail.notification(state);
    }, 200);

    if(cmd_list[command] !== undefined) return cmd_list[command](args, state);

    printf(state, `Unknown command "${command}".`);
    return false;
};

const printf = ({ terminal }, text) => {
    if(!terminal.output) terminal.output = [];
    if(text.charAt(0) !== '>') console.log("terminal->printf->", text);

    terminal.output.push(text);
    return true;
};

const debug = (state) => {
    let copy_of_state = JSON.parse(JSON.stringify(state));
    copy_of_state.running = undefined;
    copy_of_state.terminal = {};
    copy_of_state.action = {};
    copy_of_state.action.engine = state.action.engine;
    copy_of_state.crew = {};
    copy_of_state.inventory = {};
    copy_of_state.map = {};
    copy_of_state.map.tiles_moved = state.map.tiles_moved;
    copy_of_state.game = undefined;
    copy_of_state.mail = {};

    action.set_text(state, `${JSON.stringify(copy_of_state, 4, 4)}`);
};

const help = (state, args) => {
    const terminal = state.terminal;
    if (args.length)
        return;
    
    let output = "Help\n=================";
    for(const cmd in cmd_list_help) {
        if(output) output += '\n';
        output += `${cmd}: ${(cmd_list_help[cmd]) || "No information available."}`;
    }

    return action.set_text(state, output);
};

const ls = (state) => {
    const terminal = state.terminal;
    let output = "Files on disket A:\n=================";

    for(const file in filesystem.files) {
        if(output) output += '\n';
        output += `${file}`;
    }

    return action.set_text(state, output);
};

const open = (state, file) => {
    const terminal = state.terminal;
    const f = filesystem.files[file];

    if(!file) return printf(state, "Usage: OPEN [filename]");
    else if (!f) return printf(state, `The file "${file}" does not exist!`);

    let output = file + "\n=================\n" + f.content;

    action.set_text(state, `Loading "${file}"...`);
    return setTimeout(() => {
        return action.set_text(state, output);
    }, 750);
};

const select = (state, args) => {
    const terminal = state.terminal;
    if((args.length <= 0) || args[1] !== 'FROM') return printf(state, "Usage: SELECT [n/*] FROM [CREW/INVENTORY]");

    const position = (args[0] !== '*') ? parseInt(args[0]) : '*';
    const from = args[2];

    if(from === "CREW") {
        if(position !== '*' && position > state.crew.members.length) return printf(state, `There's no crew member with id "${position}"`);
        for(let i = 0; i < state.crew.members.length; i++) {
            let member = state.crew.members[i];
            if (position !== '*') member.selected = ((i + 1) == position ? true : false)
            else member.selected = true;
        }
        return true;
    } else if (from === "INVENTORY") {
        if(position !== '*' && position > state.inventory.items.length) return printf(state, `There's no item with id "${position}"`);
        for(let i = 0; i < state.inventory.items.length; i++) {
            let item = state.inventory.items[i];
            if (position !== '*') item.selected = ((i + 1) === position ? true : false)
            else item.selected = true;
        }
        return true;
    }

    return false;
}

export default {
    render,
    handle_command,

    printf
};