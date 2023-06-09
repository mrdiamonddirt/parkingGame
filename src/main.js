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
        x: 1260,
        y: 880,
        angle: 13,
    },
    spot2: {
        x: 1220,
        y: 620,
        angle: 13,
    },
    spot3: {
        x: 660,
        y: 570,
        angle: 152,
    },
    spot4: {
        x: 1340,
        y: 1420,
        angle: 13,
    },
    spot5: {
        x: 2800,
        y: 778,
        angle: 192,
    },
    spot6: {
        x: 2800,
        y: 778,
        angle: 192,
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
            // add a decimal point to the time for seconds and milliseconds and format minutes
            time = (time / 1000).toFixed(2);
            // format the time to minutes and seconds
            if (time >= 60) {
            minutes = Math.floor(time / 60);
            seconds = time - minutes * 60;
            time = minutes + ":" + seconds.toFixed(2);
            }
            timer.text = time;
        }),
    ]);

    const splitTimer = add([
        pos(1000, 80),
        layer("ui"),
        fixed(),
        origin("center"),
        rect(200, 400),
        color(60, 235, 60),
        text(splits, {
            size: 32,
            color: rgb(0, 0, 0),
            textAlign: "center",
            // remove comas from the array with regex    
        }),
        z(4),
    ]);

    const objective = add([
        pos(ParkingSpot.spot1.x, ParkingSpot.spot1.y),
        rotate(ParkingSpot.spot1.angle),
        scale(0.4),
        origin("center"),
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
        // console.log("reached objective");
        const levels = [null, ParkingSpot.spot1, ParkingSpot.spot2, ParkingSpot.spot3, ParkingSpot.spot4, ParkingSpot.spot5, ParkingSpot.spot6];

        if (level >= 1 && level <= 5) {
            level++;
            splits.push(time);
            if (level > 5) {
                console.log("Level", level, "complete");
                console.log("game over");
                console.log("splits", splits);
                let finishtime = time;
                // get the highscore from local storage
                let highscore = localStorage.getItem("highscore");
                // if there isn't a highscore, set it to 0
                if (highscore == null) {
                    highscore = 0;
                }
                // if the current time is less than the highscore, set the highscore to the current time
                if (finishtime < highscore || highscore == 0) {
                    localStorage.setItem("highscore", finishtime);
                    // new highscore set
                    console.log("new highscore set");
                }
                const highscoreBoard = add([
                    pos(600, 400),
                    layer("ui"),
                    fixed(),
                    origin("center"),
                    rect(400, 400),
                    color(255, 255, 255),
                    text(`Congratulations You have Finished The Game! \n Your time was ${finishtime} \n
                    Your best time: ` + localStorage.getItem("highscore") + `\n Refresh the Page to try again`, {
                        size: 32,
                        color: rgb(0, 0, 0),
                        textAlign: "center",
                    }),
                    z(4),
                ]);
                // go("gameover");
            }
            objective.pos.x = levels[level].x;
            objective.pos.y = levels[level].y;
            objective.angle = levels[level].angle;
            console.log("level", level);
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
                return isKeyDown("up");
            },
            isReverse() {
                // todo
                // swap steering direction to be mirrored/
                if (!engineOn) {
                    return;
                }
                return isKeyDown("down");
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
            // console.log("engine not on");
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
        // console.log("down");
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
            // console.log("left");
            wheelRotation -= 5;
        }
        // console.log(wheelRotation);
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
            // console.log("right");
            wheelRotation += 5;
        }
        // console.log(wheelRotation);
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
        let distanceX = Math.abs(objective.pos.x - car.pos.x); // + 80
        let distanceY = Math.abs(objective.pos.y - car.pos.y); // + 80
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
