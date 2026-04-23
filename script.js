const genCanvas = document.getElementById('genCanvas');
const waveCanvas = document.getElementById('waveCanvas');
const genCtx = genCanvas.getContext('2d');
const waveCtx = waveCanvas.getContext('2d');

genCanvas.width = 400; genCanvas.height = 300;
waveCanvas.width = 400; waveCanvas.height = 300;

let angle = 0;
let points = [];
let networkInterference = 0;

// 1. Detect Network Connection
function checkNetwork() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
        document.getElementById('netType').innerText = conn.effectiveType.toUpperCase();
        // Faster/Stable net = less interference
        networkInterference = conn.downlink < 2 ? 15 : 2; 
        document.getElementById('noiseLevel').innerText = networkInterference > 10 ? "High" : "Stable";
    }
}
setInterval(checkNetwork, 3000); // Check every 3 seconds

function draw() {
    const speed = document.getElementById('speed').value / 250;
    const flux = document.getElementById('flux').value;
    const manualNoise = parseInt(document.getElementById('manualNoise').value);

    // --- Generator Animation ---
    genCtx.clearRect(0, 0, 400, 300);
    
    // Magnetic Poles (N-S)
    genCtx.fillStyle = '#e74c3c'; genCtx.fillRect(20, 100, 50, 100); 
    genCtx.fillStyle = '#3498db'; genCtx.fillRect(330, 100, 50, 100);
    genCtx.fillStyle = '#fff'; genCtx.fillText("NORTH", 25, 90); genCtx.fillText("SOUTH", 335, 90);

    // Rotating Coil
    genCtx.save();
    genCtx.translate(200, 150);
    genCtx.rotate(angle);
    genCtx.strokeStyle = '#f1c40f';
    genCtx.lineWidth = 4;
    genCtx.strokeRect(-60, -40, 120, 80);
    genCtx.restore();

    // --- Waveform Logic with Interference ---
    // Pure Sine Wave + Network Noise + Manual Slider Noise
    let noise = (Math.random() - 0.5) * (networkInterference + manualNoise);
    let currentEMF = (flux * Math.sin(angle)) + noise;
    
    points.push(currentEMF);
    if (points.length > 200) points.shift();

    // Draw Wave
    waveCtx.clearRect(0, 0, 400, 300);
    waveCtx.strokeStyle = '#2ecc71';
    waveCtx.lineWidth = 2;
    waveCtx.beginPath();
    
    for (let i = 0; i < points.length; i++) {
        let x = i * 2;
        let y = 150 - points[i];
        if (i === 0) waveCtx.moveTo(x, y);
        else waveCtx.lineTo(x, y);
    }
    waveCtx.stroke();

    angle += speed;
    requestAnimationFrame(draw);
}

checkNetwork();
draw();
