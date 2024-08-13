import * as T from "three"
import gsap from "gsap";
import { OrbitControls, Reflector, TextGeometry, FontLoader } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';;
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { TextureLoader } from "three";
import { DRACOLoader } from 'three/examples/jsm/Addons.js';
import RajdHani from "./RajdHani.json"

const font2 = new FontLoader().parse(RajdHani)
const scene = new T.Scene();
const camera = new T.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
const loader = new GLTFLoader().setPath("./model/");
const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x555b68)
const draco = new DRACOLoader()
draco.setDecoderPath('/examples/jsm/libs/draco/');
loader.setDRACOLoader(draco)
let imgStateNum = 1;

const textGeometry2 = new TextGeometry('Design By Almubdieuntech.', {
  font: font2,
  size: 5,
  depth: 0.6,
});
textGeometry2.computeBoundingBox();
const textGeometry3 = new TextGeometry('VIRTUAL\nEXHIBITION.', {
  font: font2,
  size: 5,
  depth: 0.6,
});
textGeometry3.computeBoundingBox();
const textMat = new T.MeshStandardMaterial({ color: 0x754833 })
const textMesh = new T.Mesh(textGeometry2, textMat)
textMesh.position.set(-70, 4, -30)
textMesh.rotation.y = -1.55
const textMesh2 = new T.Mesh(textGeometry3, textMat)
textMesh2.position.set(-55, 45, 50)
scene.add(textMesh)
scene.add(textMesh2)

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// renderer.toneMapping = T.CineonToneMapping
// renderer.toneMappingExposure = 1.5
// renderer.outputColorSpace = T.SRGBColorSpace
renderer.domElement.classList.add("absolute")

var click = new Audio('Sounds/click.mp3');
var whoosh = new Audio("Sounds/whoosh.mp3")
var ding = new Audio("Sounds/ding.mp3")
const darkMaterial = new T.MeshBasicMaterial({ color: 'black' });
const materials = {};

camera.position.set(-120, 45, 70)

let elem = document.createElement('div');
elem.className = "flex absolute h-[100dvh] items-center justify-center md:left-[20%] md:right-[20%] left-0 right-0"
elem.id = "wrapper"
elem.innerHTML = `
    <div
      class="flex md:flex-row flex-col relative bg-[#1d1f39] z-[26] h-fit rounded-[20px] flex-wrap transition-all duration-300"
      id="popframe">
      <button
        class="text-[40px] text-white hover:text-violet-600" onclick="start()">
        Start</button>
    </div>
    `
document.getElementById("startSection").appendChild(elem)

document.addEventListener("DOMContentLoaded", () => {
  window.start = () => {
    // const textGeometry = new TextGeometry(event.target[0].value, {
    //   font: font2,
    //   size: 3,
    //   depth: 0.6,
    // });
    // textGeometry.computeBoundingBox();
    // const textMat2 = new T.MeshStandardMaterial({ color: 0xffff00 })
    // const textMesh2 = new T.Mesh(textGeometry, textMat2)
    // textMesh2.position.set(11, 14, 10)
    // textMesh2.rotation.y = 1.55
    // const textMesh3 = new T.Mesh(textGeometry, textMat2)
    // textMesh3.position.set(4, 68, 10)
    // textMesh3.rotation.y = 1.55

    // scene.add(textMesh2)
    // scene.add(textMesh3)
    document.querySelector("#startSection").classList.add("hidden")
    gsap.to(camera.position, {
      x: 0,
      y: 120,
      z: 240,
      duration: 6,
      ease: "expo.inOut",
      onStart: () => controls.enabled = false,
      onComplete: () => controls.enabled = true,
    },)
    gsap.to(controls.target, {
      x: 0,
      y: 13,
      z: 0,
      duration: 6,
      ease: "expo.inOut",
      onStart: () => controls.enabled = false,
      onComplete: () => controls.enabled = true,
      onUpdate: function () {
        controls.update()
      }
    })
    document.getElementById("canvasHolder").appendChild(renderer.domElement);
    click.play()
    whoosh.play()
    window.setTimeout(() => { ding.play() }, 1000)
    // window.setInterval(() => {
    //   scene.traverseVisible(obj => {
    //     if (obj.name == "rain") {
    //       gsap.to(obj.position, {
    //         y: 0,
    //         duration: 2,
    //         ease: "none",
    //       })
    //     }
    //   })
    //   scene.traverseVisible(obj => {
    //     if (obj.name == "rain") {
    //       const [y] = Array(1).fill().map(() => T.MathUtils.randFloatSpread(45))
    //       obj.position.y = 40 + y
    //     }
    //   })
    // }, 2005);
  }
})

let mixer, clock;
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

loader.load("Stand Design_GLTF.gltf", function (gltf) {
  var mesh = gltf.scene;
  mesh.scale.set(0.2, 0.2, 0.2);
  console.log(mesh);
  // reflector.position.y = 1
  mesh.position.set(0, 1, 0);
  mesh.traverse(obj => {
    if (obj.name == "polySurface3PIV") {
      new TextureLoader().load("./images/1w.png", function (texture) {
        texture.flipY = false;
        obj.material = new T.MeshStandardMaterial({ map: texture });
      })
    }
    if (obj.name == "MASH1_ReproMesh1Shape") {
      obj.layers.toggle(BLOOM_SCENE)
    }
    if (obj.name == "polySurface281PIV") {
      obj.layers.toggle(BLOOM_SCENE)
    }
  })
  mixer = new T.AnimationMixer(mesh);
  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });
  clock = new T.Clock()
  animate()
  scene.add(mesh)
  loading()
})

const geo = new T.BoxGeometry(0.4, 0.2, 0.4)
const mat = new T.MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0 })
const box = new T.Mesh(geo, mat)
box.position.set(16.4, 14.95, 16.4)
box.name = "next"
scene.add(box)
const box2 = new T.Mesh(geo, mat)
box2.position.set(12, 14.95, 18.73)
box2.name = "prev"
scene.add(box2)

const BLOOM_SCENE = 1;
const bloomLayer = new T.Layers();
bloomLayer.set(BLOOM_SCENE);

textMesh.layers.toggle(BLOOM_SCENE)
textMesh2.layers.toggle(BLOOM_SCENE)

const renderScene = new RenderPass(scene, camera);
const outputPass = new OutputPass();

const bloomPass = new UnrealBloomPass(new T.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 1
bloomPass.strength = 0.25
bloomPass.radius = 0.2

const bloomComposer = new EffectComposer(renderer);
bloomComposer.renderToScreen = false;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const mixPass = new ShaderPass(
  new T.ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: bloomComposer.renderTarget2.texture }
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
  }), 'baseTexture'
);
mixPass.needsSwap = true;

const finalComposer = new EffectComposer(renderer);
finalComposer.addPass(renderScene);
finalComposer.addPass(mixPass);
finalComposer.addPass(outputPass);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enablePan = true;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.35;
controls.minDistance = 0;
controls.maxDistance = 280;
controls.rotateSpeed = 0.5;
controls.update()
// const spl = new T.SpotLight(0xe1ceb2, 8000000, 530, Math.PI / 2 + 1.2, 0.4)
// spl.position.set(0, 450, 0)
// spl.target.position.set(0, 2, 0)
// scene.add(spl)
// const splH = new T.SpotLightHelper(spl)
// scene.add(splH)
const dl = new T.DirectionalLight(0xffffff, 4.5)
camera.add(dl)
scene.add(camera)
scene.add(new T.AmbientLight(0xffffff, 4))

const raycaster = new T.Raycaster()

window.addEventListener('pointerdown', onMouseDown)

function onMouseDown(event) {
  camera.updateProjectionMatrix()
  controls.update()
  const coords = new T.Vector2(
    (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
  )
  raycaster.setFromCamera(coords, camera)

  let intersections = raycaster.intersectObjects(scene.children, true);
  if (intersections.length > 0) {
    // intersections[0].object.layers.toggle(BLOOM_SCENE)
    console.log(intersections[0].object);
    if (intersections[0].object.name == "polySurface166PIV") {
      click.play()
      window.setTimeout(() => whoosh.play(), 2000)
      gsap.to(camera.position, {
        x: 100,
        y: 22,
        z: -33,
        duration: 6,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
      },)
      gsap.to(controls.target, {
        x: 0,
        y: 13,
        z: 0,
        duration: 6,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
        onUpdate: function () {
          controls.update()
        }
      })
    }
    if (intersections[0].object.name == "polySurface161PIV") {
      click.play()
      window.setTimeout(() => whoosh.play(), 2000)
      gsap.to(camera.position, {
        x: 0,
        y: 22,
        z: 240,
        duration: 6,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
      },)
      gsap.to(controls.target, {
        x: 0,
        y: 22,
        z: 0,
        duration: 6,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
        onUpdate: function () {
          controls.update()
        }
      })
    }
    if (intersections[0].object.name == "polySurface172PIV") {
      click.play()
      window.setTimeout(() => whoosh.play(), 2000)
      gsap.to(camera.position, {
        x: -1,
        y: 19,
        z: 7,
        duration: 6,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
      },)
      gsap.to(controls.target, {
        x: 2,
        y: 10,
        z: -4,
        duration: 6,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
        onUpdate: function () {
          controls.update()
        }
      })
    }
    if (intersections[0].object.name == "polySurface179PIV") {
      click.play()
      window.setTimeout(() => whoosh.play(), 2000)
      gsap.to(camera.position, {
        x: 15,
        y: 22.33,
        z: 21.25,
        duration: 6,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
      },)
      gsap.to(controls.target, {
        x: 12.8,
        y: 13.45,
        z: 16.9,
        duration: 6,
        ease: "expo.inOut",
        onStart: () => controls.enabled = false,
        onComplete: () => controls.enabled = true,
        onUpdate: function () {
          controls.update()
        }
      })
    }
    if (intersections[0].object.name == "polySurface7PIV") {
      document.getElementById("chat").classList.toggle("z-[45]")
      document.getElementById("chat").classList.toggle("absolute")
      document.getElementById("chat").classList.toggle("w-full")
      document.getElementById("chat").classList.toggle("h-full")
      document.getElementById("chat").classList.toggle("p-3")
      document.getElementById("chat").classList.toggle("hidden")
      document.getElementById("btn-close").classList.toggle("hidden")
      intersections[0].object.layers.toggle(BLOOM_SCENE)
    }
    if (intersections[0].object.name == "next") {
      scene.traverse(obj => {
        if (obj.name == "polySurface3PIV") {
          if (imgStateNum < 3) {
            imgStateNum++;
          }
          new TextureLoader().load(`./images/${imgStateNum}w.png`, function (texture) {
            texture.flipY = false;
            obj.material = new T.MeshStandardMaterial({ map: texture });
          })
        }
      })
    }
    if (intersections[0].object.name == "prev") {
      scene.traverse(obj => {
        if (obj.name == "polySurface3PIV") {
          if (imgStateNum > 1) {
            imgStateNum--;
          }
          new TextureLoader().load(`./images/${imgStateNum}w.png`, function (texture) {
            texture.flipY = false;
            obj.material = new T.MeshStandardMaterial({ map: texture });
          })
        }
      })
    }
  }
}

window.closeChat = () => {
  document.getElementById("chat").classList.toggle("z-[45]")
  document.getElementById("chat").classList.toggle("absolute")
  document.getElementById("chat").classList.toggle("w-full")
  document.getElementById("chat").classList.toggle("h-full")
  document.getElementById("chat").classList.toggle("p-3")
  document.getElementById("chat").classList.toggle("hidden")
  document.getElementById("btn-close").classList.toggle("hidden")
}

function darkenNonBloomed(obj) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}

document.getElementById("loadingScreen").classList.add("z-[20]");
document.getElementById("loadingScreen").innerHTML = `<img src="images/loading.gif" class="w-auto h-[200px]">`
function loading() {
  document.getElementById("loadingScreen").classList.add("hidden")
}

// function addStars() {
//   const geometry = new T.SphereGeometry(0.3, 0.3, 0.3);
//   const mat = new T.MeshStandardMaterial({ color: 0xffffff })
//   const starsMesh = new T.Mesh(geometry, mat)
//   starsMesh.name = "star1";

//   const [x, z] = Array(2).fill().map(() => T.MathUtils.randFloatSpread(450))
//   const [y] = Array(1).fill().map(() => T.MathUtils.randFloatSpread(200))

//   starsMesh.position.set(x, 200 + y, z);
//   scene.add(starsMesh);
// }

// Array(1000).fill().forEach(addStars)

// scene.traverseVisible(obj => {
//   if (obj.name == "star1") {
//     const [y] = Array(1).fill().map(() => T.MathUtils.randFloatSpread(200))
//     obj.position.y = 200 + y
//     setTimeout(() => {
//       // gsap.to(obj.position, {
//       //   y: 3,
//       //   duration: 6,
//       //   yoyo: true
//       // })
//     }, 100)
//   }
// })

function animate() {
  requestAnimationFrame(animate);
  mixer.update(clock.getDelta());
  // Define the rotation speed

  // Calculate the rotation angles for each axis
  // console.log(camera.position);


  // Apply the rotation to the cube
  // points.rotation.x = angle; // Rotate around X axis
  // points.rotation.z = angle;
  // console.log(camera.position);

  controls.update();

  scene.traverse(darkenNonBloomed);
  bloomComposer.render();
  scene.traverse(restoreMaterial);
  finalComposer.render();
  // renderer.render(scene, camera)
  // camera.updateProjectionMatrix()
}