import * as THREE from 'three';

class Explorer {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersectedObject = null;
        this.selectedObject = null;
        this.isDragging = false;
        this.draggingMode = null; // 'rotate', 'move', or 'none'
        this.previousMousePosition = {x: 0, y: 0};
        this.rotationSpeed = 0.01;
        this.originalCameraPosition = camera.position.clone();
        this.originalCameraQuaternion = camera.quaternion.clone();
        // Binding methods
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);

        // Adding event listeners
        window.addEventListener('mousemove', this.onMouseMove, false);
        window.addEventListener('click', this.onMouseClick, false);
        window.addEventListener('mousedown', this.onMouseDown, false);
        window.addEventListener('mouseup', this.onMouseUp, false);
        window.addEventListener('dblclick', this.onDoubleClick, false);
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        this.updateRaycaster();

        if (this.isDragging) {
            let deltaX = event.clientX - this.previousMousePosition.x;
            let deltaY = event.clientY - this.previousMousePosition.y;

            if (this.draggingMode === 'rotate') {
                this.applyRotation(deltaX, deltaY);
            } else if (this.draggingMode === 'move' && this.selectedObject) {
                // Create a plane parallel to the floor
                let planeNormal = new THREE.Vector3(0, 1, 0); // Assuming Y is up
                let plane = new THREE.Plane(planeNormal, 0);

                // Calculate where the ray intersects the plane
                let ray = this.raycaster.ray;
                let intersectPoint = new THREE.Vector3();
                ray.intersectPlane(plane, intersectPoint);

                // Move the selected object to the intersection point
                // You might want to adjust this logic based on how you want the object to follow the mouse
                this.selectedObject.position.x = intersectPoint.x;
                this.selectedObject.position.z = intersectPoint.z;
            }

            this.previousMousePosition = {x: event.clientX, y: event.clientY};
        } else {
            this.checkIntersect(event.clientX, event.clientY);
        }
    }
    openFridgeDoor(fridgeDoor, openAngle, duration) {
        let startRotation = fridgeDoor.rotation.y;
        let endRotation = startRotation + openAngle;
        let elapsedTime = 0;

        function animateDoor() {
            requestAnimationFrame(animateDoor);

            elapsedTime += 0.01; // Zeitdelta berechnen für gleichmäßigere Animation
            let currentAngle = THREE.MathUtils.lerp(startRotation, endRotation, elapsedTime / duration);

            fridgeDoor.rotation.y = currentAngle;

            if (elapsedTime >= duration) {
                fridgeDoor.rotation.y = endRotation; // Stellen Sie sicher, dass die Tür vollständig geöffnet ist
                return; // Beenden der Animation
            }
        }

        animateDoor();
    }



    onMouseClick(event) {
        this.updateRaycaster();
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            let selected = intersects[0].object;
            console.log("Clicked on: ", selected.name);

            let selectedObjects = [];

            if (selected.name === 'microscope') {
                this.viewThroughMicroscope(selected);
            } else if (selected.name === 'fridge_door') {
                this.openFridgeDoor(selected, Math.PI / 2, 2); // Öffnungswinkel und Dauer anpassen
            } else if (selected.name === "drawer_1" || selected.name === "drawer_2" || selected.name === "drawer_3") {
                this.handleDrawerInteraction(selected);

                selectedObjects.push(selected.parent.parent);
            }
            this.selectedObjects = selectedObjects;
        }
    }

    handleDrawerInteraction(drawer) {
        if(drawer.parent.userData.isOpen){
            drawer.parent.userData.isAnimate = true;
            drawer.parent.userData.zTo = -0.174;
            drawer.parent.userData.isOpen = false;
        }else{
            drawer.parent.userData.isAnimate = true;
            drawer.parent.userData.zTo = -0.6;
            drawer.parent.userData.isOpen = true;
        }
    }

    viewThroughMicroscope(microscope) {
        let newPosition = new THREE.Vector3();
        newPosition.copy(microscope.position);
        newPosition.y += 5;


        let lookAtPosition = new THREE.Vector3();
        lookAtPosition.copy(microscope.position);
        lookAtPosition.y -= 5;
        // Kamera auf die neue Position setzen
        this.camera.position.copy(newPosition);

        // Kamera auf den gewünschten Punkt ausrichten
        this.camera.lookAt(lookAtPosition);
    }


    returnToNormalView() {
        // Zurücksetzen der Kameraposition und -ausrichtung auf die ursprünglichen Werte
        this.camera.position.copy(this.originalCameraPosition);
        this.camera.quaternion.copy(this.originalCameraQuaternion);
    }


    //double click to move object chair
    onDoubleClick(event) {
        this.updateRaycaster(event);
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            let selected = intersects[0].object;

            // Check if the clicked object is already selected
            if (this.selectedObject === selected) {
                // If already selected, deselect it
                this.selectedObject = null;
                this.draggingMode = null;
                console.log("Chair deselected");
            } else if (selected.name === 'chair_workstation' || selected.name === 'chair_hood' ) {
                // If it's a different chair, select it
                selected.position.set(0, 0, 0);
                this.selectedObject = selected;
                this.draggingMode = 'move';
                console.log("Chair selected");
            }

            else if (selected.name === 'ethanol_spray') {
                console.log("Position von ethanol_spray: ", selected.position);
                this.selectedObject = selected;
                this.draggingMode = 'move';
                console.log("ehtanol Spray selected");
            }

        } else {
            // If clicked on empty space, maintain the current selection
        }
    }


    onMouseDown(event) {
        if (this.selectedObject) {
            this.isDragging = true; // Start dragging for object movement
            this.draggingMode = 'move';
        } else {
            this.isDragging = true; // Start dragging for 360 rotation
            this.draggingMode = 'rotate';
        }
        this.previousMousePosition = {x: event.clientX, y: event.clientY};
    }


    onMouseUp(event) {
        this.isDragging = false;
        this.draggingMode = null;
    }


    updateRaycaster() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
    }

    updateRaycasterAndCheckIntersect() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.checkIntersect();
    }


    checkIntersect(mouseX, mouseY) {
        let intersects = this.raycaster.intersectObjects(this.scene.children, true);
        let nameDisplay = document.getElementById('object-name');
        if (intersects.length > 0) {
            let intersected = intersects[0].object;
            if (this.intersectedObject !== intersected) {
                this.intersectedObject = intersected;
                if (nameDisplay && intersected.name) {
                    nameDisplay.innerText = intersected.name;
                    nameDisplay.style.display = 'block';
                    nameDisplay.style.left = `${mouseX + 10}px`;
                    nameDisplay.style.top = `${mouseY + 10}px`;
                }
            }
        } else {
            if (nameDisplay) {
                nameDisplay.style.display = 'none';
            }
            this.intersectedObject = null;
        }
    }

    displayObjectName(intersectedObject, mouseX, mouseY) {
        let nameDisplay = document.getElementById('object-name');
        if (nameDisplay && intersectedObject.name) {
            nameDisplay.innerText = intersectedObject.name;
            nameDisplay.style.display = 'block';
            nameDisplay.style.left = (mouseX + 10) + 'px'; // Offset to the right of the cursor
            nameDisplay.style.top = (mouseY + 10) + 'px'; // Offset below the cursor
        }
    }

    hideObjectName() {
        let nameDisplay = document.getElementById('object-name');
        if (nameDisplay) {
            nameDisplay.style.display = 'none';
        }
    }

    applyRotation(deltaX, deltaY) {
        // Adjust rotation sensitivity as needed
        let rotationChangeY = deltaX * this.rotationSpeed;
        let rotationChangeX = deltaY * this.rotationSpeed;

        // Apply yaw (Y-axis rotation) - unrestricted
        this.camera.rotation.y += rotationChangeY;

        // Apply pitch (X-axis rotation) - restricted to 180 degrees
        let newRotationX = this.camera.rotation.x + rotationChangeX;
        newRotationX = Math.max(Math.min(newRotationX, Math.PI / 2), -Math.PI / 2); // Clamp to 180 degrees

        // Set the new rotation X
        this.camera.rotation.x = newRotationX;
    }

    // Additional methods as necessary
}

export default Explorer;
