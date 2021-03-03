// GENERALITIES

var teta = 0;

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

        window.value = object
        scene.add(object);
        object.castShadow = true;
        object.position.y -= 0;
        object.rotation.x = 90 * Math.PI / 180
        object.scale.set(15, 15, 15)

    });

});

// ADD FLOOR
var geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
var floor = new THREE.Mesh(geometry, material);
scene.add(floor);


function keyDownHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        let i = -8
        let t1 = 0


        function GoStraight() {
            while (t < 0.5) {
                window.value.position.y -= t ^ 2 * Math.cos(teta)
                window.value.position.x -= t ^ 2 * Math.sin(teta)
                i += 0.05
                t += 0.01;
                setTimeout(GoStraight, 0)
            }
            while (t > 0.5) {

                window.value.position.y -= t ^ 2 * Math.cos(teta)
                window.value.position.x -= t ^ 2 * Math.sin(teta)
                i += 0.05
                setTimeout(GoStraight, 0)
            }


        }
        setTimeout(GoStraight, 0)

        //window.value.position.y -= 5 * Math.cos(teta)
        //window.value.position.x -= 5 * Math.sin(teta)



    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        let j = 2

        function stopStraight() {
            if (j > 30) {
                return;
            }
            window.value.position.y -= 1 / j * Math.cos(teta)
            window.value.position.x -= 1 / j * Math.sin(teta)
            j += 0.05
            setTimeout(stopStraight, 0)
        }
        setTimeout(stopStraight, 0)
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}


var animate = function() {
    requestAnimationFrame(animate);
    //controls.update();
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
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

animate();