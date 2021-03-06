"use strict";
import input from "./input";
import map from "./map";
import terminal from "./terminal";
import action from "./action_display";
import crew from "./crew";
import inventory from "./inventory";
import mail from "./apps/mail";

import items from "./items";

import "./index.scss";

let state = {
    running: true,
    terminal: {
        element: document.querySelector(".terminal").querySelector(".content"),
        max_lines: 9,
        output: [
            "KubrickOS 1.99 is starting...",
            "(c) Heuristics LLC 2001\n",
            "For a list of commands type \"help\".\n",
        ],

        prefix: '&gt; ',
        input: '',
        submit: false,

        history: {
            position: -1,
            entries: []
        },
    },

    action: {
        element: document.querySelector(".side-by-side").querySelector(".action"),
        engine: "text", // text or canvas

        text_content: '',
        canvas_render: null,
    },

    crew: {
        element: document.querySelector(".side-by-side").querySelector(".lists").querySelector(".crew"),
        max_items: 2,
        members: [
            {
                id: 0,
                x: 0, y: 0,
                selected: true,
                name: "Kurt",
                oxygen: 100,
            },
            {
                id: 1,
                x: 0, y: 0,
                selected: false,
                name: "Kurt2",
                oxygen: 100,
            }
        ],
    },

    inventory: {
        element: document.querySelector(".side-by-side").querySelector(".lists").querySelector(".inventory"),
        max_items: 30,
        items: [
            {
                id: items.oxygen_tank.id,
                selected: true,
                value: items.oxygen_tank.default_value
            }
        ],
    },

    map: {
        element: document.querySelector("#display2"),
        data: [],
        tiles_moved: 0,
        rendering: false,
    },

    game: {},
    
    mail: {
        items: []
    }
}

const main = () => {
    // Handle exit
    window.addEventListener("beforeunload", (key) => (e) => {
        state.running = false;
    });

    // Setup input
    window.addEventListener("keypress", (key) => { input.key_press(state, key); });
    window.addEventListener("keyup", (key) => { input.key_up(state, key); });

    // Add first story email
    mail.push(state, {
        id: 0,
        title: "Howdy employee #23732",
        content: "The file \"Mission.txt\" has been downloaded on to your\nterminal. Open it for more information.",
        read: false
    });

    // Generate map
    setTimeout(() => {
        map.generate(state);
    }, 0);

    const game_loop = setInterval(() => {
        if (!state.map.done) return;

        mail.tick(state);

        terminal.render(state);
        terminal.handle_command(state);
        
        action.render(state);
        crew.render(state);
        inventory.render(state);

        setTimeout(() => {
            map.render(state);
            crew.render_map(state);
        }, 0);

        if(!state.running)
            clearInterval(game_loop);
    }, /*32*/ 64);

    // TODO: Cleanup
}

main();