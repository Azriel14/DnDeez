import * as THREE from "three";

const activeDiceScenes = [];

function createPentagonalTrapezohedron() {
  const vertices = [
    0, 1, 0, 1, 0, 0, 0.3, 0, 1, -0.8, 0, 0.6, -0.8, 0, -0.6, 0.3, 0, -1, 0,
    -0.8, 0,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 1, 6, 2, 1, 6, 3, 2, 6, 4, 3, 6,
    5, 4, 6, 1, 5,
  ];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function createDiceCanvas(dieType = 6) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(200, 200);
  renderer.setClearColor(0x000000, 0);

  let geometry;
  switch (dieType) {
    case 4:
      geometry = new THREE.TetrahedronGeometry(1);
      break;
    case 6:
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    case 8:
      geometry = new THREE.OctahedronGeometry(1);
      break;
    case 10:
      geometry = createPentagonalTrapezohedron();
      break;
    case 12:
      geometry = new THREE.DodecahedronGeometry(1);
      break;
    case 20:
      geometry = new THREE.IcosahedronGeometry(1);
      break;
    case "%":
      geometry = createPentagonalTrapezohedron();
      break;
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
  }

const material = new THREE.MeshBasicMaterial({
  color: 0xc3423f,
  side: THREE.DoubleSide,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x000000,
  linewidth: 2,
});
const wireframe = new THREE.LineSegments(edges, lineMaterial);
scene.add(wireframe);

camera.position.z = 6;

const sceneData = {
  scene,
  camera,
  renderer,
  geometry,
  material,
  mesh,
  wireframe,
  edges,
  lineMaterial,
  canvas: renderer.domElement,
  animationId: null,
  isRolling: false,
};

function animate() {
  sceneData.animationId = requestAnimationFrame(animate);

  const speed = sceneData.isRolling ? 0.1 : 0.01;
  mesh.rotation.x += speed;
  mesh.rotation.y += speed;
  wireframe.rotation.x += speed;
  wireframe.rotation.y += speed;

  renderer.render(scene, camera);
  }
  animate();

  activeDiceScenes.push(sceneData);

  return sceneData;
}

function cleanupDiceCanvas(sceneData) {
  if (sceneData.animationId) {
    cancelAnimationFrame(sceneData.animationId);
  }

  sceneData.renderer.dispose();
  sceneData.geometry.dispose();
  sceneData.material.dispose();
  sceneData.edges.dispose();
  sceneData.lineMaterial.dispose();

  const index = activeDiceScenes.indexOf(sceneData);
  if (index > -1) {
    activeDiceScenes.splice(index, 1);
  }
}

function setRollingState(isRolling) {
  activeDiceScenes.forEach((sceneData) => {
    sceneData.isRolling = isRolling;
  });
}

function cleanupAllScenes() {
  const scenesToCleanup = [...activeDiceScenes];
  scenesToCleanup.forEach((sceneData) => {
    cleanupDiceCanvas(sceneData);
  });
}

window.diceUtils = {
  createDiceCanvas,
  cleanupDiceCanvas,
  setRollingState,
  cleanupAllScenes,
};

window.diceScenes = activeDiceScenes;

function handleResize() {
  activeDiceScenes.forEach((sceneData) => {
    sceneData.renderer.setSize(200, 200);
  });
}

window.addEventListener("resize", handleResize);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
  } else {
  }
});
