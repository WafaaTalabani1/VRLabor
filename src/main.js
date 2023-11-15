import * as THREE 			from 'three'
import { Lab } 				from './Lab.js'
import { Person } 			from './Person.js'
import { Startscreen } 		from './Startscreen.js'
import { JSONLoader }		from './JSONLoader.js'
import { Inventory }		from './Inventory.js'
import { OutlinePass } from '../lib/three.js-master/examples/jsm/postprocessing/OutlinePass.js';
import { EffectComposer } from '../lib/three.js-master/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../lib/three.js-master/examples/jsm/postprocessing/RenderPass.js';


let container
let camera
let scene
let light
let directionalLight
let renderer
let lab
let person

let raycaster
let pointer

let startscreen

let composer
let outlinePass

let inventory

let highlightedObject


loadObjects()



function loadObjects(){
	let jsonLoader = new JSONLoader()
	jsonLoader.loadJSON('json/objects.json', function(data){
		console.log("json",data.objects)
		init()
		initObjects(data.objects)
		animate()
	},function(xhr){
		console.error(xhr)
	}

	)
}

function init(){
	console.log("hello world")

	startscreen = new Startscreen()

	container = document.getElementById("startscreen")
	
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xFFFFFF); // Setzt die Hintergrundfarbe auf Weiß

	camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.001, 10000)
	scene.add(camera)

	light = new THREE.HemisphereLight(0x9999FF, 0xFFFF99, 1)
	scene.add(light)

	directionalLight = new THREE.DirectionalLight(0xffffff,3)
	directionalLight.position.y = 2.7
	scene.add(directionalLight)

	raycaster = new THREE.Raycaster()
	pointer = new THREE.Vector2()

	renderer = new THREE.WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)

	// html body -> div container -> DOM (document object model) element of the renderer
	container.appendChild(renderer.domElement)


	composer = new EffectComposer(renderer)

	let renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth,window.innerHeight), scene, camera)
	outlinePass.edgeStrength = 6
	outlinePass.edgeGlow = 0
	outlinePass.edgeThickness = 1
	outlinePass.pulsePeriod = 3
	outlinePass.visibleEdgeColor.set('#FF5733')
	outlinePass.hiddenEdgeColor.set('#33FF57')

	outlinePass.enabled = true

	composer.addPass(outlinePass)

	//inventory = new Inventory()
	//camera.add(inventory.group)

	document.addEventListener('startscreenEvent',onStart)

	window.addEventListener('resize', onWindowResize)
	onWindowResize()

}



function onStart(event){
	console.log("object",event)
	document.addEventListener('mousemove', mouseMove, false)
	document.addEventListener('mousedown', mouseDown, false)
}



function mouseMove(event){
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycast(false)
}



function mouseDown(event){
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
	raycast(true)
}



function initObjects(jsonObjects){
	lab = new Lab(jsonObjects)
	lab.loadLab(onLabLoaded)
	person = new Person()
}


function onLabLoaded(){
	scene.add(lab.getLab())
}



function animate(){
	requestAnimationFrame(animate)
	person.animate()

	camera.position.x -= person.dx/100
	camera.position.z -= person.dz/100

	camera.position.y = 1.6

	camera.rotation.y = person.direction

	if(lab.getLab()){
		lab.getLab().traverse((child)=>{
			if(child.userData.isAnimate){
				if(child.userData.zTo){
					child.position.z += (child.userData.zTo - child.position.z) * 0.1
				}
			}
		})
	}

	render()
}



function render(){
	renderer.render(scene, camera)
}




function deselectObjects(){
	let selectedObjects = []
	outlinePass.selectedObjects = selectedObjects
}



function raycast(isMouseDown){

	raycaster.setFromCamera(pointer, camera)

	//let intersects = raycaster.intersectObjects(lab.getLab().children)
	if(lab.getLab()){
		let intersects = raycaster.intersectObjects(lab.objectsToPick)
		let i=0
		intersects.forEach((intersect)=>{
			if(!isMouseDown && i==0){
				//highlight object
				let object = intersect.object
				if(highlightedObject != object){
					//unhighlight object
					deselectObjects()
				}

				if(object.userData.json){
					if(object.userData.json.isExcludedFromPicking){
						console.log(object.name)
					}else{
						console.log("pick",object.name)
						let selectedObjects = []
						
						if(object.name == "drawer_1"){
							object = object.parent.parent
						}
						selectedObjects.push(object)
						outlinePass.selectedObjects = selectedObjects
						highlightedObject = object
					}

				}
			}

			if(isMouseDown && i==0){
				let object = intersect.object
				//console.log(intersect.object)
				if(object.userData.json && object.userData.json.isPickable){
					console.log("pickable")
					if(!object.userData.isInventory){
						lab.getLab().remove(object)
						inventory.addItem(object)
						deselectObjects()
					
					}else{
						inventory.removeItem(object)
						lab.getLab().add(object)
						deselectObjects()
					
					}

				}

				if( (object.name=="drawer_1") ||
					(object.name=="drawer_2") ||
					(object.name=="drawer_3")) {

					if(object.parent.userData.isOpen){
						//object.parent.position.z = -0.174
						object.parent.userData.isAnimate = true
						object.parent.userData.zTo = -0.174
						object.parent.userData.isOpen = false
					}else{
						//object.parent.position.z = -0.6
						object.parent.userData.isAnimate = true
						object.parent.userData.zTo = -0.6
						object.parent.userData.isOpen = true
					}

				}
			}
			i++
		})
	}
	
}
  
  

function onWindowResize(){
	camera.aspect = window.innerWidth/window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	startscreen.resize(window.innerWidth, window.innerHeight)
}









