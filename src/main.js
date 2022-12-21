import kaboom from "kaboom";

kaboom();

loadSprite("car", "sprites/car.png");
loadSprite("wheel", "sprites/wheel.png");

let wheelRotation = 0;
let carSpeed = 0;
let engineOn = true;
let carAngle = 0;

const car = add([pos(120, 80), scale(0.1), origin("center"), sprite("car")]);

const speedometer = add([
    pos(850, 80),
    origin("center"),
    text(carSpeed + " mph"),
]);

const wheel = add([
    pos(450, 80),
    scale(0.1),
    rotate(wheelRotation),
    origin("center"),
    sprite("wheel"),
]);

onClick(() => {
    console.log("clicked");
});

onKeyDown("up", () => {
    console.log("up");
    // add a force to the car
    if (engineOn) {
        carSpeed += 2;
        speedometer.text = carSpeed;
    }
});

onKeyDown("down", () => {
    console.log("down");
    // stop the car
    if (carSpeed > 0) {
        carSpeed -= 1;
        speedometer.text = carSpeed;
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
    wheel.angle = wheelRotation;
    if (carSpeed > 0) {
        carSpeed -= 1;
        car.pos.x += carSpeed;
        speedometer.text = carSpeed;
        angle = Math.atan2(wheelRotation, carSpeed);
    }
});
