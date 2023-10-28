import * as THREE from 'three'
import { Lab } 	from './Lab.js'
import { Person } from './Person.js'

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
	
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xAAAAFF)

	camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.001, 10000)
	scene.add(camera)

	light = new THREE.HemisphereLight(0x9999FF, 0xFFFF99, 1)
	scene.add(light)

	directionalLight = new THREE.DirectionalLight(0xffffff,3)
	directionalLight.position.y = 2.7
	scene.add(directionalLight)

	renderer = new THREE.WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)

	// html body -> div container -> DOM (document object model) element of the renderer
	container.appendChild(renderer.domElement)

	window.addEventListener('resize', onWindowResize)
	onWindowResize()

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
	render()
}

function render(){
	renderer.render(scene, camera)
}

function onWindowResize(){
	camera.aspect = window.innerWidth/window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}









