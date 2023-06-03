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

// variables
let bgImage = loadSprite("bg", "sprites/bg.png");

let wheelRotation = 0;
let engineOn = false;
let currentCarRotation = 90;
let controlsShowing = true;
let engineStartShowing = false;
// get the time the game started
let startTime = Date.now();
// store the time the game started
let time = 0;
var splits = [];

let ParkingSpot = {
    spot1: {
        x: 1180,
        y: 810,
        angle: 13,
    },
    spot2: {
        x: 1140,
        y: 550,
        angle: 13,
    },
    spot3: {
        x: 550,
        y: 350,
        angle: 190,
    },
};

// main scene
scene("game", () => {
    // add layers
    layers(["bg", "obj", "ui"], "obj");

    let level = 1;

    const timer = add([
        pos(800,40),
        layer("ui"),
        fixed(),
        origin("center"),
        rect(100, 400),
        color(60, 235, 60),
        text(time, {
            size: 32,
            color: rgb(0, 0, 0),
        }),
        z(4),
        onUpdate(() => {
            // update the timer every frame
            time = Date.now() - startTime;
            // add a decimal point to the time for seconds and milliseconds
            time = (time / 1000).toFixed(2);
            timer.text = time;
        }),
    ]);

    const splitTimer = add([
        pos(800, 80),
        layer("ui"),
        fixed(),
        origin("center"),
        rect(100, 400),
        color(60, 235, 60),
        text(splits, {
            size: 32,
            color: rgb(0, 0, 0),
        }),
        z(4),
    ]);

    const objective = add([
        pos(ParkingSpot.spot1.x, ParkingSpot.spot1.y),
        rotate(ParkingSpot.spot1.angle),
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

    function getObjective() {
        console.log("reached objective");
        if (level == 1) {
            level = 2;
            // add time for the split
            splits.push(time);
            objective.pos.x = ParkingSpot.spot2.x;
            objective.pos.y = ParkingSpot.spot2.y;
            objective.rotate = ParkingSpot.spot2.angle;
            return;
        }
        if (level == 2) {
            level = 3;
            splits.push(time);
            objective.pos.x = ParkingSpot.spot3.x;
            objective.pos.y = ParkingSpot.spot3.y;
            objective.rotate = ParkingSpot.spot3.angle;
            return;
        }

    }
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
        scale(0.15),
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
            // console.log(car.pos.x, car.pos.y)
        }),
    ]);

    // const speedometer = add([
    //     pos(800, 80),
    //     layer("ui"),
    //     fixed(),
    //     origin("center"),
    //     text(car.speed + " mph", {
    //         size: 32,
    //         color: rgb(255, 255, 255),
    //     }),
    //     onUpdate(() => {
    //         speedometer.text = car.speed + " mph";
    //     }),
    // ]);

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
                if (!engineOn) {
                    return;
                }
                return keyIsDown("up");
            },
            isReverse() {
                // todo
                // swap steering direction to be mirrored/
                if (!engineOn) {
                    return;
                }
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
        if (!engineOn) {
            return;
        }
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
        if (engineOn) {
        if (wheelRotation >= -540) {
            console.log("left");
            wheelRotation -= 5;
        }
        console.log(wheelRotation);
        wheel.angle = wheelRotation;
        // if (car.isMoving() && car.speed > 0) {
        //     car.angle -= 1;
        // }
        }
    });

    onKeyDown("right", () => {
        if (!engineOn) {
            return;
        }
        if (engineOn) {
        if (wheelRotation <= 540) {
            console.log("right");
            wheelRotation += 5;
        }
        console.log(wheelRotation);
        wheel.angle = wheelRotation;
        // if (car.isMoving() && car.speed > 0) {
        //     car.angle += 1;
        // }
        }
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

        // get distance to the objective
        let distanceX = Math.abs(objective.pos.x + 80 - car.pos.x); // + 80
        let distanceY = Math.abs(objective.pos.y + 80 - car.pos.y); // + 80
        // and or 180 degrees of the objective angle
        let objectRotation = Math.abs(objective.angle - car.angle); // also check if the car is facing the opposite direction

        // console.log("distance", distanceX, distanceY, objectRotation);
        // check if the car is close enough to the objective
        if (
            (distanceX < 10 && distanceY < 10 && objectRotation < 2) ||
            (distanceX < 10 && distanceY < 10 && objectRotation > 178)
        ) {
            console.log("objective reached");
            play("car-horn");
            // todo objective reached
            // todo show next objective
            getObjective();
        }

        const direction = forward ? 1 : -1;

        // get wheel direction
        // const wheelDirection = wheel.rotate;

        // calculate the angle between the car and the wheel
        const vec = angleToVec2(car.angle);

        if (engineOn && car.isMoving) {
            car.pos.x += vec.x * car.speed * direction;
            car.pos.y += vec.y * car.speed * direction;
        }
        if (Math.abs(wheelRotation) > 2) {
            // Turn the car based on the wheel's rotation if it is more than 2 degrees
            const turnDirection = car.isReverse() ? -1 : 1;
            car.angle += wheelRotation * 0.007 * turnDirection;
        } else if (Math.abs(wheelRotation) < 2) {
            const turnDirection = car.isReverse() ? 1 : -1;
            car.angle -= wheelRotation * 0.007 * turnDirection;
        }
        if (car.isReverse()) {
            // todo reverse
            // mirror the wheel rotation
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
