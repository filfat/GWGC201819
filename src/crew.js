const render = ({ terminal, crew }) => {
    let output = `CREW MEMBERS (${crew.members.length}/${crew.max_items})\n`;

    for (let i = 0; i < crew.members.length; i++) {
        const member = crew.members[i];

        output += (member.selected ? '> ' : '  ') + member.name + ` (${member.oxygen}%)\n`;
    }

    crew.element.innerHTML = output;
    return true;
};

export default {
    render
};