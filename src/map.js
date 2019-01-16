const tile_list = {
    "starting_point": {
        id: "starting_point",
    }
};

const generate = ({ map }) => {
    const starting_point = Math.floor(Math.random() * 6);
    const length = Math.floor(Math.random() * 15) + 5;

    map.data[0][starting_point] = tile_list["starting_point"].id;

    let x = starting_point, y = 0;
    for (let i = 0; i < length; i++) {
        // 0 = top, 1 = right, 2 = bottom, 3 = left
        let dir = Math.floor(Math.random() * 4);

        try {
            switch (dir) {
                case 0:
                    if((y - 1) < 0 || map.data[y-1][x] !== "empty") {
                        i -= 1;
                        continue;
                    }
                    map.data[--y][x] = "todo_path_tile";
                    break;

                case 1:
                    if((x + 1) > 6 || map.data[y][x+1] !== "empty") {
                        i -= 1;
                        continue;
                    }
                    map.data[y][++x] = "todo_path_tile";
                    break;

                case 2:
                    if((y + 1) > 5 || map.data[y+1][x] !== "empty") {
                        i -= 1;
                        continue;
                    }
                    map.data[++y][x] = "todo_path_tile";
                    break;

                case 3:
                    if((x - 1) < 0 || map.data[y][x-1] !== "empty") {
                        i -= 1;
                        continue;
                    }
                    map.data[y][--x] = "todo_path_tile";
                    break;
            }
        } catch(ex) {
            console.warn("map->generate->error:", ex);
            continue;
        }
    }

    console.log(starting_point);
    console.table(map.data);
};

const render = ({ map }) => {
    const ctx = map.element.querySelector("canvas").getContext("2d");
    ctx.fillStyle = "#247C10";

    for (let x = 0; x < map.data.length; x++) {
        for (let y = 0; y < map.data[x].length; y++) {
            const tile = map.data[x][y];
            
            // TODO: Draw correct tile
            if(tile !== "empty") ctx.fillRect(120 * x, 96 * y, 120, 96);
        }
    }
};

export default {
    generate,
    render
}