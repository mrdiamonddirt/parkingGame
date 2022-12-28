import kaboom from "kaboom";

kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
});

loadSprite("car", "sprites/car.png");
loadSprite("wheel", "sprites/wheel.png");
loadSprite("wall", "sprites/wall.png");
let bgImage = loadSprite("bg", "sprites/bg.png");

let wheelRotation = 0;
let engineOn = true;
let currentCarRotation = 0;

scene("game", () => {
    layers(["bg", "obj", "ui"], "obj");

    const controls = add([
        pos(0, 0),
        layer("ui"),
        fixed(),
        rect(100, 100),
        text("Controls", {
            size: 32,
            color: rgb(255, 255, 255),
        }),
        z(1),
    ]);

    const wheel = add([
        pos(450, 80),
        fixed(),
        scale(0.1),
        rotate(wheelRotation),
        origin("center"),
        sprite("wheel"),
        layer("ui"),
        z(1),
    ]);

    const car = add([
        pos(120, 80),
        area(),
        body({
            maxVel: 0,
        }),
        solid(),
        scale(0.1),
        rotate(currentCarRotation),
        origin("center"),
        sprite("car"),
        carControls(),
        cameraFollow(),
        // components
        {
            dead: false,
            speed: 0,
        },
    ]);

    const speedometer = add([
        pos(800, 80),
        layer("ui"),
        fixed(),
        origin("center"),
        text(car.speed + " mph", {
            size: 32,
            color: rgb(255, 255, 255),
        }),
    ]);

    function cameraFollow() {
        return {
            update() {
                camPos(car.pos);
            },
        };
    }

    onClick(() => {
        console.log("clicked");
    });

    function carControls() {
        return {
            isDrive() {
                // todo
                return keyIsDown("up");
            },
            isReverse() {
                // todo
                // swap steering direction to be mirrored

                return keyIsDown("down");
            },
            isMoving() {
                // todo
                return this.isDrive() || this.isReverse();
            },
        };
    }

    onKeyDown("up", () => {
        // console.log("up");
        // add a force to the car
        // accelerate the car
        if (engineOn) {
            const maxSpeed = 30;
            car.speed = Math.min(car.speed + 2, maxSpeed);
            // speedometer.text = car.speed;
        }
    });

    onKeyDown("down", () => {
        console.log("down");
        // stop the car
        // if (car.speed > 0) {
        //     car.speed -= 1;
        //     speedometer.text = car.speed;
        // }
    });

    onKeyDown("left", () => {
        if (wheelRotation >= -540) {
            console.log("left");
            wheelRotation -= 5;
        }
        console.log(wheelRotation);
        wheel.angle = wheelRotation;
        // if (car.isMoving() && car.speed > 0) {
        //     car.angle -= 1;
        // }
    });

    onKeyDown("right", () => {
        if (wheelRotation <= 540) {
            console.log("right");
            wheelRotation += 5;
        }
        console.log(wheelRotation);
        wheel.angle = wheelRotation;
        // if (car.isMoving() && car.speed > 0) {
        //     car.angle += 1;
        // }
    });

    function angleToVec2(angle) {
        const vx = Math.cos(deg2rad(angle));
        const vy = Math.sin(deg2rad(angle));
        return vec2(vx, vy);
    }

    onUpdate(() => {
        // update speedometer
        speedometer.text = car.speed + " mph";

        const forward = car.isDrive();
        const backward = car.isReverse();
        if (!forward && !backward) {
            // decelerate stops car from being reversed
            // if (car.speed > 0) {
            //     car.speed -= 1;
            // }
            return;
        }

        const direction = forward ? 1 : -1;

        // get wheel direction
        const wheelDirection = wheel.rotate;

        // calculate the angle between the car and the wheel
        const vec = angleToVec2(car.angle);

        if (engineOn && car.isMoving) {
            car.pos.x += vec.x * car.speed * direction;
            car.pos.y += vec.y * car.speed * direction;
        }
        if (Math.abs(wheelRotation) > 2) {
            // Turn the car based on the wheel's rotation if it is more than 2 degrees
            car.angle += wheelRotation * 0.007;
        } else if (Math.abs(wheelRotation) < 2) {
            car.angle -= wheelRotation * 0.007;
        }
        if (car.isReverse()) {
            // todo reverse
        }
        console.log("car angle", car.angle);
        console.log("wheel angle", wheel.angle);
    });

    addLevel(
        [
            "========================================================================================================================================================================================================",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "=                                                                                                                                                                                                      =",
            "========================================================================================================================================================================================================",
        ],
        {
            // define the size of each block
            width: 50,
            height: 50,
            // define what each symbol means, by a function returning a component list (what will be passed to add())
            "=": () => [sprite("wall"), area(), scale(0.1), solid()],
            "^": () => [sprite("objective"), area(), pos(0, 0)],
            // C: () => [sprite("car"), area(), scale(0.1), pos(0, 0)],
            // "^": () => [sprite("enemy"), area(), "danger"],
        },
        add([
            sprite("bg"),
            layer("bg"),
            scale(1),
            pos(0, 0),
            z(0),
            origin("center"),
        ])
    );
});

go("game");
