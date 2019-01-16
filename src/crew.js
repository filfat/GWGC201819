import { map } from './map';
const room_width = 120;
const room_height = 96;

const render = ({ terminal, crew }) => {
    let output = `CREW MEMBERS (${crew.members.length}/${crew.max_items})\n`;

    for (let i = 0; i < crew.members.length; i++) {
        const member = crew.members[i];

        output += (member.selected ? '> ' : '  ') + member.name + ` (${member.oxygen}%)\n`;
    }

    crew.element.innerHTML = output;
    return true;
};

const render_map = ({ terminal, crew, map }) => {
    const ctx = map.element.querySelector("canvas").getContext("2d");
    
    ctx.fillStyle = "#247C10";
    for(let i = 0; i < crew.members.length; i++) {
        const member = crew.members[i];
        const x = member.x, y = member.y;
        ctx.fillRect((room_width * x) + 30 + (20 * i), (room_height * y) + 40, 10, 10);
    }

    return true;
};

export default {
    render,
    render_map
};