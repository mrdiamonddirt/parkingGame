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
let engineOn = false;
let currentCarRotation = 90;
let controlsShowing = true;

scene("game", () => {
    layers(["bg", "obj", "ui"], "obj");

    const controls = add([
        pos(0, 0),
        layer("ui"),
        fixed(),
        rect(400, 500),
        color(255, 255, 255),
        text(
            `Controls \n Up: Accelerate \n Down: Reverse \n Left And Right: Steer \n Enter: Turn Engine ${engineOn} \n Click: Honk Horn \n (Currently: Not Implemented) \n / to hide controls`,
            {
                size: 22,
                color: rgb(255, 255, 255),
            }
        ),
        z(1),
        onUpdate(() => {
            if (engineOn) {
                controls.text = `Controls \n Up: Accelerate \n Down: Reverse \n Left And Right: Steer \n Enter: Turn Engine ${engineOn} \n Click: Honk Horn \n (Currently: Not Implemented) \n / to hide controls`;
            } else {
                controls.text = `Controls \n Up: Accelerate \n Down: Reverse \n Left And Right: Steer \n Enter: Turn Engine ${engineOn} \n Click: Honk Horn \n (Currently: Not Implemented) \n / to hide controls`;
            }
        }),
    ]);

    function toggleControls() {
        if (controlsShowing) {
            controlsShowing = false;
            controls.hidden = true;
            setTimeout(() => {}, 1000);
        } else {
            controlsShowing = true;
            controls.hidden = false;
            setTimeout(() => {}, 1000);
        }
    }

    const wheel = add([
        fixed(),
        pos(580, 80),
        scale(0.1),
        rotate(wheelRotation),
        origin("center"),
        sprite("wheel"),
        layer("ui"),
        z(1),
    ]);

    const car = add([
        pos(1020, 720),
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
        onUpdate(() => {
            speedometer.text = car.speed + " mph";
        }),
    ]);

    function cameraFollow() {
        return {
            update() {
                camPos(car.pos);
            },
        };
    }

    onKeyPress("/", () => {
        toggleControls();
        console.log("controls hidden");
    });

    onKeyPress("enter", () => {
        if (engineOn) {
            engineOn = false;
        } else {
            engineOn = true;
        }
        console.log("engine on: " + engineOn);
    });

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
            const maxSpeed = 10;
            car.speed = Math.min(car.speed + 2, maxSpeed);
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
        if (!engineOn) {
            return;
        }
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
        if (!engineOn) {
            return;
        }
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
        const forward = car.isDrive();
        const backward = car.isReverse();
        if (!forward && !backward) {
            // console.log("not moving", car.speed);
            // if the car is not moving, stop the car
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
            "=================================================================",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=                                                               =",
            "=================================================================",
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
            scale(2),
            pos(0, 0),
            z(0),
            origin("topleft"),
        ])
    );
});

go("game");
