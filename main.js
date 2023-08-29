import "./style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const outputDiv = document.getElementById("porsche");
const sectionTwo = document.getElementById("secitonTwo");
const sectionTwoHO = document.getElementById("st-one");
const secitonThree = document.getElementById("secitonThree");
var ModelRef = null;
var secOneAnimationComplete = false;
var secTwoAnimationStarted = false;
let textLoaded = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, 	// alpha: true 
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.insertBefore(renderer.domElement, document.body.firstChild);

camera.position.z = 4; camera.position.y = 1; camera.position.x = -12;

const carOne = new GLTFLoader().setPath("../free_1975_porsche_911_930_turbo/");

carOne.load(
  "scene.gltf",
  function (gltf) {
    scene.add(gltf.scene);
    setModel(gltf.scene);
    renderer.render(scene, camera);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.log("An error happened car one");
  }
);

function setModel(param_model) {
  ModelRef = param_model;
  ModelRef.rotation.y -= 1.5;
}

const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

const light_2 = new THREE.DirectionalLight(0xFFFFFF,1);
light_2.position.set(0, 10, 0)
light_2.intensity = 3
light_2.castShadow = true;
scene.add(light_2)


function animate() {
  if(camera.position.x < 9) {
    requestAnimationFrame(animate);
  } else {
    secOneAnimationComplete = true;
    sectionTwo.classList.remove("hide")
  }
  if (camera.position.x > 3 && !textLoaded) {
    textLoaded = true;
    appendTextWithDelay();
    setTimeout(() => {
      scrollToTop();
      enableScroll();
    }, 1500);
  }
  camera.position.x += 0.05;
  renderer.render(scene, camera);
}

window.addEventListener("scroll", (event) => {
  var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  if(secOneAnimationComplete && !secTwoAnimationStarted){
  secTwoAnimationStarted = true;
  outputDiv.classList.add("zero-opacity");
  disableScroll();
  setTimeout(() => {enableScroll()},100)
}

if(scrollPosition > 950)
   animateSecTwo();
});

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
}


function disableScroll() {
  document.body.classList.add('no-scroll');
}

function enableScroll() {
  document.body.classList.remove('no-scroll');
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
  });
}

async function appendTextWithDelay() {
  for (const char of 'porsche') {
      outputDiv.textContent += char;
      await new Promise(resolve => setTimeout(resolve, 200));
  }
}

function animateSecTwo() {
  disableScroll();
  sectionTwoHO.classList.add("st-1-e");
  setTimeout(() => {
    sectionTwoHO.textContent = 'Priceless'
    sectionTwoHO.classList.remove("st-1-e")
  },2000)


  setTimeout(() => {
    sectionTwoHO.classList.add("st-1-e")
  },4000)
    setTimeout(() => {
      sectionTwoHO.textContent = 'Limitless'
      sectionTwoHO.classList.add("font-250")
      sectionTwoHO.classList.remove("st-1-e")
    },6000)
  setTimeout(() => {  sectionTwoHO.classList.add("st-1-e");
},8000)
  setTimeout(() => {driveCarSet()
  sectionTwo.classList.add("hide")
  },10000)

}

function driveCarSet() {
  ModelRef.rotation.y = 0;
  camera.position.x = 0;
  camera.position.y = 0.6;
  camera.position.z = 60;  
  renderer.render(scene, camera);
  disableScroll();
  driveCar();
}


var carDriven = false;
function driveCar() {
  if(camera.position.z > -5 && !carDriven){ 
    camera.position.z -= 0.3;
    renderer.render(scene, camera);
  requestAnimationFrame(driveCar)
}  else {
    carDriven = true;
    console.log(ModelRef)
    ModelRef.visible = false;
    enableScroll();
    secitonThree.classList.remove("hide")
    finalAnimation();
  }
}

function finalAnimation() {
  ModelRef.rotation.y = 1;
  camera.position.x = 0;
  camera.position.y = 0.6;
  camera.position.z = 20; 
  ModelRef.visible = true;
  renderer.render(scene,camera)
  finalAnimationCar();
}

var moveDir = 'left';
function finalAnimationCar() {
  if(moveDir == 'left')
  moveCarLeft();
  else
  moveCarRight();

  renderer.render(scene,camera);
}

function moveCarLeft() {
  moveDir = 'left';
  if(camera.position.x > 8)
  moveDir = 'right'

  camera.position.x += 0.04;
  ModelRef.rotation.y += 0.01;

  renderer.render(scene,camera);

  if(moveDir == 'left')
  requestAnimationFrame(moveCarLeft)
  else
  moveCarRight();
}

function moveCarRight() {
  moveDir = 'right';
  if(camera.position.x < -8)
  moveDir = 'left'

  camera.position.x -= 0.04;
  ModelRef.rotation.y -= 0.04;

  renderer.render(scene,camera);

  if(moveDir == 'right')
  requestAnimationFrame(moveCarRight)
  else
  moveCarLeft();
}

scrollToTop();
disableScroll();
animate();
