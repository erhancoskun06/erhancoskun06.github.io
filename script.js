const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const canvas = document.querySelector(".neural-canvas");

if (menuToggle && header) {
  menuToggle.addEventListener("click", () => {
    const next = !header.classList.contains("nav-open");
    header.classList.toggle("nav-open", next);
    menuToggle.setAttribute("aria-expanded", String(next));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

if (canvas) {
  const context = canvas.getContext("2d");

  if (context) {
    const points = [];
    const connectionDistance = 170;
    const pointCount = 46;
    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    let mouse = { x: 0, y: 0, active: false };

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function createPoints() {
      points.length = 0;
      for (let index = 0; index < pointCount; index += 1) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: 1.2 + Math.random() * 2.4
        });
      }
    }

    function updatePoints() {
      points.forEach((point) => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < -20 || point.x > width + 20) {
          point.vx *= -1;
        }

        if (point.y < -20 || point.y > height + 20) {
          point.vy *= -1;
        }
      });
    }

    function drawConnections() {
      for (let i = 0; i < points.length; i += 1) {
        const source = points[i];

        for (let j = i + 1; j < points.length; j += 1) {
          const target = points[j];
          const dx = source.x - target.x;
          const dy = source.y - target.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const alpha = 1 - distance / connectionDistance;
            context.strokeStyle = `rgba(126, 224, 255, ${alpha * 0.18})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(source.x, source.y);
            context.lineTo(target.x, target.y);
            context.stroke();
          }
        }

        if (mouse.active) {
          const dx = source.x - mouse.x;
          const dy = source.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 220) {
            const alpha = 1 - distance / 220;
            context.strokeStyle = `rgba(159, 255, 199, ${alpha * 0.24})`;
            context.beginPath();
            context.moveTo(source.x, source.y);
            context.lineTo(mouse.x, mouse.y);
            context.stroke();
          }
        }
      }
    }

    function drawPoints() {
      points.forEach((point) => {
        const gradient = context.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          point.radius * 6
        );
        gradient.addColorStop(0, "rgba(159, 255, 199, 0.9)");
        gradient.addColorStop(0.35, "rgba(126, 224, 255, 0.36)");
        gradient.addColorStop(1, "rgba(126, 224, 255, 0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(point.x, point.y, point.radius * 6, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = "rgba(210, 244, 255, 0.9)";
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fill();
      });
    }

    function animate() {
      context.clearRect(0, 0, width, height);
      updatePoints();
      drawConnections();
      drawPoints();
      animationFrameId = window.requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
      resizeCanvas();
      createPoints();
    });

    window.addEventListener("pointermove", (event) => {
      mouse = { x: event.clientX, y: event.clientY, active: true };
    });

    window.addEventListener("pointerleave", () => {
      mouse.active = false;
    });

    resizeCanvas();
    createPoints();
    animate();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrameId);
        return;
      }

      animate();
    });
  }
}
