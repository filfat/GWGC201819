"use strict";
import terminal from "./terminal";
import input from "./input";

import "./index.scss";

let state = {
    running: true,
    terminal: {
        element: document.querySelector(".terminal").querySelector(".content"),
        max_lines: 9,
        output: [
            "SpaceOS 1.99 is starting...",
            "(c) EVIL INC 2001\n"
        ],

        prefix: '> ',
        input: '',
        submit: false,
    }
}

const main = () => {
    window.addEventListener("keypress", (key) => { input.key_press(state.terminal, key); });
    window.addEventListener("keyup", (key) => { input.key_up(state.terminal, key); });

    const game_loop = setInterval(() => {
        terminal.render(state.terminal);
        terminal.handle_command(state.terminal);

        if(!state.running)
            clearInterval(game_loop);
    }, /*32*/100);

    // TODO: Cleanup
}

main();