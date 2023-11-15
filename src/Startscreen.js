class Startscreen{
	
	constructor(){
		this.startscreenImage = document.getElementById("startscreenImage")

		this.startscreenImage.addEventListener("click",(event)=>{
			this.startscreenImage.classList.add("fade-out")

			let startscreenEvent = new CustomEvent("startscreenEvent",{
				detail:{
					name:"startscreenEvent"
				}
			})
			document.dispatchEvent(startscreenEvent)
		})
	}

	resize(width,height){
		let imageRatio = 2000/1250
		let imageScale = 0.95

		let imageWidth = width * imageScale
		let imageHeight = imageWidth / imageRatio

		let windowRatio = width/height
		if(windowRatio>1.6){
			imageHeight = height * imageScale
			imageWidth = height * 1.6
		}

		let imageLeft = (width - imageWidth)/2
		let imageTop = (height - imageHeight)/2

		this.startscreenImage.style.width = imageWidth + "px"
		this.startscreenImage.style.height = imageHeight + "px"
		this.startscreenImage.style.left = imageLeft + "px"
		this.startscreenImage.style.top = imageTop + "px"

	}

}
export { Startscreen }