import action from "../action_display";
import terminal from "../terminal";

const tick = (state) => {
    switch(state.map.tiles_moved) {
        case 1:
            push(state, {
                id: 1,
                title: `Congratulations on your newly acquired "SuperTron #1000"`,
                content: `The SuperTroon #1000 is newest and most advanced form\nof computation!\n`,
                read: false
            });
            break;
    }
};

const push = (state, item) => {
    for (let i = 0; i < state.mail.items.length; i++) {
        if (state.mail.items[i].id === item.id) return false;
    }

    state.mail.items.push(item);
    notification(state);
    return true;
};

const view_all = (state) => {
    const mail = state.mail;

    let output = '';
    for (let i = 0; i < mail.items.length; i++) {
        const item = mail.items[i];

        output += `<div>${i + 1}. ${item.title}\n    ${item.content.substring(0, 25)}...</div>`;
    }

    output += `\n\nUse "MAIL open [n]" to open the specified mail.\n`;
    action.set_text(state, `Mail\n=================\n${output}`);
};

const open_mail = (state, n) => {
    const mail = state.mail;
    const item = mail.items[n - 1];

    console.log(item, n);

    if (!item) return terminal.printf(state, `No mail with the id "${n}".`);
    mail.items[n - 1].read = true;

    action.set_text(state, `${item.title}\n=================\n${item.content}`);
};

const notification = (state) => {
    let unread_count = 0;
    for (let i = 0; i < state.mail.items.length; i++) {
        const item = state.mail.items[i];

        if(!item.read) unread_count += 1;
    }

    if(unread_count)
        return terminal.printf(state, `You have ${unread_count} unread mail(s).`);
};

const cmd = (state, args) => {
    if(!args || args.length < 1)
        return view_all(state);
    else if(args.length === 2)
        return open_mail(state, args[1]);
    else if(args.length === 1 && args[0] === "NOTIFY")
        return notification(state);

    terminal.printf(state, "Usage: MAIL");
    terminal.printf(state, "   Or: MAIL notify");
    terminal.printf(state, "   Or: MAIL open [n]");
};

export default {
    tick,

    push,
    notification,

    cmd
}