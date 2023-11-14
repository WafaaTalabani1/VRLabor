import * as THREE from 'three'
import { Lab } 	from './Lab.js'
import { Person } from './Person.js'

'use strict';
const FIELD_OF_VIEW = 70;
const NEAR_CLIPPING_PLANE = 0.001;
const FAR_CLIPPING_PLANE = 10000;
const HEMISPHERE_LIGHT_COLOR = 0x9999FF;
const HEMISPHERE_LIGHT_GROUND_COLOR = 0xFFFF99;
const HEMISPHERE_LIGHT_INTENSITY = 1;
const DIRECTIONAL_LIGHT_COLOR = 0xffffff;
const DIRECTIONAL_LIGHT_INTENSITY = 3;
const DIRECTIONAL_LIGHT_POSITION_Y = 2.7;

let container
let camera
let scene
let light
let directionalLight
let renderer
let lab
let person


init()
initObjects()
animate()



function initObjects(){
	lab = new Lab()
	lab.loadLab(onLabLoaded)
	person  = new Person()
}

function init(){
	console.log("hello world")
	container = document.getElementById("threeJS")
	
	 if (!container) {
        console.error('Could not find element with id "threeJS".');
        return;
    }

    initScene();
    initCamera();
    initLights();
    initRenderer();

	window.addEventListener('resize', onWindowResize)
	onWindowResize()

}
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAAAAFF);
}

function initCamera() {
    // Position the camera further away
    camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, window.innerWidth / window.innerHeight, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

    scene.add(camera);
}

function initLights() {
    light = new THREE.HemisphereLight(HEMISPHERE_LIGHT_COLOR, HEMISPHERE_LIGHT_GROUND_COLOR, HEMISPHERE_LIGHT_INTENSITY);
    scene.add(light);

    directionalLight = new THREE.DirectionalLight(DIRECTIONAL_LIGHT_COLOR, DIRECTIONAL_LIGHT_INTENSITY);
    directionalLight.position.y = DIRECTIONAL_LIGHT_POSITION_Y;

    // Enable shadow casting on the directional light
    directionalLight.castShadow = true;  
    scene.add(directionalLight);
}


function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true }); //antialiasing for smoother output
    renderer.setPixelRatio(window.devicePixelRatio); // For HiDPI devices to prevent bluring output canvas
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow mapping
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap; // the shadow type

    container.appendChild(renderer.domElement);
}


function onLabLoaded(){
	//scene.add(lab.getLab())
    let labModel = lab.getLab();
    // Enable shadow casting on the lab
    labModel.traverse(function(node) {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    scene.add(labModel);
}


function animate() {
    requestAnimationFrame(animate);
    person.animate();
    updateCameraPosition();
    render();
}

function updateCameraPosition() {
    camera.position.x -= person.dx / 100;
    camera.position.z -= person.dz / 100;
    camera.position.y = 1.6;
    camera.rotation.y = person.direction;
}

function render(){
	renderer.render(scene, camera)
}

function onWindowResize(){
	camera.aspect = window.innerWidth/window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}









