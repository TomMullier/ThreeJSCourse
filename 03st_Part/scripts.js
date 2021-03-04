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

            window.value = object
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
window.teta = 0;
var i = 2


function keyDownHandler(e) {

    if (e.key == "Up" || e.key == "ArrowUp") {
        function starter() {

            //console.log(window.value.position.y)
            window.value.position.y -= i * Math.cos(window.teta)
            camera.position.y -= i * Math.cos(window.teta)
                //window.value.position.y -= (-12 * Math.pow(Math.log(-i), 5) + 10) * Math.cos(teta)
                //console.log(window.value.position.y)
            window.value.position.x -= i * Math.sin(window.teta)
            camera.position.x -= i * Math.sin(window.teta)
                //window.value.position.x -= (-12 * Math.pow(Math.log(-i), 5) + 5) * Math.sin(teta)
                //console.log(i)
            if (i < 5) {
                i += 0.1
            }

        }
        starter();
    }
    if ((e.key == "Right" || e.key == "ArrowRight")) {
        window.teta += 2 * Math.PI / 180
        window.value.rotation.y = -teta
        console.log(teta)
            //console.log(window.value.position.y)
        window.value.position.y -= i * Math.cos(window.teta)
        camera.position.y -= i * Math.cos(window.teta)
            //console.log(window.value.position.y)
        window.value.position.x -= i * Math.sin(window.teta)
        camera.position.x -= i * Math.sin(window.teta)
            //console.log(i)
        if (i < 5) {
            i += 0.01
        }


    }
    if ((e.key == "Left" || e.key == "ArrowLeft")) {
        window.teta -= 2 * Math.PI / 180
        window.value.rotation.y = -window.teta
        console.log(teta)
            //console.log(window.value.position.y)
        window.value.position.y -= i * Math.cos(window.teta)
        camera.position.y -= i * Math.cos(window.teta)
            //console.log(window.value.position.y)
        window.value.position.x -= i * Math.sin(window.teta)
        camera.position.x -= i * Math.sin(window.teta)
            //console.log(i)
        if (i < 5) {
            i += 0.01
        }


    }
}

function stopStraight(e) {

    //if (e.key == "Up" || e.key == "ArrowUp") {
    let j = 2

    function stopStraight() {
        if (j < 25) {
            //console.log(window.value.position.y)

            window.value.position.y -= 1 / j * Math.cos(window.teta)
            camera.position.y -= 1 / j * Math.cos(window.teta)
                //console.log(window.value.position.y)

            window.value.position.x -= 1 / j * Math.sin(window.teta)
            camera.position.x -= 1 / j * Math.sin(window.teta)
            j += 0.05
            if (i > 2) {
                i -= 0.03
            }
        } else {
            i = 2
            return
        }
        setTimeout(stopStraight, 0)
    }
    stopStraight()
        //}
}


var animate = function() {

    requestAnimationFrame(animate);
    //controls.update();

    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", stopStraight, false);

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
animate();