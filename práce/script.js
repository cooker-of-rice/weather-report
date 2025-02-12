// ===== IT-Themed Network Background Animation =====
function initNetwork() {
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');

  // Cache window dimensions and update them on resize with a debounce
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const nodes = [];
  const nodeCount = 50; // You can lower this number if needed for performance
  const maxDistance = 100; // Maximum distance to draw connecting lines

  // Pre-create nodes with random positions and velocities
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  }

  function update() {
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Update positions and draw nodes
    for (let i = 0; i < nodeCount; i++) {
      const node = nodes[i];
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off edges
      if (node.x < 0 || node.x > width) node.vx = -node.vx;
      if (node.y < 0 || node.y > height) node.vy = -node.vy;

      // Draw the node (batch draw similar nodes might help if using Path2D, but here it is simple)
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fill();
    }

    // Draw lines between nodes if close enough
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.strokeStyle = `rgba(255,255,255,${1 - distance / maxDistance})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(update);
  }

  update();

  // Debounce resize events to avoid excessive recalculations
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 150);
  });
}

initNetwork();

// ===== Navigation and Menu Animations =====
// Cache DOM elements
const navWrapper = document.getElementById('navWrapper');
const menuToggle = document.getElementById('menuToggle');

// Once the falling animation finishes, add the "active" class to trigger orbit animations.
navWrapper.addEventListener('animationend', () => {
  navWrapper.classList.add('active');
});

// The main button now only opens the menu (if not already active).
menuToggle.addEventListener('click', (e) => {
  if (!navWrapper.classList.contains('active')) {
    navWrapper.classList.add('active');
  }
  e.stopPropagation();
});

// No outside-click logic—the menu remains open once activated.
document.addEventListener('click', () => {
  // No action needed.
});
