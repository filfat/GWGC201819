import map from './map';
import term from './terminal';

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

const move_crew_member = (state, args) => {
    if (args.length <= 0 || args.length > 1)
        term.printf(state, "Usage: MOVE [up/right/down/left]");
    
    const dir = args[0];

    for (let i = 0; i < state.crew.members.length; i++) {
        const member = state.crew.members[i];

        if (!member.selected) continue;
        const x = member.x;
        const y = member.y;

        member.oxygen -= Math.floor(Math.random() * 20) + 5;
        switch(dir) {
            case "UP":
                if (map.check_movement(state, {x, y}, {x, y: (y - 1)}, 0)) {
                    member.y--;
                    continue;
                }
                break;
            case "RIGHT":
                if (map.check_movement(state, {x, y}, {x: (x + 1), y}, 1)) {
                    member.x++;
                    continue;
                }
                break;
            case "DOWN":
                if (map.check_movement(state, {x, y}, {x, y: (y + 1)}, 2)) {
                    member.y++;
                    continue;
                }
                break;
            case "LEFT":
                if (map.check_movement(state, {x, y}, {x: (x - 1), y}, 3)) {
                    member.x--;
                    continue;
                }
                break;

            default:
                term.printf(state, `There's no direction with id "${dir}".`);
                continue;
                break;
        }

        term.printf(state, `Unable to move crew member "${member.name}" to "${dir}".`);
    }

    console.table(state.crew.members);
};

export default {
    render,
    render_map,

    move_crew_member
};