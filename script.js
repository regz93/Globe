// Configuration initiale de la scène, de la caméra et du renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globe-container').appendChild(renderer.domElement);

// Point de départ fixe (Paris)
const startLat = 48.869241005215;
const startLng = 2.347723973146;

// Ajout d'un globe avec une texture de la Terre
const globe = new ThreeGlobe()
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg') // Texture de la Terre
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png'); // Topologie de la Terre

// Fonction pour ajouter un point sur une coordonnée géographique
function addPointOnGlobe(lat, lng, color = 0x000000, size = 1) {
    // Convertir les coordonnées géographiques en coordonnées 3D
    const pointCoords = globe.getCoords(lat, lng);
    
    // Créer une sphère pour représenter le point
    const pointGeometry = new THREE.SphereGeometry(size, 32, 32); // Taille du point
    const pointMaterial = new THREE.MeshBasicMaterial({ color: color }); // Couleur du point
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    
    // Positionner le point sur le globe
    point.position.set(pointCoords.x, pointCoords.y, pointCoords.z);
    scene.add(point);
}

// Fonction pour ajouter un arc depuis Paris à une autre destination
function addArc(startLat, startLng, endLat, endLng, color = 0xff0000) {
    const arcData = {
        startLat: startLat,
        startLng: startLng,
        endLat: endLat,
        endLng: endLng,
        color: color
    };

    globe.arcsData([arcData])
        .arcColor('color')
        .arcAltitude(0.2)
        .arcStroke(0.5)
        .arcDashLength(0.3)
        .arcDashGap(2)
        .arcDashInitialGap(0.3)
        .arcDashAnimateTime(2000);

    // Ajouter un point noir à la destination
    addPointOnGlobe(endLat, endLng, 0x000000, 1.5);
}

// Récupérer les données externes
fetch('path_to_your_data/points.json')
    .then(response => response.json())
    .then(data => {
        // Pour chaque destination dans les données, ajouter un arc et un point sur le globe
        data.forEach(point => {
            addArc(startLat, startLng, point.lat, point.lng, parseInt(point.color));
        });
    })
    .catch(error => console.error('Erreur lors de la récupération des données:', error));

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
