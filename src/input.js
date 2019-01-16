const key_press = ({ terminal }, key) => {
    switch(key.keyCode) {
        case 8:     // BACKSPACE
        case 13:    // ENTER
        case 27:    // ESC
            break;

        default:
            terminal.input += String.fromCharCode(key.keyCode).toUpperCase();
    }

    return terminal.input;
};

const key_up = ({ terminal }, key) => {
    console.log(terminal.history);
    switch(key.keyCode) {
        case 8:     // BACKSPACE
            terminal.input = terminal.input.slice(0, -1);
            break;
        
        case 13:    // ENTER
            terminal.history.position = -1;
            if(terminal.input) terminal.submit = true;
            break;
        
        case 38:    // UP
            terminal.history.position += 1;
            terminal.input = terminal.history.entries[terminal.history.position] || '';
            break;
        case 40:    // DOWN
            terminal.history.position -= 1;
            terminal.input = terminal.history.entries[terminal.history.position] || '';
            break;
        
        case 27:    // ESC
            // TODO: exit game
            break;
    }
}

export default {
    key_press,
    key_up,
};