import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

class Lab {

	constructor(jsonObjects){
		this.jsonObjects = jsonObjects
		this.lab
		this.objectsToPick = []
		console.log("creating Lab object")
	}

	loadLab(callback){
		let loader = new GLTFLoader().setPath('./assets/models/')
		loader.load('chemical_synthesis_laboratory.glb', (gltf) => {
			//callback function that gets called when the model is loaded
			this.lab = gltf.scene
			this.lab.name = "Lab"
			console.log("model loaded", this.lab)

			callback()

		})
	}

	getLab(){
		return this.lab
	}

}

export { Lab }



