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

const generate = ({ map, crew }) => {
    const starting_point = Math.floor(Math.random() * 6);
    const length = Math.floor(Math.random() * 15) + 5;

    for (let i = 0; i < crew.members.length; i++) {
        crew.members[i].x = starting_point;
    }

    map.data[0][starting_point] = tile_list["starting_point"].id;

    let px = starting_point, py = 0;
    let x = starting_point, y = 0;
    for (let i = 0; i < length; i++) {
        // 0 = top, 1 = right, 2 = bottom, 3 = left
        const dir = Math.floor(Math.random() * 4);
        let tile = '';

        switch (dir) {
            case 0:
                if((y - 1) < 0 || map.data[y-1][x] !== "empty") {
                    i -= 1;
                    continue;
                }

                if (py > (y - 1)) {
                    tile += "corridor_down"
                } else if (py < (y - 1)) {
                    tile += "corridor_up"
                };

                map.data[--y][x] = tile;
                break;

            case 1:
                if((x + 1) > 6 || map.data[y][x+1] !== "empty") {
                    i -= 1;
                    continue;
                }

                if (px > (x + 1)) {
                    tile += "corridor_right"
                } else if (px < (x + 1)) {
                    tile += "corridor_left"
                };

                map.data[y][++x] = tile;
                break;

            case 2:
                if((y + 1) > 4 || map.data[y+1][x] !== "empty") {
                    i -= 1;
                    continue;
                }

                if (py > (y + 1)) {
                    tile += "corridor_down"
                } else if (py < (y + 1)) {
                    tile += "corridor_up"
                };

                map.data[++y][x] = tile;
                break;

            case 3:
                if((x - 1) < 0 || map.data[y][x-1] !== "empty") {
                    i -= 1;
                    continue;
                }

                if (px > (x - 1)) {
                    tile += "corridor_right"
                } else if (px < (x - 1)) {
                    tile += "corridor_left"
                };

                map.data[y][--x] = tile;
                break;
        }

        px = x;
        py = y;
    }

    console.log(starting_point);
    console.table(map.data);
};

const render = ({ map }) => {
    if(map.rendering) return false;

    map.rendering = true;
    const ctx = map.element.querySelector("canvas").getContext("2d");

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 6; x++) {
            const tile = map.data[y][x];

            ctx.lineWidth = "5"
            if(tile !== "empty") {
                ctx.beginPath();
                ctx.strokeStyle = "#247C10";
                ctx.rect((room_width * x) + 20, (room_height * y) + 20, (room_width - 40), (room_height - 40));
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.strokeStyle = "#247C10";
                if(tile_list[tile].draw !== undefined) tile_list[tile].draw(ctx, x, y);
                ctx.closePath();
            }
        }
    }

    map.rendering = false;
};

export default {
    generate,
    render
}