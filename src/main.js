import kaboom from "kaboom";

kaboom();

loadSprite("car", "sprites/car.png");
loadSprite("wheel", "sprites/wheel.png");
loadSprite("wall", "sprites/wall.png");

let wheelRotation = 0;
let engineOn = true;
let carAngle = 0;

const car = add([
    pos(120, 80),
    area(),
    body({
        friction: 0.1,
        mass: 1,
        shape: "square",
        inertia: 0.1,
        speed: 0,
    }),
    solid(),
    scale(0.1),
    rotate(carAngle),
    origin("center"),
    sprite("car"),
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

const wheel = add([
    pos(450, 80),
    scale(0.1),
    rotate(wheelRotation),
    origin("center"),
    sprite("wheel"),
    z(1),
]);

onClick(() => {
    console.log("clicked");
});

onKeyDown("up", () => {
    console.log("up");
    // add a force to the car
    if (engineOn) {
        car.speed += 2;
        speedometer.text = car.speed;
    }
});

onKeyDown("down", () => {
    console.log("down");
    // stop the car
    if (car.speed > 0) {
        car.speed -= 1;
        speedometer.text = car.speed;
    }
});

onKeyDown("left", () => {
    if (wheelRotation >= -45) {
        console.log("left");
        wheelRotation -= 1;
    }
    console.log(wheelRotation);
});

onKeyDown("right", () => {
    if (wheelRotation <= 45) {
        console.log("right");
        wheelRotation += 1;
    }
    console.log(wheelRotation);
});
onUpdate(() => {
    currentCarRotation = carAngle;
    if (car.speed > 0) {
        car.speed -= 1;
        speedometer.text = car.speed;
        car.pos.x += car.speed;
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
        // "^": () => [sprite("enemy"), area(), "danger"],
    }
);
