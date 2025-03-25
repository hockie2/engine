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
			
				model.traverse(function (child) {
					if (child.isMesh) {
						child.castShadow = true; // Allows object to cast shadows
						child.receiveShadow = true; // Allows object to receive shadows
					}
				});
			}, undefined, function (error) {
				console.error('Error loading GLB file:', error);
			});
			

        
			// Three-point lighting setup
			const keyLight = new THREE.DirectionalLight(0xffffff, 3);
			keyLight.position.set(5, 10, 5);
			keyLight.castShadow = true;
			keyLight.shadow.mapSize.width = 4096;
			keyLight.shadow.mapSize.height = 4096;
			keyLight.shadow.camera.left = -20;
			keyLight.shadow.camera.right = 20;
			keyLight.shadow.camera.top = 20;
			keyLight.shadow.camera.bottom = -20;
			keyLight.shadow.camera.near = 1;
			keyLight.shadow.camera.far = 100;
			keyLight.shadow.radius = 6; // Higher value = softer shadow edges
			scene.add(keyLight);

			const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
			fillLight.position.set(-5, 2, 5);
			scene.add(fillLight);

			const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
			backLight.position.set(0, 5, -5);
			scene.add(backLight);

			const bottomAmbientLight = new THREE.AmbientLight(0xaaaaaa, 0.7); // Soft neutral light
			scene.add(bottomAmbientLight);

			
			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
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
		const originalMaterials = new Map(); // Store original materials

		$(document).ready(function () {
			$(".btn").click(function () {
				const buttonId = $(this).attr("id");
				const part = model.getObjectByName(buttonId);

				if (part && !originalMaterials.has(buttonId)) {
					originalMaterials.set(buttonId, part.material); // Store original material once
				}

				const isCompleted = $(this).hasClass("btn-success");

				$(this)
					.toggleClass("btn-danger btn-success")
					.html(isCompleted ? "Incomplete" : "Completed!");

				if (part) {
					part.material = isCompleted
						? originalMaterials.get(buttonId) // Restore original material
						: new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green color
				}
			});
		});
