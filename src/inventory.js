import items from "./items";

const render = ({ terminal, inventory }) => {
    let output = `INVENTORY (${inventory.items.length}/${inventory.max_items})\n`;

    for (let i = 0; i < inventory.items.length; i++) {
        const item = inventory.items[i];

        output += (item.selected ? '> ' : '  ') + items[item.id].title + '\n';
    }

    inventory.element.innerHTML = output;
    return true;
};

export default {
    render
};