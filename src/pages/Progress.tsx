import React, { useState, useEffect } from "react";
import { useGame } from "../GameContext";
import "../styles/Progress.css";

const MatrixGrid = () => {
  useEffect(() => {
    const container = document.querySelector('.matrix-grid-container');
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    container.appendChild(canvas);

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const points = Array.from({length: 50}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    }));

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 0.3;

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

  return <div className="matrix-grid-container"></div>;
};

const BinaryRain = () => {
  const [digits, setDigits] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDigit = Math.random() > 0.5 ? '1' : '0';
      setDigits(prev => [...prev.slice(-100), newDigit]);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="binary-rain">
      {digits.map((digit, i) => (
        <span
          key={i}
          className="binary-digit"
          style={{
            opacity: Math.random() * 0.3 + 0.1,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 5 + 3}s`
          }}
        >
          {digit}
        </span>
      ))}
    </div>
  );
};

const Progress: React.FC = () => {
  const {
    productList,
    unlocked,
    unlockProduct,
    currentProduct,
    setCurrentProduct,
    money,
    setMoney,
    productStock,
  } = useGame();

  const [activeTab, setActiveTab] = useState<"products" | "riskReduction">("products");
  const [upgradeData, setUpgradeData] = useState([
    { name: "Anonymizer", cost: 500, reduction: 0.1, bought: 0 },
    { name: "Bribe", cost: 1000, reduction: 0.2, bought: 0 },
    { name: "Safe House", cost: 2000, reduction: 0.3, bought: 0 },
    { name: "Undercover Cop", cost: 5000, reduction: 0.5, bought: 0 },
    { name: "Silent Partner", cost: 10000, reduction: 1.0, bought: 0 },
  ]);

  const handleUnlock = (product: { name: string; unlockPrice: number }) => {
    if (money >= product.unlockPrice) {
      setMoney(money - product.unlockPrice);
      unlockProduct(product.name);
    }
  };

  const handleUpgrade = (index: number) => {
    const upgrade = upgradeData[index];
    if (money >= upgrade.cost) {
      setMoney(money - upgrade.cost);
      const updatedUpgrades = [...upgradeData];
      updatedUpgrades[index].bought += 1;
      updatedUpgrades[index].cost = Math.floor(upgrade.cost * 1.5);
      setUpgradeData(updatedUpgrades);
    }
  };

  return (
    <div className="cyber-progress">
      <MatrixGrid />
      <BinaryRain />

      <div className="cyber-header">
        <h2 className="glitch" data-text="PROGRESS MATRIX">PROGRESS MATRIX</h2>
        <div className="scanline"></div>
      </div>

      <div className="cyber-tabs">
        <button
          className={`cyber-tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <span className="cyber-tab-text">PRODUCT DATABASE</span>
          <span className="cyber-tab-glow"></span>
        </button>
        <button
          className={`cyber-tab ${activeTab === "riskReduction" ? "active" : ""}`}
          onClick={() => setActiveTab("riskReduction")}
        >
          <span className="cyber-tab-text">SECURITY UPGRADES</span>
          <span className="cyber-tab-glow"></span>
        </button>
      </div>

      {activeTab === "products" && (
        <div className="cyber-grid">
          {productList.map((product) => {
            const isUnlocked = unlocked.includes(product.name);
            const isCurrent = currentProduct.name === product.name;
            const canUnlock = money >= product.unlockPrice;
            const inStock = productStock[product.name] || 0;

            return (
              <div
                key={product.name}
                className={`cyber-card ${!isUnlocked ? "locked" : ""} ${isCurrent ? "active" : ""}`}
              >
                <div className="card-header">
                  <h3 className="cyber-card-title">{product.name}</h3>
                  <div className="card-corner"></div>
                </div>
                <div className="card-content">
                  <div className="cyber-stat">
                    <span className="stat-label">BUY:</span>
                    <span className="stat-value">${product.buyPrice}</span>
                  </div>
                  <div className="cyber-stat">
                    <span className="stat-label">SELL:</span>
                    <span className="stat-value">${product.sellPrice}</span>
                  </div>
                  <div className="cyber-stat">
                    <span className="stat-label">STOCK:</span>
                    <span className="stat-value">{inStock} oz</span>
                  </div>
                </div>
                <div className="card-footer">
                  {!isUnlocked ? (
                    <button
                      className={`cyber-button unlock-btn ${canUnlock ? "active" : ""}`}
                      disabled={!canUnlock}
                      onClick={() => handleUnlock(product)}
                    >
                      <span className="btn-text">UNLOCK (${product.unlockPrice})</span>
                      <span className="btn-glow"></span>
                    </button>
                  ) : isCurrent ? (
                    <div className="active-indicator">
                      <span>ACTIVE</span>
                    </div>
                  ) : (
                    <button
                      className="cyber-button use-btn"
                      onClick={() => setCurrentProduct(product)}
                    >
                      <span className="btn-text">ACTIVATE</span>
                      <span className="btn-glow"></span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "riskReduction" && (
        <div className="cyber-grid">
          {upgradeData.map((upgrade, index) => {
            const canAfford = money >= upgrade.cost;

            return (
              <div key={upgrade.name} className="cyber-card upgrade">
                <div className="card-header">
                  <h3 className="cyber-card-title">{upgrade.name}</h3>
                  <div className="card-corner"></div>
                </div>
                <div className="card-content">
                  <div className="cyber-stat">
                    <span className="stat-label">COST:</span>
                    <span className="stat-value">${upgrade.cost}</span>
                  </div>
                  <div className="cyber-stat">
                    <span className="stat-label">REDUCTION:</span>
                    <span className="stat-value">-{upgrade.reduction}%</span>
                  </div>
                  <div className="cyber-stat">
                    <span className="stat-label">LEVEL:</span>
                    <span className="stat-value">{upgrade.bought}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className={`cyber-button upgrade-btn ${canAfford ? "active" : ""}`}
                    disabled={!canAfford}
                    onClick={() => handleUpgrade(index)}
                  >
                    <span className="btn-text">UPGRADE</span>
                    <span className="btn-glow"></span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Progress;