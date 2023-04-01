import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( .2, .2, .2 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

let insects = []
const INSECT_COUNT = 10;

for(let i = 0; i < INSECT_COUNT; i++)
{
	const insect = new THREE.Mesh( geometry, material );
	insect.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
	insects.push(insect);
	scene.add(insect);
}

function updateInsects()
{
	insects.forEach(insect => {
		insect.rotation.x += 0.01;
		insect.rotation.y += 0.01;
	});
}

camera.position.z = 5;

function animate()
{
	requestAnimationFrame( animate );

	updateInsects();

	renderer.render( scene, camera );
}

animate();