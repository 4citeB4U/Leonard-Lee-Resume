const METAL_TILE_SIZE = 100;
const GRID_OFFSET = 3;
const BASE_CLEAR_COLOR = "#000";

class MetallicOctagon {
  constructor(row, col, size, ctx) {
    this.row = row;
    this.col = col;
    this.size = size;
    this.ctx = ctx;
    this.baseX = col * size;
    this.baseY = row * size;
    this.x = this.baseX;
    this.y = this.baseY;
    this.wavePhase = (row * 0.5 + col * 0.4) * Math.PI;
    this.colorPhase = (row * 0.3 + col * 0.6) * Math.PI;
    this.rotation = 0;
  }

  update(time) {
    const waveX = Math.sin(time + this.wavePhase) * 6;
    const waveY = Math.cos(time * 0.8 + this.wavePhase * 0.7) * 5;
    this.x = this.baseX + waveX;
    this.y = this.baseY + waveY;
    this.rotation = Math.sin(time * 0.5 + this.wavePhase) * 0.05;
  }

  getColor(baseValue, time) {
    const wave = Math.sin(time + this.colorPhase) * 0.5 + 0.5;
    const minVal = baseValue - 15;
    const maxVal = baseValue + 15;
    const colorVal = Math.floor(minVal + (maxVal - minVal) * wave);
    return `rgb(${colorVal}, ${colorVal}, ${colorVal})`;
  }

  draw(time) {
    const ctx = this.ctx;
    const s = this.size;
    const third = s / 3;
    const half = s / 2;

    ctx.save();
    ctx.translate(this.x + half, this.y + half);
    ctx.rotate(this.rotation);
    ctx.translate(-half, -half);

    ctx.fillStyle = this.getColor(20, time * 0.5);
    ctx.fillRect(0, 0, s, s);

    const centerX = half;
    const centerY = half;
    const faces = [
      { color: 70, points: [[centerX, centerY], [third, third], [s - third, third]] },
      { color: 45, points: [[centerX, centerY], [s - third, third], [s - third, half]] },
      { color: 60, points: [[centerX, centerY], [s - third, half], [s - third, s - third]] },
      { color: 50, points: [[centerX, centerY], [s - third, s - third], [half, s - third]] },
      { color: 35, points: [[centerX, centerY], [half, s - third], [third, s - third]] },
      { color: 30, points: [[centerX, centerY], [third, s - third], [third, half]] },
      { color: 55, points: [[centerX, centerY], [third, half], [third, third]] },
      { color: 65, points: [[centerX, centerY], [third, third], [half, third]] }
    ];

    faces.forEach((face, index) => {
      ctx.fillStyle = this.getColor(face.color, time * (0.85 + index * 0.05));
      ctx.beginPath();
      face.points.forEach((point, pointIndex) => {
        if (pointIndex === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });
      ctx.closePath();
      ctx.fill();
    });

    const corners = [
      { colorA: 80, colorB: 25, pointsA: [[0, 0], [third, 0], [0, third]], pointsB: [[third, 0], [third, third], [0, third]] },
      { colorA: 80, colorB: 25, pointsA: [[s - third, 0], [s, 0], [s - third, third]], pointsB: [[s, 0], [s, third], [s - third, third]] },
      { colorA: 80, colorB: 25, pointsA: [[s - third, s - third], [s, s - third], [s - third, s]], pointsB: [[s, s - third], [s, s], [s - third, s]] },
      { colorA: 80, colorB: 25, pointsA: [[0, s - third], [third, s - third], [0, s]], pointsB: [[third, s - third], [third, s], [0, s]] }
    ];

    corners.forEach((corner, index) => {
      ctx.fillStyle = this.getColor(corner.colorA, time * (1 + index * 0.1));
      ctx.beginPath();
      corner.pointsA.forEach((point, pointIndex) => {
        if (pointIndex === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = this.getColor(corner.colorB, time * (0.7 + index * 0.1));
      ctx.beginPath();
      corner.pointsB.forEach((point, pointIndex) => {
        if (pointIndex === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });
      ctx.closePath();
      ctx.fill();
    });

    ctx.strokeStyle = "rgba(50, 50, 50, 0.15)";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(0, 0, s, s);
    ctx.restore();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const downloadBtn = document.getElementById("downloadPdf");
  const backgroundRoot = document.getElementById("metallic-background");
  const revealTargets = document.querySelectorAll(".lift-frame");

  setupResumeQr();

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      window.print();
    });
  }

  if (backgroundRoot) {
    setupMetallicBackground(backgroundRoot);
  }

  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("visible"));
  }
});

function setupResumeQr() {
  const liveQr = document.querySelector(".contact-item-qr");
  if (liveQr) {
    liveQr.remove();
  }

  const printHeader = document.querySelector(".print-header");
  const printPhoto = printHeader?.querySelector(".print-photo");
  if (!printHeader || !printPhoto || printHeader.querySelector(".print-qr-block")) {
    return;
  }

  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https%3A%2F%2F4citeb4u.github.io%2FLeonard-Lee-Resume%2F";
  const aside = document.createElement("div");
  aside.style.display = "grid";
  aside.style.justifyItems = "center";
  aside.style.alignSelf = "start";
  aside.style.gap = "0.28rem";

  const qrBlock = document.createElement("div");
  qrBlock.className = "print-qr-block";
  qrBlock.style.display = "grid";
  qrBlock.style.justifyItems = "center";
  qrBlock.style.gap = "0.12rem";
  qrBlock.style.width = "100%";
  qrBlock.style.maxWidth = "104px";
  qrBlock.style.padding = "0.28rem 0.3rem 0.24rem";
  qrBlock.style.border = "1px solid #cbd5e1";
  qrBlock.style.borderRadius = "0.65rem";
  qrBlock.style.background = "linear-gradient(180deg, #f8fbff, #eef4ff)";

  const qrImage = document.createElement("img");
  qrImage.src = qrUrl;
  qrImage.alt = "QR code to the live Leonard Lee resume";
  qrImage.className = "print-qr";
  qrImage.style.width = "74px";
  qrImage.style.height = "74px";
  qrImage.style.display = "block";

  const qrCaption = document.createElement("span");
  qrCaption.className = "print-qr-caption";
  qrCaption.textContent = "Scan live resume";
  qrCaption.style.color = "#475569";
  qrCaption.style.fontSize = "6.9pt";
  qrCaption.style.fontWeight = "700";
  qrCaption.style.letterSpacing = "0.08em";
  qrCaption.style.textTransform = "uppercase";
  qrCaption.style.textAlign = "center";

  qrBlock.append(qrImage, qrCaption);
  printPhoto.replaceWith(aside);
  aside.append(printPhoto, qrBlock);
}

function setupMetallicBackground(container) {
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  let width = 0;
  let height = 0;
  let time = 0;
  let animationFrame = 0;
  let octagons = [];

  const rebuildGrid = () => {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    octagons = [];
    const rows = Math.ceil(height / METAL_TILE_SIZE) + GRID_OFFSET * 2;
    const cols = Math.ceil(width / METAL_TILE_SIZE) + GRID_OFFSET * 2;

    for (let row = -GRID_OFFSET; row < rows; row += 1) {
      for (let col = -GRID_OFFSET; col < cols; col += 1) {
        octagons.push(new MetallicOctagon(row, col, METAL_TILE_SIZE, ctx));
      }
    }
  };

  const drawFrame = () => {
    ctx.fillStyle = BASE_CLEAR_COLOR;
    ctx.fillRect(0, 0, width, height);
    time += 0.015;

    octagons.forEach((piece) => {
      piece.update(time);
      piece.draw(time);
    });

    animationFrame = requestAnimationFrame(drawFrame);
  };

  rebuildGrid();
  animationFrame = requestAnimationFrame(drawFrame);

  const handleResize = () => rebuildGrid();
  window.addEventListener("resize", handleResize);

  return () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", handleResize);
  };
}
