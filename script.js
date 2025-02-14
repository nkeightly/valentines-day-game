let score = 0;
let timeLeft = 60;
const hearts = [
  { canvas: document.getElementById('heartCanvas1'), path: document.getElementById('heartPath1') },
  { canvas: document.getElementById('heartCanvas2'), path: document.getElementById('heartPath2') },
  { canvas: document.getElementById('heartCanvas3'), path: document.getElementById('heartPath3') },
  { canvas: document.getElementById('heartCanvas4'), path: document.getElementById('heartPath4') }
];

const audio = document.getElementById('heartAudio');
const particleCount = 500;
const particleSize = 3;
const particleColors = [
  '#FF6B6B', '#FF8B8B', '#FFABAB', '#FFCBDB', '#FFD1D1', '#FFE1E1', '#FFF1F1'
]; // Various shades of pink and red

hearts.forEach(heart => {
  const ctx = heart.canvas.getContext('2d');
  let particles = [];

  heart.canvas.width = 300;
  heart.canvas.height = 300;

  function initParticles() {
    particles = [];
    const pathPoints = getPathPoints(heart.path);

    for (let i = 0; i < particleCount; i++) {
      const randomPoint = pathPoints[Math.floor(Math.random() * pathPoints.length)];
      particles.push({
        x: randomPoint.x,
        y: randomPoint.y,
        vx: 0,
        vy: 0,
        size: particleSize,
        color: particleColors[Math.floor(Math.random() * particleColors.length)], // Random color
        baseX: randomPoint.x,
        baseY: randomPoint.y,
      });
    }
  }

  function getPathPoints(path) {
    const points = [];
    const length = path.getTotalLength();
    for (let i = 0; i < length; i += 2) {
      const point = path.getPointAtLength(i);
      points.push({ x: point.x, y: point.y });
    }
    return points;
  }

  function drawParticles() {
    ctx.clearRect(0, 0, heart.canvas.width, heart.canvas.height);
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });
  }

  function updateParticles() {
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (Math.abs(particle.x - particle.baseX) > 1 || Math.abs(particle.y - particle.baseY) > 1) {
        particle.vx += (particle.baseX - particle.x) * 0.01;
        particle.vy += (particle.baseY - particle.y) * 0.01;
      }
    });
  }

  function animate() {
    drawParticles();
    updateParticles();
    requestAnimationFrame(animate);
  }

  heart.canvas.addEventListener('mousemove', (e) => {
    const rect = heart.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    particles.forEach(particle => {
      const dist = Math.hypot(particle.x - mouseX, particle.y - mouseY);
      if (dist < 50) {
        particle.vx = (Math.random() - 0.5) * 10;
        particle.vy = (Math.random() - 0.5) * 10;
        if (audio.paused) {
          audio.currentTime = 0;
          audio.play();
        }
        score++;
        document.getElementById('score').innerText = `Score: ${score}`;
      }
    });
  });

  heart.canvas.addEventListener('mouseleave', () => {
    initParticles();
  });

  initParticles();
  animate();
});

function changeHeartColors() {
  const colors = ['#ff6b6b', '#ff8b8b', '#ffabab', '#ffcbcb'];
  const shapes = [
    "M150 270 C75 270 0 180 75 120 C100 90 150 120 150 150 C150 120 200 90 225 120 C300 180 225 270 150 270 Z",
    "M150 270 C100 270 50 200 100 150 C150 100 200 150 250 200 C300 250 200 270 150 270 Z",
    "M150 270 C50 270 0 200 50 150 C100 100 200 150 250 200 C300 250 200 270 150 270 Z",
    "M150 270 C75 270 0 180 75 120 C100 90 150 120 150 150 C150 120 200 90 225 120 C300 180 225 270 150 270 Z"
  ];
  hearts.forEach((heart, index) => {
    heart.path.setAttribute('fill', colors[index % colors.length]);
    heart.path.setAttribute('d', shapes[index % shapes.length]);
  });
}

function startTimer() {
  const timerElement = document.getElementById('timer');
  const interval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerElement.innerText = `Time Left: ${timeLeft}s`;
    } else {
      clearInterval(interval);
      alert(`Time's up! Your final score is: ${score}`);
      score = 0;
      timeLeft = 60;
      document.getElementById('score').innerText = `Score: ${score}`;
      timerElement.innerText = `Time Left: ${timeLeft}s`;
    }
  }, 1000);
}

window.onload = startTimer;