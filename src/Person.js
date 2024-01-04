

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const ARROW_UP = 38;
const ARROW_LEFT = 37;
const ARROW_DOWN = 40;
const ARROW_RIGHT = 39;

const keyMappings = {
	[KEY_W]: 'WALKING_FORWARD',
	[ARROW_UP]: 'WALKING_FORWARD',
	[KEY_A]: 'ROTATE_RIGHT',
	[ARROW_LEFT]: 'ROTATE_RIGHT',
	[KEY_S]: 'WALKING_BACKWARD',
	[ARROW_DOWN]: 'WALKING_BACKWARD',
	[KEY_D]: 'ROTATE_LEFT',
	[ARROW_RIGHT]: 'ROTATE_LEFT'
	
};


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
		this.handleKey = this.handleKey.bind(this); // Bindung von `this` an die Funktion

        document.addEventListener('keydown', event => this.handleKey(event, true));
        document.addEventListener('keyup', event => this.handleKey(event, false));
    }

    handleKey(event, isKeyDown) {
        console.log(isKeyDown ? "keydown" : "keyup", event.keyCode);

        if (keyMappings[event.keyCode]) {
            if (keyMappings[event.keyCode].startsWith('WALKING')) {
                this.walking = isKeyDown ? this[keyMappings[event.keyCode]] : this.WALKING_NONE;
            } else if (keyMappings[event.keyCode].startsWith('ROTATE')) {
                this.rotate = isKeyDown ? this[keyMappings[event.keyCode]] : this.ROTATE_NONE;
            }
        }

	}

	animate(){
		if(this.rotate === this.ROTATE_LEFT){
			this.direction -= this.rotationSpeed
		}else if(this.rotate === this.ROTATE_RIGHT){
			this.direction += this.rotationSpeed
		}
		if(this.walking === this.WALKING_FORWARD){
			this.speed = this.speedMax
			this.dx = Math.sin(this.direction) * this.speed
			this.dz = Math.cos(this.direction) * this.speed
		}else if(this.walking === this.WALKING_BACKWARD){
			this.speed = this.speedMax
			this.dx = Math.sin(this.direction) * this.speed *-1
			this.dz = Math.cos(this.direction) * this.speed *-1
		}else if(this.walking === this.WALKING_NONE){
			this.speed = 0
			this.dx = 0
			this.dz = 0
		}
	}
}

export { Person }