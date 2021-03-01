// Déclaration pour THREE
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
let scene, camera, renderer, cube, geometry, material


init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    //Add Light
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    var pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    scene.add(pointLight);

    //Add the floor
    geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    material = new THREE.MeshBasicMaterial({
        color: 0x0000ff
    });
    /*var material = new THREE.MeshStandardMaterial({
      color: 0xff0051
    })*/
    var floor = new THREE.Mesh(geometry, material);
    floor.material.side = THREE.DoubleSide;
    scene.add(floor);

    //Add the car


    camera.position.z = 5
    camera.rotation.x = 0.5


}


animate = () => {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)

}

onWindowSize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowSize, false)
init()
animate()