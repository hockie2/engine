import * as THREE from 'three';
		import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
		import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

		let camera, scene, renderer, controls;
		let model;
		const cameraCoordinates = document.getElementById('camera-coordinates');

		init();
		animate();

		function init() {
			camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
			camera.position.set(12, 2, 1);

			scene = new THREE.Scene();
			scene.background = new THREE.Color(0xD3D3D3);

			// Load GLB model
            const loader = new GLTFLoader();
            loader.load('jsm/objects/engine.glb', function (gltf) {
                model = gltf.scene;
                scene.add(model);
                model.position.set(0, 0, 0);
            }, undefined, function (error) {
                console.error('Error loading GLB file:', error);
            });

        
			// Three-point lighting setup
			const keyLight = new THREE.DirectionalLight(0xffffff, 1);
			keyLight.position.set(5, 5, 5);
			scene.add(keyLight);

			const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
			fillLight.position.set(-5, 2, 5);
			scene.add(fillLight);

			const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
			backLight.position.set(0, 5, -5);
			scene.add(backLight);

			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			document.getElementById('rightCol').appendChild(renderer.domElement); // Append the canvas to the rightCol

			window.addEventListener('resize', onWindowResize);

			controls = new OrbitControls(camera, renderer.domElement);
			controls.enableDamping = true;
			controls.autoRotate = false;
			controls.minDistance = 0;
			controls.maxDistance = 500;
			controls.update();
		}

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
			// updateCameraCoordinates();
		}

		// function updateCameraCoordinates() {
		// 	cameraCoordinates.innerText = `Camera: X: ${camera.position.x.toFixed(2)}, Y: ${camera.position.y.toFixed(2)}, Z: ${camera.position.z.toFixed(2)}`;
		// }





        // jQuery to change button color, text, and material of part based on the button ID
        $(document).ready(function () {
            console.log("Document loaded");

            $(".btn").click(function () {
                const buttonId = $(this).attr('id'); // Get the ID of the clicked button
                const part = model.getObjectByName(buttonId); // Find the part by the button's ID

                if ($(this).hasClass("btn-danger")) {
                    // If the button is in the "Incomplete" state
                    $(this).removeClass("btn-danger").addClass("btn-success");
                    $(this).html("Completed!");

                    // Change the part material to green
                    if (part) {
                        part.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green color
                    }
                } else if ($(this).hasClass("btn-success")) {
                    // If the button is in the "Completed" state
                    $(this).removeClass("btn-success").addClass("btn-danger");
                    $(this).html("Incomplete");

                    // Reset the part material to red (or any other color)
                    if (part) {
                        part.material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color
                    }
                }
            });
        });


