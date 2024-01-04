import * as THREE from 'three'
import {Lab} from './Lab.js'
import {Person} from './Person.js'
import Explorer from './Explorer.js'
import {OutlinePass} from '../lib/three.js-master/examples/jsm/postprocessing/OutlinePass.js'
import {EffectComposer} from '../lib/three.js-master/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from '../lib/three.js-master/examples/jsm/postprocessing/RenderPass.js';
import {Inventory} from './Inventory.js';

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
let explorer
let raycaster
let pointer
let composer
let outlinePass
let inventory


loadObjects()

function loadObjects(){

		init()
		initObjects()
		animate()

}

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
    explorer = new Explorer(scene, camera, renderer);
    raycaster = new THREE.Raycaster()
	pointer = new THREE.Vector2()
    	// html body -> div container -> DOM (document object model) element of the renderer
	container.appendChild(renderer.domElement)
    inventory = new Inventory();
    camera.add(inventory.group);
	document.addEventListener('mousemove', explorer.onMouseMove, false)
	document.addEventListener('mousedown', explorer.onMouseDown, false)
	window.addEventListener('keydown', (event) => {
		if (event.key === 'r') {
			explorer.returnToNormalView();
		}
	});
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
    camera.rotation.order = 'YXZ'; 
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // the shadow type

    container.appendChild(renderer.domElement);

    composer = new EffectComposer(renderer);

    let renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth,window.innerHeight), scene, camera);
    outlinePass.edgeStrength = 6;
    outlinePass.edgeGlow = 0;
    outlinePass.edgeThickness = 1;
    outlinePass.pulsePeriod = 3;
    outlinePass.visibleEdgeColor.set('#FF5733');
    outlinePass.hiddenEdgeColor.set('#33FF57');

    outlinePass.enabled = true;

    composer.addPass(outlinePass);


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
    explorer.updateRaycasterAndCheckIntersect();
    if(lab.getLab()){
        lab.getLab().traverse((child)=>{
            if(child.userData.isAnimate){
                if(child.userData.zTo){
                    child.position.z += (child.userData.zTo - child.position.z) * 0.1
                }
            }
        })
    }
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


function deselectObjects(){
	outlinePass.selectedObjects = []
}



function raycast(isMouseDown){
	raycaster.setFromCamera(pointer, camera)
}
  

function onWindowResize(){
	camera.aspect = window.innerWidth/window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)

}









