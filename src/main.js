import kaboom from "kaboom";

kaboom();

loadSprite("car", "sprites/car.png");
loadSprite("wheel", "sprites/wheel.png");
loadSprite("wall", "sprites/wall.png");

let wheelRotation = 0;
let engineOn = true;
let currentCarRotation = 0;

scene("game", () => {
    const controls = add([
        pos(0, 0),
        rect(100, 100),
        text("Controls", {
            size: 32,
            color: rgb(255, 255, 255),
        }),
        z(1),
    ]);

    const wheel = add([
        pos(450, 80),
        scale(0.1),
        rotate(wheelRotation),
        origin("center"),
        sprite("wheel"),
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
        // cameraFollow(),
        // components
        {
            dead: false,
            speed: 0,
        },
    ]);

    const speedometer = add([
        pos(850, 80),
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
        if (engineOn) {
            const maxSpeed = 10;
            car.speed = Math.min(car.speed + 2, maxSpeed);
            speedometer.text = car.speed;
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
        if (wheelRotation >= -90) {
            console.log("left");
            wheelRotation -= 1;
        }
        console.log(wheelRotation);
        wheel.angle = wheelRotation;
        // if (car.isMoving() && car.speed > 0) {
        //     car.angle -= 1;
        // }
    });

    onKeyDown("right", () => {
        if (wheelRotation <= 90) {
            console.log("right");
            wheelRotation += 1;
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
        // get car direction
        // const carDirection = car.angle;

        const forward = car.isDrive();
        const backward = car.isReverse();
        if (!forward && !backward) {
            return;
        }

        const direction = forward ? 1 : -1;

        // get wheel direction
        const wheelDirection = wheel.rotate;

        // calculate the angle between the car and the wheel
        const vec = angleToVec2(car.angle);

        if (engineOn && car.isMoving) {
            speedometer.text = car.speed;

            car.pos.x += vec.x * car.speed * direction;
            car.pos.y += vec.y * car.speed * direction;
        }
        if (wheelRotation > 5) {
            car.angle += 1;
        } else if (wheelRotation > 15) {
            car.angle += 2;
        } else if (wheelRotation < -5) {
            car.angle -= 1;
        }
        if (car.isReverse()) {
            // todo reverse
        }
    });

    addLevel(
        [
            "==============================",
            "=                            =",
            "=                            =",
            "=                            =",
            "=                            =",
            "=                            =",
            "=                            =",
            "=                            =",
            "=                            =",
            "=                            =",
            "=                            =",
            "=                            =",
            "=                            =",
            "==============================",
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
        }
    );
});

go("game");
