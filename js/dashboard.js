// Dashboard UI state — a UI draft, no backend.
// One render() writes every surface, so nothing can drift out of sync:
// body[data-lights], the power button, the master "All lights" control, the
// room dots, the panel label and the meta rows all come from the same state.
(() => {
    const body = document.body;
    const power = document.getElementById('power');
    const allLights = document.getElementById('all-lights');
    const rooms = Array.from(document.querySelectorAll('.room'));

    if (!power || !allLights || !rooms.length) {
        return;
    }

    const panelLabel = document.getElementById('panel-label');
    const metaRoom = document.getElementById('meta-room');
    const metaFixtures = document.getElementById('meta-fixtures');
    const metaStatus = document.getElementById('meta-status');

    // Initial state is read from the markup, so the first paint is already correct.
    const state = {
        current: rooms.find((room) => room.getAttribute('aria-pressed') === 'true') ?? rooms[0],
        lights: new Map(rooms.map((room) => [room, room.dataset.on === 'true'])),
    };

    const allOn = () => rooms.every((room) => state.lights.get(room));

    const render = () => {
        const { current } = state;
        const name = current.dataset.name;
        const on = state.lights.get(current);
        const everythingOn = allOn();

        rooms.forEach((room) => {
            const roomOn = state.lights.get(room);

            room.setAttribute('aria-pressed', String(room === current));
            room.dataset.on = String(roomOn);
            room.setAttribute('aria-label', `${room.dataset.name} — lights ${roomOn ? 'on' : 'off'}`);
        });

        body.dataset.lights = on ? 'on' : 'off';
        power.setAttribute('aria-pressed', String(on));
        power.setAttribute('aria-label', `Turn ${name} lights ${on ? 'off' : 'on'}`);

        allLights.dataset.on = String(everythingOn);
        allLights.setAttribute('aria-label', `Turn all lights ${everythingOn ? 'off' : 'on'}`);

        panelLabel.textContent = `<${current.dataset.room}>`;
        metaRoom.textContent = name;
        metaFixtures.textContent = current.dataset.fixtures;
        metaStatus.textContent = on ? 'On' : 'Off';
    };

    power.addEventListener('click', () => {
        state.lights.set(state.current, !state.lights.get(state.current));
        render();
    });

    // Master: one click sets every room — on, unless they are all already on.
    allLights.addEventListener('click', () => {
        const next = !allOn();

        rooms.forEach((room) => state.lights.set(room, next));
        render();
    });

    rooms.forEach((room) => {
        room.addEventListener('click', () => {
            if (state.current === room) {
                return;
            }

            state.current = room;
            render();
        });
    });

    render();
})();
