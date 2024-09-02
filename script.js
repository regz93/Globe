// Configuration initiale de la scène, de la caméra et du renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globe-container').appendChild(renderer.domElement);

// Ajout d'un globe avec une texture de la Terre
const globe = new ThreeGlobe()
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg') // Texture de la Terre
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png') // Topologie de la Terre
    .arcsData([
        { startLat: 48.869241005215, startLng: 2.347723973146, endLat: 43.6045, endLng: 1.4442, color: 'red' },    // Paris -> Toulouse
        { startLat: 48.869241005215, startLng: 2.347723973146, endLat: 45.7640, endLng: 4.8357, color: 'red' },    // Paris -> Lyon
        { startLat: 48.869241005215, startLng: 2.347723973146, endLat: 44.8378, endLng: -0.5792, color: 'red' },   // Paris -> Bordeaux
        { startLat: 48.869241005215, startLng: 2.347723973146, endLat: 43.2965, endLng: 5.3698, color: 'red' },    // Paris -> Marseille
        { startLat: 48.869241005215, startLng: 2.347723973146, endLat: 50.6292, endLng: 3.0573, color: 'red' }     // Paris -> Lille
    ])
    .arcColor('color')
    .arcAltitude(0.2)
    .arcStroke(0.5)
    .arcDashLength(0.3)
    .arcDashGap(2)
    .arcDashInitialGap(0.3)
    .arcDashAnimateTime(2000);

// Ajout du globe à la scène
scene.add(globe);

// Positionnement de la caméra pour zoomer sur l'Europe
camera.position.set(5, 100, 100); // Ajustez la position de la caméra pour se concentrer sur l'Europe
camera.lookAt(0, 0, 0); // Orientez la caméra vers le centre du globe

// Faire tourner le globe pour centrer l'Europe
globe.rotation.y = Math.PI / 2; // Ajuste la rotation pour centrer l'Europe sur l'écran

// Ajout d'une lumière ambiante
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Démarrage de l'animation
animate();

// Réajustement de la taille du rendu en cas de redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
