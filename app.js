const MAP_SIZE = 620;

const light_map = document.getElementById("light-map");
const dark_map = document.getElementById("dark-map");

function event_coordinates(event) {
    const rect = event.target.getBoundingClientRect();
    return [
        event.pageX - rect.left,
        event.pageY - rect.top,
    ];
}

function relative_coordinates(coordinates) {
    return coordinates.map(x => Math.round((x / MAP_SIZE) * 10000));
}

function absolute_coordinates(coordinates) {
    return coordinates.map(x => Math.round((x / 10000) * MAP_SIZE));
}

function log_coordinates(coordinates) {
    console.log("[" + coordinates[0] + ", " + coordinates[1] + "]");
}

function open_info_box(point) {
    close_info_box();
    const parent = (point.world === "light") ? dark_map : light_map;
    const info_box = document.createElement("div");
    info_box.id = "info-box";
    info_box.onclick = function (event) {
        event.stopPropagation();
    };
    info_box.innerHTML = format_point_text(point);
    parent.appendChild(info_box);
}

function close_info_box() {
    const info_box = document.getElementById("info-box");
    if (info_box !== null) {
        info_box.remove();
    }
}

function format_point_text(point) {
    const title = `<div class="info-box-title">${point.title}</div>`;
    const text = point.text.trim()
        .replace(/(\r\n|\r|\n)/g, '<br>')
        .replace(/(=([A-Za-z0-9_]+))/g, (str, g1, g2) => `<img class="screenshot" src="screenshots/${g2}.png">`);
    return title + text;
}

function init_world(world) {
    world.map.style.width = MAP_SIZE + "px";
    world.map.style.height = MAP_SIZE + "px";
    world.map.onclick = function (event) {
        coordinates = relative_coordinates(event_coordinates(event));
        log_coordinates(coordinates);
    }
}

function check_duplicates() {
    for (let i = 0; i < POINTS.length; i++) {
        for (let j = i + 1; j < POINTS.length; j++) {
            const p1 = POINTS[i];
            const p2 = POINTS[j];
            if (p1.world === p2.world && p1.pos[0] === p2.pos[0] && p1.pos[1] === p2.pos[1]) {
                console.log(`WARNING: points "${p1.title}" and "${p2.title}" are in the same place`);
            }
        }
    }
}

function main() {
    check_duplicates();

    const worlds = [
        { name: "light", map: light_map },
        { name: "dark",  map: dark_map  },
    ];

    for (const world of worlds) {
        init_world(world);
        const world_points = POINTS.filter(p => p.world == world.name);
        for (const point of world_points) {
            const [x, y] = absolute_coordinates(point.pos);
            const element = document.createElement("div");
            element.classList.add("point");
            element.style.left = x + "px";
            element.style.top = y + "px";
            element.onclick = function (event) {
                open_info_box(point);
                event.stopPropagation();
            };
            world.map.appendChild(element);
        }
    }
}

main();
