// GENERALITIES

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();

renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 100;
camera.position.y = -150;
camera.position.x = 100;

var GlobalCar;

function init() {



    // CONTROLS MOUSE
    /*var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    */

    // LIGHTS 
    var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);

    var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    keyLight.castShadow = true;
    fillLight.castShadow = true;
    backLight.castShadow = true;
    keyLight.shadowDarkness = 1;
    fillLight.shadowDarkness = 1;
    backLight.shadowDarkness = 1;

    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);


    // ADD CAR
    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath('assets/');
    mtlLoader.setPath('assets/');
    mtlLoader.load('Jeep_Renegade_2016.mtl', function(materials) {

        materials.preload();

        let objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('assets/');
        objLoader.load('Jeep_Renegade_2016.obj', function(object) {

            GlobalCar = object
            scene.add(object);
            object.castShadow = true;
            object.position.y -= 0;
            object.position.x -= 0;
            object.rotation.x = 90 * Math.PI / 180
            object.scale.set(12, 12, 12)

        });

    });

    // ADD FLOOR
    var geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    var floor = new THREE.Mesh(geometry, material);
    scene.add(floor);



}
/**
 * CAR OBJECT
 */
x = 0;
y = 0;
var car = {
    x: x,
    y: y,
    vx: 0,
    vy: 0,
    angle: 0,

    topSpeed: 5,
    topSpeedBack: -2,
    acceleration: 0.2,
    reverse: 0.2,
    brakes: 0.3,
    friction: 0.07,
    handeling: 15,
    grip: 15,
    minGrip: 5,
    speed: 0,
    drift: 0,
    directionnalFriction: 8,

    left: false,
    forward: false,
    right: false,
    backward: false
}



window.teta = 0;
var i = 2


/**
 * DETECTION OF KEYS FOR MOVEMENT
 */

var leftKey = 37;
var upKey = 38;
var rightKey = 39;
var downKey = 40;



/**
 * UPDATE CAR ALL PARAMETERS
 */
var fired = false;

$(window).keydown(function(e) {
    var keyCode = e.keyCode;

    if (keyCode == leftKey) {
        car.left = true;
    } else if (keyCode == upKey) {
        car.forward = true;
    } else if (keyCode == rightKey) {
        car.right = true;
    } else if (keyCode == downKey) {
        car.backward = true;
    }
});
$(window).keyup(function(e) {
    var keyCode = e.keyCode;
    if (keyCode == leftKey) {
        car.left = false;
    } else if (keyCode == upKey) {
        car.forward = false;
    } else if (keyCode == rightKey) {
        car.right = false;
    } else if (keyCode == downKey) {
        car.backward = false;
    }
});
t = 0
let avance = false
let recul = false


function updateStageObjects() {

    // Car acceleration to top speed
    if (car.forward) {
        if (car.speed < car.topSpeed) {
            car.speed = car.speed + car.acceleration;
        }
        avance = true
    }
    if (car.backward) {
        if (car.speed < 1) {
            if (car.speed > car.topSpeedBack) {
                car.speed = car.speed - car.reverse;
            }
        } else if (car.speed > 1) {
            car.speed = car.speed - car.brakes;
        }
    }

    // Car drifting logic
    if (car.forward && car.left) {
        if (car.drift > -35) {
            car.drift = car.drift - 3;
        }
    } else if (car.forward && car.right) {
        if (car.drift < 35) {
            car.drift = car.drift + 3;
        }
    } else if (car.forward && !car.left && car.drift > -40 && car.drift < -3) {
        car.drift = car.drift + 3;
    } else if (car.forward && !car.right && car.drift < 40 && car.drift > 3) {
        car.drift = car.drift - 3;
    }
    if (car.drift > 3) {
        if (!car.forward && !car.left) {
            car.drift = car.drift - 4;
        }
    } else if (car.drift > -40 && car.drift < -3) {
        if (!car.forward && !car.right) {
            car.drift = car.drift + 4;
        }
    }


    // General car handeling when turning    
    if (car.left && car.speed > 0) {
        car.angle = car.angle + (car.handeling * car.speed / car.topSpeed);

    } else if (car.right && car.speed > 0) {
        car.angle = car.angle - (car.handeling * car.speed / car.topSpeed);
    } else if (car.right && car.speed < 0) {
        car.angle = car.angle + (car.handeling * car.speed / car.topSpeed);
    } else if (car.left && car.speed < 0) {
        car.angle = car.angle - (car.handeling * car.speed / car.topSpeed);
    }

    // Constant application of friction / air resistance
    if (car.speed > 0) {
        car.speed = car.speed - car.friction;
    } else if (car.speed < 0) {
        car.speed = car.speed + car.friction;
    }


    // Update car velocity (speed + direction)
    car.vy = -Math.cos(car.angle / car.directionnalFriction * Math.PI / 180) * car.speed;
    car.vx = Math.sin(car.angle / car.directionnalFriction * Math.PI / 180) * car.speed;

    // Plot the new velocity into x and y cords
    GlobalCar.position.y += car.vy;
    GlobalCar.position.x += car.vx;
    GlobalCar.rotation.y = car.angle / car.directionnalFriction * Math.PI / 180

    camera.position.y += car.vy;
    camera.position.x += car.vx;
}
/**
 * FUNCTION FOR ANIMATION
 */


var animate = function() {

    requestAnimationFrame(animate);
    //controls.update();
    updateStageObjects()

    camera.rotation.x = 60 * Math.PI / 180;
    camera.rotation.y = 30 * Math.PI / 180;
    camera.rotation.z = 15 * Math.PI / 180;
    renderer.render(scene, camera);
};


onWindowSize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowSize, false)
init()
setTimeout(() => {
    animate();
}, 500);