import  { useEffect } from 'react';
import '../styles/Bonus.css';

const NeonGrid = () => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.neon-grid-container');
    if (!container || !ctx) return;

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none'; // Добавлено
    canvas.style.zIndex = '1';
    container.appendChild(canvas);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const points = Array.from({length: 100}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    }));

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;

      points.forEach((p1, i) => {
        p1.x += p1.dx;
        p1.y += p1.dy;
        if (p1.x < 0 || p1.x > canvas.width) p1.dx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.dy *= -1;

        points.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      container.removeChild(canvas);
    };
  }, []);

  return <div className="neon-grid-container" style={{ pointerEvents: 'none' }}></div>;
};

const Bonus = () => {
  return (
    <div className="cyber-container">
      <NeonGrid />

      <div className="cyber-content">
        <h1 className="cyber-title glitch" data-text="🎁 BONUS REALITIES">🎁 BONUS REALITIES</h1>

        <div className="matrix-cards">
          <div className="cyber-card hologram">
            <div className="card-header">
              <h3 className="pulse">📡 CONNECT TELEGRAM CHANNEL</h3>
              <div className="status-bar">
                <div className="scan-line"></div>
              </div>
            </div>
            <p className="info-text">Decrypt channel data to receive 100 $MOLLY</p>
            <button className="cyber-button">
              <span className="btn-glitch">INITIATE CONNECTION</span>
              <span className="btn-background"></span>
            </button>
            <div className="status pending">SYSTEM STATUS: <span className="blink">NOT SYNCHRONIZED</span></div>
          </div>

          <div className="cyber-card hologram">
            <div className="card-header">
              <h3 className="pulse">🌐 TIKTOK FREQUENCY</h3>
              <div className="status-bar">
                <div className="scan-line reverse"></div>
              </div>
            </div>
            <p className="info-text">Align social resonance for 100 $MOLLY</p>
            <button className="cyber-button">
              <span className="btn-glitch">ESTABLISH LINK</span>
              <span className="btn-background"></span>
            </button>
            <div className="status pending">SYSTEM STATUS: <span className="blink">SIGNAL LOST</span></div>
          </div>
        </div>

        <div className="cyber-message">
          <p className="matrix-text">MORE DATA STREAMS DECRYPTING...</p>
          <div className="loading-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Bonus;