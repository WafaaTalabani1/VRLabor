
class Person{
	
	constructor(){
		this.direction = 0.0

		this.ROTATE_LEFT = -1
		this.ROTATE_NONE = 0
		this.ROTATE_RIGHT = 1
		this.rotate = this.ROTATE_NONE
		this.rotationSpeed = 0.015


		this.speed = 1.0
		this.speedMax = 1.0


		this.WALKING_FORWARD = 1
		this.WALKING_BACKWARD = -1
		this.WALKING_NONE = 0
		this.walking = this.WALKING_NONE



		this.dx = 0
		this.dz = 0


		document.addEventListener('keydown', () => {
			console.log("keydown",event.keyCode)
			if( (event.keyCode == 87) || (event.keyCode == 38) ){
				this.walking = this.WALKING_FORWARD
			}else if((event.keyCode == 65) || (event.keyCode == 37) ){
				this.rotate = this.ROTATE_RIGHT
			}else if((event.keyCode == 83) || (event.keyCode == 40) ){
				this.walking = this.WALKING_BACKWARD
			}else if((event.keyCode == 68) || (event.keyCode == 39) ){
				this.rotate = this.ROTATE_LEFT
			}else if(event.keyCode == 81){
			}else if(event.keyCode == 69){
			}

		})

		document.addEventListener('keyup', () => {
			console.log("keyup")
			if( (event.keyCode == 87) || (event.keyCode == 38) ){
				this.walking = this.WALKING_NONE
			}else if((event.keyCode == 65) || (event.keyCode == 37) ){
				this.rotate = this.ROTATE_NONE
			}else if((event.keyCode == 83) || (event.keyCode == 40) ){
				this.walking = this.WALKING_NONE
			}else if((event.keyCode == 68) || (event.keyCode == 39) ){
				this.rotate = this.ROTATE_NONE
			}else if(event.keyCode == 81){
			}else if(event.keyCode == 69){
			}
		})

	}

	animate(){
		if(this.rotate == this.ROTATE_LEFT){
			this.direction -= this.rotationSpeed
		}else if(this.rotate == this.ROTATE_RIGHT){
			this.direction += this.rotationSpeed
		}

		if(this.walking == this.WALKING_FORWARD){
			this.speed = this.speedMax
			this.dx = Math.sin(this.direction) * this.speed
			this.dz = Math.cos(this.direction) * this.speed
		}else if(this.walking == this.WALKING_BACKWARD){
			this.speed = this.speedMax
			this.dx = Math.sin(this.direction) * this.speed *-1
			this.dz = Math.cos(this.direction) * this.speed *-1
		}else if(this.walking == this.WALKING_NONE){
			this.speed = 0
			this.dx = 0
			this.dz = 0
		}
	}



}

export { Person }