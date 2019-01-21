import items from "./items";

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

export default {
    render
};