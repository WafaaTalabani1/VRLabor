import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

class Lab {

	constructor(){

		this.lab
		this.objectsToPick = []
		console.log("creating Lab object")
	}

	loadLab(callback){
		let loader = new GLTFLoader().setPath('./assets/models/')
		loader.load('lab.glb', (gltf) => {
			//callback function that gets called when the model is loaded
			this.lab = gltf.scene
			this.lab.name = "Lab"

			this.lab.traverse((child)=>{
				this.objectsToPick.push(child)
				console.log(child.name)


				if(child.name == "walls"){
					console.log("walls",child)
					child.material.side = THREE.DoubleSide
				}

				if(child.name == "parent_drawer"){
				console.log("drawer",child)
			 	child.children.forEach((drawerChild)=>{
			 		this.objectsToPick.push(drawerChild)
			 	})
				 }

			})
			console.log("model loaded", this.lab)

			callback()

		})
	}

	getLab(){
		return this.lab
	}

}

export { Lab }



