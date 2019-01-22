import items from "./items";
import term from "./terminal";

const render = (state) => {
    const terminal = state.terminal;
    const inventory = state.inventory;
    let output = `INVENTORY (${inventory.items.length}/${inventory.max_items})\n`;

    for (let i = 0; i < inventory.items.length; i++) {
        const item = inventory.items[i];

        output += `${(item.selected ? '>' : ' ')} ${items[item.id].title} ${(items[item.id].value_render ? items[item.id].value_render(state, item) : '')}\n`;
        if (item.selected && items[item.id].tool_tip) output += `    ${items[item.id].tool_tip(state, item, "    ")}\n`;
    }

    inventory.element.innerHTML = output;
    return true;
};

const use = (state) => {
    const inventory = state.inventory;
    const crew = state.crew;

    let selected_item = null;
    let selected_item_n = null;
    let selected_member = null;
    let selected_member_n = null;

    for (let i = 0; i < inventory.items.length; i++) {
        const item = inventory.items[i];

        if (selected_item && item.selected) return term.printf(state, "You cant use more than one item at the same time!");
        else if (item.selected) {
            selected_item_n = i;
            selected_item = item;
        }
    }

    for (let i = 0; i < crew.members.length; i++) {
        const member = crew.members[i];

        if (selected_member && member.selected) return term.printf(state, "You cant use one item on multiple crew members at the same time!");
        else if (member.selected) {
            selected_member = i;
            selected_member = member;
        }
    }

    let res = items[selected_item.id].action(state, selected_item, selected_member);
    inventory.items[selected_item_n] = selected_item;
    crew.members[selected_member_n] = selected_member;

    term.printf(state, res);
};

export default {
    render,

    use,
};