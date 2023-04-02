import * as THREE from 'three';

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 1000;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let insects = []
const INSECT_COUNT = 100;

for (let i = 0; i < INSECT_COUNT; i++)
{
	let insectGeometry = new THREE.TetrahedronGeometry(5, 0);
	let insectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
	let insect = new THREE.Mesh(insectGeometry, insectMaterial);
	insect.position.set(Math.random() * window.innerWidth - window.innerWidth / 2, Math.random() * window.innerHeight - window.innerHeight / 2, Math.random());
	insect.velocity = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
	insects.push(insect);
	scene.add(insect);
}

// Create a goal for the insects to fly towards
let goalGeometry = new THREE.BoxGeometry(20, 20, 20);
let goalMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let goal = new THREE.Mesh(goalGeometry, goalMaterial);
goal.position.set(0, 0, 0);
scene.add(goal);

// Apply the separation rule (Move away from neighbors)
function separation(insect, insects)
{
  let separationDistance = 80;
  let separationVector = new THREE.Vector3();
  let insectPosition = insect.position.clone();

  for (let i = 0, il = insects.length; i < il; i++)
  {
    let otherinsect = insects[i];

    if (otherinsect !== insect)
	{
      let otherinsectPosition = otherinsect.position.clone();

      if (insectPosition.distanceTo(otherinsectPosition) < separationDistance)
	  {
        separationVector.normalize();
        insect.velocity.add(separationVector);
      }
    }
  }
}

// Apply the alignment rule (Fly in the same direction)
function alignment(insect, insects)
{
  let alignmentDistance = 20;
  let alignmentVector = new THREE.Vector3();
  let neighborCount = 0;
  let insectPosition = insect.position.clone();

  for (let i = 0; i < insects.length; i++)
  {
    let otherinsect = insects[i];

    if (otherinsect !== insect)
	{
      let otherinsectPosition = otherinsect.position.clone();

      if (insectPosition.distanceTo(otherinsectPosition) < alignmentDistance)
	  {
        alignmentVector.add(otherinsect.velocity);
        neighborCount++;
      }
    }
  }

  if (neighborCount > 0)
  {
	alignmentVector.normalize();
    insect.velocity.add(alignmentVector);
  }
}

// Apply the cohesion rule (Move closer to neighbors)
function cohesion(insect, insects)
{
  let cohesionDistance = 10;
  let cohesionVector = new THREE.Vector3();
  let neighborCount = 0;
  let insectPosition = insect.position.clone();

  for (let i = 0; i < insects.length; i++)
  {
    let otherinsect = insects[i];

    if (otherinsect !== insect)
	{
      let otherinsectPosition = otherinsect.position.clone();

      if (insectPosition.distanceTo(otherinsectPosition) < cohesionDistance)
	  {
        cohesionVector.add(otherinsectPosition);
        neighborCount++;
      }
    }
  }

  if (neighborCount > 0)
  {
	cohesionVector.normalize();
    cohesionVector.sub(insectPosition);
    insect.velocity.add(cohesionVector);
  }
}

// Apply some randomness to movement to make them fly more insect-like
function applyRandomMovement(insect) {
	let rand = new THREE.Vector3(Math.random(), Math.random(), Math.random()).subScalar(0.5).multiplyScalar(0.2);
	insect.velocity.add(rand);
}

function updateInsects() 
{
	insects.forEach((insect, index) => {
		// Make the insect look at the goal
		insect.lookAt(0, 0, 0);

		let insectsLeft = insects.slice(0);
		insectsLeft.splice(index, 1);
		
		applyRandomMovement(insect);
		separation(insect, insectsLeft);
		alignment(insect, insectsLeft);
		cohesion(insect, insectsLeft);
		
		// Limit the insect's velocity
		let maxVelocity = 5;

		if (insect.velocity.length() > maxVelocity)
		{
		  insect.velocity.normalize();
		}
  
		// Update the insect's position
		insect.position.add(insect.velocity);

	  });
}

// Render the scene
function animate()
{
	requestAnimationFrame(animate);
	updateInsects();
	renderer.render(scene, camera);
}

animate();
