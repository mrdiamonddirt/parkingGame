import kaboom from "kaboom";

kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
});

// load sprites
loadSprite("car", "sprites/car.png");
loadSprite("wheel", "sprites/wheel.png");
loadSprite("wall", "sprites/wall.png");
loadSprite("objective", "sprites/objective.png");

//  load sounds
loadSound("LamboStart", "./sounds/LamboSVStart.ogg");
loadSound("car-horn", "./sounds/car-horn.wav");
loadSound("LamboRun", "./sounds/RunLoopLambo.wav");

let bgImage = loadSprite("bg", "sprites/bg.png");

let wheelRotation = 0;
let engineOn = false;
let currentCarRotation = 90;
let controlsShowing = true;
let engineStartShowing = false;
let ParkingSpot = {
    spot1: {
        x: 1180,
        y: 810,
    },
};

scene("game", () => {
    layers(["bg", "obj", "ui"], "obj");

    const objective = add([
        pos(ParkingSpot.spot1.x, ParkingSpot.spot1.y),
        rotate(13),
        scale(0.4),
        sprite("objective"),
        area(),
        layer("obj"),
        z(1),
    ]);

    const controls = add([
        pos(0, 0),
        layer("ui"),
        fixed(),
        rect(400, 500),
        color(255, 255, 255),
        text(
            `Controls \n Up: Accelerate \n Down: Reverse \n Left And Right: Steer \n Enter: Turn Engine ${engineOn} \n Click: Honk Horn \n / to hide controls`,
            {
                size: 22,
                color: rgb(255, 255, 255),
            }
        ),
        z(1),
        onUpdate(() => {
            if (engineOn) {
                controls.text = `Controls \n Up: Accelerate \n Down: Reverse \n Left And Right: Steer \n Enter: Turn Engine ${engineOn} \n Click: Honk Horn \n / to hide controls`;
            } else {
                controls.text = `Controls \n Up: Accelerate \n Down: Reverse \n Left And Right: Steer \n Enter: Turn Engine ${engineOn} \n Click: Honk Horn \n / to hide controls`;
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

    function ShowEngineStart() {
        if (!engineStartShowing) {
            engineStartShowing = true;
            startEngine.hidden = false;
            setTimeout(() => {
                engineStartShowing = false;
                startEngine.hidden = true;
            }, 2000);
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
        area(100, 100),
        body({
            maxVel: 0,
        }),
        solid(),
        scale(0.1),
        rotate(currentCarRotation),
        origin("center"),
        sprite("car"),
        layer("obj"),
        carControls(),
        cameraFollow(),
        z(1),
        // components
        {
            dead: false,
            speed: 0,
        },
        onUpdate(() => {
            // if (engineOn) {
            //     play("LamboRun");
            // }
        }),
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

    const startEngine = add([
        pos(car.pos.x - 400, car.pos.y - 200),
        layer("ui"),
        fixed(),
        origin("center"),
        text("Press Enter To Start Engine", {
            size: 32,
            color: rgb(255, 255, 255),
        }),
        // rect(400, 100),
        // color(255, 255, 255),
        // z(3),
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
            play("LamboStart");
            setTimeout(() => {
                engineOn = true;
            }, 2000);
        }
        console.log("engine on: " + engineOn);
    });

    onClick(() => {
        play("car-horn");
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
                // swap steering direction to be mirrored/
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
        if (!engineOn) {
            ShowEngineStart();
            console.log("engine not on");

            return;
        } else {
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
        if (!engineStartShowing) {
            startEngine.hidden = true;
        }

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
        // console.log("car angle", car.angle);
        // console.log("wheel angle", wheel.angle);
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
