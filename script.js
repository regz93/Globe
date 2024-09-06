// Configuration initiale de la scène, de la caméra et du renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globe-container').appendChild(renderer.domElement);

// Déclaration de la variable globe avant son utilisation
let globe;

// Fonction pour récupérer les données
async function fetchData() {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwOltLszBi2RPoNgBmEouIRY7U3S5VIx_C6zrow1M_ck00_FnW8AJm9FNGL8K7VBmRW/exec');
    const data = await response.json();
    return data;
}

// Fonction pour traiter les arcs et ajuster la caméra
async function initializeGlobe() {
    // Attendre les données
    const data = await fetchData();
    
    // Récupération des coordonnées de l'arc (assume que les données sont au bon format)
    const lap = parseFloat(data[13][1].split(",")[0]);
    const lng = parseFloat(data[13][1].split(",")[1]);

    // Données des arcs
    const arcsData = [
        { startLat: 48.869241005215, startLng: 2.347723973146, endLat: lap, endLng: lng, color: 'blue' },    // Paris -> Destination
    ];

    // Fonction pour ajouter un point noir à un point géographique
    function addPoint(arcData) {
        const { endLat, endLng } = arcData;

        // Convertir les coordonnées géographiques en coordonnées 3D sur le globe
        const pointCoords = globe.getCoords(endLat, endLng);

        // Créer un point noir avec une petite sphère
        const pointGeometry = new THREE.SphereGeometry(0.3, 15, 15); // Taille du point
        const pointMaterial = new THREE.MeshBasicMaterial({ color: FFFFFF }); // Couleur noir
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        
        // Positionner le point sur le globe
        point.position.set(pointCoords.x, pointCoords.y, pointCoords.z);
        scene.add(point);
    }

    // Ajout d'un globe avec une texture de la Terre et les arcs
    globe = new ThreeGlobe()
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg') // Texture de la Terre
        .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png') // Topologie de la Terre
        .arcsData(arcsData)
        .arcColor('color')
        .arcAltitude(0.2)
        .arcStroke(0.5)
        .arcDashLength(0.3)
        .arcDashGap(2)
        .arcDashInitialGap(0.3)
        .arcDashAnimateTime(2000);

    // Ajout du globe à la scène
    scene.add(globe);

    // Ajout des points noirs pour chaque point de fin des arcs
    arcsData.forEach(arcData => {
        addPoint(arcData);
    });

    // Ajustement automatique de la caméra pour capturer les deux points
    adjustCamera(arcsData[0]);
}

// Fonction pour calculer la distance entre deux points géographiques (Haversine)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = THREE.MathUtils.degToRad(lat2 - lat1);
    const dLng = THREE.MathUtils.degToRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(THREE.MathUtils.degToRad(lat1)) * Math.cos(THREE.MathUtils.degToRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance en kilomètres
    return distance;
}

// Fonction pour ajuster la caméra
function adjustCamera(arcData) {
    const { startLat, startLng, endLat, endLng } = arcData;

    // Calcul du centre géographique
    const centerLat = (startLat + endLat) / 2;
    const centerLng = (startLng + endLng) / 2;

    // Conversion du centre en coordonnées 3D
    const centerCoords = globe.getCoords(centerLat, centerLng);

    // Positionner la caméra au-dessus du centre
    camera.position.set(centerCoords.x * 1.5, centerCoords.y * 1.5, centerCoords.z * 1.5);

    // Faire en sorte que la caméra regarde le centre du globe
    camera.lookAt(centerCoords.x, centerCoords.y, centerCoords.z);

    // Calculer la distance entre les deux points
    const distance = calculateDistance(startLat, startLng, endLat, endLng);

    // Ajuster la position de la caméra en fonction de la distance entre les points
    const zoomFactor = (1 + distance / 4000); // Ajuster l'échelle de la distance
    camera.position.multiplyScalar(zoomFactor);
}

// Initialiser la scène avec les données
initializeGlobe();

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
