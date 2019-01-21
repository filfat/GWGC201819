const room_width = 120;
const room_height = 96;

const tile_list = {
    "todo": {
        id: "todo"
    },

    "starting_point": {
        id: "starting_point",
        draw: (ctx, x, y) => {
            // TODO: Indicate starting room
            ctx.rect((room_width * x) + ((room_width / 2) - 20), (room_height * y), 40, 20);
            ctx.stroke();
        }
    },
    "end_point_up": {
        id: "end_point_up",
        draw: (ctx, x, y) => {
            // TODO: Indicate ending room
            ctx.rect((room_width * x) + ((room_width / 2) - 10), (room_height * y) - 20, 20, 40);
            ctx.stroke();
        }
    },
    "end_point_down": {
        id: "end_point_down",
        draw: (ctx, x, y) => {
            // TODO: Indicate ending room
            ctx.rect((room_width * x) + ((room_width / 2) - 10), (room_height * y) + (room_height - 20), 20, 40);
            ctx.stroke();
        }
    },
    "end_point_left": {
        id: "end_point_left",
        draw: (ctx, x, y) => {
            // TODO: Indicate ending room
            ctx.rect((room_width * x) - 20, (room_height * y) + ((room_height / 2) - 10), 40, 20);
            ctx.stroke();
        }
    },
    "end_point_right": {
        id: "end_point_right",
        draw: (ctx, x, y) => {
            // TODO: Indicate ending room
            ctx.rect((room_width * x) + (room_width - 20), (room_height * y) + ((room_height / 2) - 10), 40, 20);
            ctx.stroke();
        }
    },

    // corridor rooms
    "corridor_up": {
        id: "corridor_up",
        draw: (ctx, x, y) => {
            ctx.rect((room_width * x) + ((room_width / 2) - 10), (room_height * y) - 20, 20, 40);
            ctx.stroke();
        }
    },
    "corridor_down": {
        id: "corridor_down",
        draw: (ctx, x, y) => {
            ctx.rect((room_width * x) + ((room_width / 2) - 10), (room_height * y) + (room_height - 20), 20, 40);
            ctx.stroke();
        }
    },
    "corridor_left": {
        id: "corridor_left",
        draw: (ctx, x, y) => {
            ctx.rect((room_width * x) - 20, (room_height * y) + ((room_height / 2) - 10), 40, 20);
            ctx.stroke();
        }
    },
    "corridor_right": {
        id: "corridor_right",
        draw: (ctx, x, y) => {
            ctx.rect((room_width * x) + (room_width - 20), (room_height * y) + ((room_height / 2) - 10), 40, 20);
            ctx.stroke();
        }
    },
};

const clear_map = (state) => {
    state.map.data = [
        [{type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}],
        [{type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}],
        [{type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}],
        [{type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}],
        [{type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}, {type: "empty"}],
    ];
}

const generate = (state) => {
    const map = state.map;
    const crew = state.crew;

    map.done = false;
    clear_map(state);

    const starting_point = Math.floor(Math.random() * 6);
    const length = Math.floor(Math.random() * 15) + 10;

    for (let i = 0; i < crew.members.length; i++) {
        crew.members[i].x = starting_point;
    }

    map.data[0][starting_point] = {
        explored: true,
        type: tile_list["starting_point"].id
    };

    let px = starting_point, py = 0;
    let x = starting_point, y = 0;
    let tiles_traveled = 0;
    for (let i = 0; i < length; i++) {
        // 0 = top, 1 = right, 2 = bottom, 3 = left
        const dir = Math.floor(Math.random() * 4);
        let tile = '';

        try {
            switch (dir) {
                case 0:
                    if((y - 1) < 0 || !map.data[y-1][x] ||map.data[y-1][x].type !== "empty") continue;

                    if (py > (y - 1)) {
                        tile += "corridor_down"
                    } else if (py < (y - 1)) {
                        tile += "corridor_up"
                    };

                    map.data[--y][x].type = tile;
                    break;

                case 1:
                    if((x + 1) > 6 || !map.data[y][x+1] || map.data[y][x+1].type !== "empty") continue;

                    if (px > (x + 1)) {
                        tile += "corridor_right"
                    } else if (px < (x + 1)) {
                        tile += "corridor_left"
                    };

                    map.data[y][++x].type = tile;
                    break;

                case 2:
                    if((y + 1) > 4 || !map.data[y+1][x] || map.data[y+1][x].type !== "empty") continue;

                    if (py > (y + 1)) {
                        tile += "corridor_down"
                    } else if (py < (y + 1)) {
                        tile += "corridor_up"
                    };

                    map.data[++y][x].type = tile;
                    break;

                case 3:
                    if((x - 1) < 0 || !map.data[y][x-1] || map.data[y][x-1].type !== "empty") continue;

                    if (px > (x - 1)) {
                        tile += "corridor_right"
                    } else if (px < (x - 1)) {
                        tile += "corridor_left"
                    };

                    map.data[y][--x].type = tile;
                    break;
            }
        } catch (ex) {
            console.log("map->generate->ex: ", ex);
        }

        px = x;
        py = y;
        
        if (tiles_traveled < 0) tiles_traveled = 0;
        tiles_traveled++;
    }

    // make last tile endpoint
    if(map.data[py][px].type.includes("_up")) map.data[py][px].type = tile_list["end_point_up"].id;
    else if(map.data[py][px].type.includes("_right")) map.data[py][px].type = tile_list["end_point_right"].id;
    else if(map.data[py][px].type.includes("_down")) map.data[py][px].type = tile_list["end_point_down"].id;
    else if(map.data[py][px].type.includes("_left")) map.data[py][px].type = tile_list["end_point_left"].id;
    
    console.log(map.data[py][px]);

    console.log("map->generate->tiles_traveled:", tiles_traveled, "out of", length);

    if (tiles_traveled < length / 2) {
        return setTimeout(() => generate(state), 0);
    }

    console.table(map.data);
    map.done = true;
};

const render = ({ map }) => {
    if(map.rendering) return false;

    map.rendering = true;
    const ctx = map.element.querySelector("canvas").getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 720, 480);

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 6; x++) {
            const tile = map.data[y][x].type;
            const tile_data = map.data[y][x];

            ctx.lineWidth = "5"
            if(tile !== "empty" /*&& tile_data.explored*/) {
                ctx.beginPath();
                ctx.strokeStyle = "#247C10";
                ctx.rect((room_width * x) + 20, (room_height * y) + 20, (room_width - 40), (room_height - 40));
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.strokeStyle = "#247C10";
                if(tile_list[tile] && tile_list[tile].draw !== undefined) tile_list[tile].draw(ctx, x, y);
                ctx.closePath();
            }
        }
    }

    map.rendering = false;
};

const check_movement = ({ map }, from, to, dir) => {
    try {
        const from_tile = map.data[from.y][from.x] || {type: "empty"};
        const to_tile = map.data[to.y][to.x] || {type: "empty"};

        console.log(dir, from_tile.type, to_tile.type);

        let possible = to_tile.type !== "starting_point" ? false : true;
        switch (dir) {
            case 0: // UP
                if ((to_tile.type).includes("_down") || (from_tile.type).includes("_up")) possible = true;
                break;
            case 1: // RIGHT
                if ((to_tile.type).includes("_left") || (from_tile.type).includes("_right")) possible = true;
                break;
            case 2: // DOWN
                if ((to_tile.type).includes("_up") || (from_tile.type).includes("_down")) possible = true;
                break;
            case 3: // LEFT
                if ((to_tile.type).includes("_right") || (from_tile.type).includes("_left")) possible = true;
                break;
        }

        if (possible) {
            map.data[to.y][to.x].explored = true;
        }
        return possible;

    } catch (ex) {
        console.log("map->check_movement->ex:", ex);
        return false;
    }
};

export default {
    generate,
    render,

    check_movement
}