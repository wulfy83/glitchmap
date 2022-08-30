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

function create_element(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

function open_info_box(point, parent_point) {
    close_info_box();
    const map = (point.world === "light") ? dark_map : light_map;
    const info_box = document.createElement("div");
    info_box.id = "info-box";
    info_box.onclick = function (event) {
        event.stopPropagation();
    };

    append_parent_link(info_box, parent_point);
    append_title(info_box, point);
    if (point.parts) {
        append_parts(info_box, point);
    } else {
        append_text(info_box, point);
    }

    map.appendChild(info_box);
}

function close_info_box() {
    const info_box = document.getElementById("info-box");
    if (info_box !== null) {
        info_box.remove();
    }
}

function append_parent_link(info_box, parent_point) {
    const link = create_element(`<div class="info-box-back">🡨 Back</div>`);
    link.onclick = function() {
        if (parent_point) {
            open_info_box(parent_point);
        } else {
            close_info_box();
        }
    };
    info_box.append(link);
}

function append_close_link(info_box) {
    const link = create_element(`<div class="info-box-back">🡨 Back</div>`);
    link.onclick = function() {
        open_info_box(parent_point);
    };
    info_box.append(link);
}

function append_title(info_box, point) {
    const title = create_element(`<div class="info-box-title">${point.title}</div>`);
    info_box.appendChild(title);
}


function append_parts(info_box, point) {
    const div = create_element(`<div class="info-box-parts-list"></div>`);
    for (const part of point.parts) {
        const row = create_element(`<div class="info-box-part">${part.title}</div>`);
        row.onclick = function () {
            const new_point = {
                world: point.world,
                ...part,
            };
            open_info_box(new_point, point);
        };
        div.appendChild(row);
    }
    info_box.appendChild(div);
}

function append_text(info_box, point) {
    const text = point.text.trim()
        .replace(/(\r\n|\r|\n)/g, '<br>')
        .replace(/(=([A-Za-z0-9_/]+))/g, (str, g1, g2) => `<img class="screenshot" src="screenshots/${g2}.png">`);
    const div = create_element(`<div>${text}</div>`);
    info_box.appendChild(div);
}

function init_world(world) {
    world.map.style.width = MAP_SIZE + "px";
    world.map.style.height = MAP_SIZE + "px";
    world.map.replaceChildren();
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

function add_points() {
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
            const type = point.type || "normal";
            element.classList.add("point-" + type);
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

function main() {
    check_duplicates();
    add_points();
}

main();
