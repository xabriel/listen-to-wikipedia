import {Howl} from "howler";

export let celesta = []
export let clav = []
export let swells = []

export function calculateSize(data) {
    try {
        const scale_factor = 5
        let orig_size = data.length.new - data.length.old
        const abs_size = Math.abs(orig_size);
        let scaled_size = Math.max(Math.sqrt(abs_size) * scale_factor, 3);
        return [orig_size, scaled_size];
    } catch (e) {
        console.log(e);
        console.log(JSON.stringify(data));
        return [0, 0];
    }
}

export function loadSounds() {
    // load celesta and clav sounds
    let filename = null
    for (let i = 1; i <= 24; i++) {
        if (i > 9) {
            filename = 'c0' + i
        } else {
            filename = 'c00' + i
        }
        celesta.push(new Howl({
            src : ['sounds/celesta/' + filename + '.ogg',
                   'sounds/celesta/' + filename + '.mp3'],
            volume : 0.2
        }))
        clav.push(new Howl({
            src : ['sounds/clav/' + filename + '.ogg',
                   'sounds/clav/' + filename + '.mp3'],
            volume : 0.2
        }))
    }

    // load swell sounds
    for (let i = 1; i <= 3; i++) {
        swells.push(new Howl({
            src : ['sounds/swells/swell' + i + '.ogg',
                   'sounds/swells/swell' + i + '.mp3'],
            volume : 1
        }))
    }
}

export function playSound(size, type) {
    const max_pitch = 100.0;
    const log_used = 1.0715307808111486871978099;
    const pitch = 100 - Math.min(max_pitch, Math.log(size + log_used) / Math.log(log_used));
    let index = Math.floor(pitch / 100.0 * Object.keys(celesta).length);
    const fuzz = Math.floor(Math.random() * 4) - 2;
    index += fuzz;
    index = Math.min(Object.keys(celesta).length - 1, index);
    index = Math.max(1, index);

    // TODO: do we want to cap amount of currently playing sounds like in the original version?
    if (type == 'add') {
        celesta[index].play();
    } else {
        clav[index].play();
    }
}

// TODO: Need to figure were to get new user events from
export function playRandomSwell() {
    var index = Math.round(Math.random() * (swells.length - 1));
    swells[index].play();
}