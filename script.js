// Configuration de la scène, de la caméra et du renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globe-container').appendChild(renderer.domElement);

// Ajout d'un globe avec une texture plus claire (teintes de gris)
const globe = new ThreeGlobe()
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg') // Texture claire de la Terre
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png'); // Topologie de la Terre

// Données des points lumineux et des noms de villes
const pointsData = [
    { lat: 48.8566, lng: 2.3522, size: 1.0, color: 'green', name: 'Paris' },  // Paris
    { lat: 45.5017, lng: -73.5673, size: 1.0, color: 'green', name: 'Montréal' },  // Montréal
    { lat: 13.7563, lng: 100.5018, size: 1.0, color: 'green', name: 'Bangkok' },  // Bangkok
    { lat: 41.3851, lng: 2.1734, size: 1.0, color: 'green', name: 'Barcelone' },  // Barcelone
    { lat: 40.7128, lng: -74.0060, size: 1.0, color: 'green', name: 'New York' },  // New York
    { lat: 6.1725, lng: 1.2314, size: 1.0, color: 'green', name: 'Lomé' },  // Lomé
    { lat: 35.6895, lng: 139.6917, size: 1.0, color: 'green', name: 'Tokyo' },  // Tokyo
    { lat: -22.9068, lng: -43.1729, size: 1.0, color: 'green', name: 'Rio de Janeiro' },  // Rio de Janeiro
    { lat: -20.8823, lng: 55.4507, size: 1.0, color: 'green', name: 'Saint-Denis' },  // Saint-Denis (Réunion)
    { lat: 31.5, lng: 34.4667, size: 1.0, color: 'green', name: 'Gaza' },  // Gaza
    { lat: -33.9249, lng: 18.4241, size: 1.0, color: 'green', name: 'Cape Town' },  // Cape Town
    { lat: -12.0464, lng: -77.0428, size: 1.0, color: 'green', name: 'Lima' },  // Lima
    { lat: 28.6139, lng: 77.2090, size: 1.0, color: 'green', name: 'New Delhi' },  // New Delhi
    { lat: 31.6295, lng: -7.9811, size: 1.0, color: 'green', name: 'Marrakesh' },  // Marrakesh
    { lat: 43.2965, lng: 5.3698, size: 1.0, color: 'green', name: 'Marseille' },  // Marseille
    { lat: 43.6045, lng: 1.4442, size: 1.0, color: 'green', name: 'Toulouse' },  // Toulouse
    { lat: -18.8792, lng: 47.5079, size: 1.0, color: 'green', name: 'Antananarivo' },  // Antananarivo
    { lat: 40.4168, lng: -3.7038, size: 1.0, color: 'green', name: 'Madrid' },  // Madrid
    { lat: 38.7223, lng: -9.1393, size: 1.0, color: 'green', name: 'Lisbonne' },  // Lisbonne
    { lat: 34.0522, lng: -118.2437, size: 1.0, color: 'green', name: 'Los Angeles' },  // Los Angeles
    { lat: 30.0444, lng: 31.2357, size: 1.0, color: 'green', name: 'Le Caire' },  // Le Caire
    { lat: 5.6037, lng: -0.1870, size: 1.0, color: 'green', name: 'Accra' },  // Accra
    { lat: 19.4326, lng: -99.1332, size: 1.0, color: 'green', name: 'Mexico' }  // Mexico
];

// Ajout des points lumineux et des labels au globe
globe
    .pointsData(pointsData)
    .pointAltitude(0.1) // Altitude des points par rapport à la surface du globe
    .pointRadius(0.3)   // Taille des points
    .pointColor('color')
    .labelLat('lat')
    .labelLng('lng')
    .labelText('name')
    .labelSize(1.5)
    .labelDotRadius(0.5)
    .labelColor(() => 'white')
    .labelResolution(10);

// Ajout du globe à la scène
scene.add(globe);

// Positionnement de la caméra
camera.position.z = 350; // Ajusté pour s'assurer que le globe est bien visible

// Ajout d'une lumière ambiante
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.001;  // Vitesse de rotation du globe
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
