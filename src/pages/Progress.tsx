import { useState, useEffect, useRef } from "react";
import { useGame } from "../GameContext";
import "../styles/Progress.css";

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = Array.from({length: 30}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    }));

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 0.2;

      particles.forEach((p1, i) => {
        p1.x += p1.dx;
        p1.y += p1.dy;
        if (p1.x < 0 || p1.x > canvas.width) p1.dx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.dy *= -1;

        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-background" />;
};

const BinaryRain = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = ['0', '1'];
    const drops: HTMLDivElement[] = [];

    const createDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'binary-digit';

      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 3 + Math.random() * 5;
      const opacity = 0.1 + Math.random() * 0.3;
      const length = 3 + Math.floor(Math.random() * 5);

      drop.textContent = Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      drop.style.left = `${left}%`;
      drop.style.animationDuration = `${duration}s`;
      drop.style.animationDelay = `${delay}s`;
      drop.style.opacity = `${opacity}`;

      container.appendChild(drop);
      drops.push(drop);

      setTimeout(() => {
        drop.remove();
        drops.splice(drops.indexOf(drop), 1);
      }, (duration + delay) * 1000);
    };

    const interval = setInterval(createDrop, 300);
    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className="binary-rain" />;
};

const Progress = () => {
  const {
    productList,
    unlocked,
    unlockProduct,
    currentProduct,
    setCurrentProduct,
    money,
    setMoney,
    productStock,
    dealers,
    setDealers,
    dealerIncome,
    setDealerIncome,
    dealerCost,
    setDealerCost,
    setRisk,
    riskGain,
    securityUpgrades,
    setSecurityUpgrades,
    dealerUpgrades,
    setDealerUpgrades,
    saveGame,
  } = useGame();

  const [activeTab, setActiveTab] = useState<"products" | "riskReduction" | "dealers">("products");

  const handleUnlock = (product: { name: string; unlockPrice: number }) => {
    if (money >= product.unlockPrice) {
      setMoney(money - product.unlockPrice);
      unlockProduct(product.name);
      saveGame();
    }
  };

  const handleUpgrade = (index: number) => {
    const upgrade = securityUpgrades[index];
    if (money >= upgrade.cost) {
      setMoney(money - upgrade.cost);

      const updatedUpgrades = [...securityUpgrades];
      updatedUpgrades[index] = {
        ...updatedUpgrades[index],
        bought: updatedUpgrades[index].bought + 1,
        cost: Math.floor(upgrade.cost * upgrade.costMultiplier),
        type: upgrade.type, // Сохраняем тип
        effect: upgrade.effect // Сохраняем эффект
      };

      setSecurityUpgrades(updatedUpgrades);

      if (upgrade.type === 'instant') {
        setRisk(prev => Math.max(0, prev - upgrade.effect));
      }

      saveGame();
    }
  };

 const handleDealerUpgrade = (index: number) => {
   const upgrade = dealerUpgrades[index];
   const isMaxLevel = upgrade.maxLevel !== undefined && upgrade.bought >= upgrade.maxLevel;

   if (money >= upgrade.cost && !isMaxLevel) {
     setMoney(money - upgrade.cost);

     const updatedUpgrades = [...dealerUpgrades];
     updatedUpgrades[index] = {
       ...updatedUpgrades[index],
       bought: updatedUpgrades[index].bought + 1,
       cost: Math.floor(upgrade.cost * upgrade.costMultiplier),
       maxLevel: upgrade.maxLevel, // Сохраняем maxLevel
       incomeMultiplier: upgrade.incomeMultiplier,
       riskReduction: upgrade.riskReduction
     };

     setDealerUpgrades(updatedUpgrades);

     if (upgrade.incomeMultiplier) {
       setDealerIncome(prev => prev * (1 + upgrade.incomeMultiplier!));
     }

     saveGame();
   }
 };

  const hireDealer = () => {
    if (money >= dealerCost) {
      setMoney(money - dealerCost);
      setDealers(dealers + 1);
      setDealerCost(prev => Math.floor(prev * 1.1));
      setRisk(prev => Math.min(100, prev + riskGain * 1.5));
      saveGame();
    }
  };

  const handleTabSwitch = (tab: "products" | "riskReduction" | "dealers") => {
    setActiveTab(tab);
  };

  const calculateTotalDealerIncome = () => {
    let baseIncome = dealerIncome;
    let multiplier = 1;

    dealerUpgrades.forEach(upgrade => {
      if (upgrade.incomeMultiplier) {
        multiplier += upgrade.incomeMultiplier * upgrade.bought;
      }
      if (upgrade.efficiency) {
        multiplier += upgrade.efficiency * upgrade.bought;
      }
    });

    return dealers * baseIncome * multiplier;
  };

  const totalDealerIncome = calculateTotalDealerIncome();

  return (
    <div className="progress-container">
      <MatrixBackground />
      <BinaryRain />

      <div className="progress-content">
        <div className="cyber-header">
          <h2 className="glitch" data-text="PROGRESS MATRIX">PROGRESS MATRIX</h2>
          <div className="scanline"></div>
        </div>

        <div className="cyber-tabs">
          <button
            className={`cyber-tab ${activeTab === "products" ? "active" : ""}`}
            onClick={() => handleTabSwitch("products")}
          >
            <span className="cyber-tab-text">PRODUCT DATABASE</span>
            <span className="cyber-tab-glow"></span>
          </button>
          <button
            className={`cyber-tab ${activeTab === "riskReduction" ? "active" : ""}`}
            onClick={() => handleTabSwitch("riskReduction")}
          >
            <span className="cyber-tab-text">SECURITY UPGRADES</span>
            <span className="cyber-tab-glow"></span>
          </button>
          <button
            className={`cyber-tab ${activeTab === "dealers" ? "active" : ""}`}
            onClick={() => handleTabSwitch("dealers")}
          >
            <span className="cyber-tab-text">DEALER NETWORK</span>
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
                    <div className="cyber-stat">
                      <span className="stat-label">RISK:</span>
                      <span className="stat-value">
                        {product.riskMultiplier < 0.5 ? 'LOW' :
                         product.riskMultiplier < 1.5 ? 'MEDIUM' : 'HIGH'}
                      </span>
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
            {securityUpgrades.map((upgrade, index) => {
              const canAfford = money >= upgrade.cost;
              const isPermanent = upgrade.type === 'permanent';
              const effectText = isPermanent
                ? `-${(upgrade.effect * 100).toFixed(0)}% risk gain`
                : `-${upgrade.effect} risk points`;

              return (
                <div key={upgrade.name} className={`cyber-card upgrade ${isPermanent ? 'permanent' : 'instant'}`}>
                  <div className="card-header">
                    <h3 className="cyber-card-title">{upgrade.name}</h3>
                    <div className="card-corner"></div>
                  </div>
                  <div className="card-content">
                    <div className="cyber-stat">
                      <span className="stat-label">TYPE:</span>
                      <span className="stat-value">
                        {isPermanent ? 'PERMANENT' : 'INSTANT'}
                      </span>
                    </div>
                    <div className="cyber-stat">
                      <span className="stat-label">EFFECT:</span>
                      <span className="stat-value">{effectText}</span>
                    </div>
                    <div className="cyber-stat">
                      <span className="stat-label">COST:</span>
                      <span className="stat-value">${upgrade.cost.toLocaleString()}</span>
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

        {activeTab === "dealers" && (
          <div className="dealer-network">
            <div className="cyber-grid dealer-upgrades-grid">
              {dealerUpgrades.map((upgrade, index) => {
                const canAfford = money >= upgrade.cost;
                const isMaxed = upgrade.maxLevel !== undefined && upgrade.bought >= upgrade.maxLevel;

                return (
                  <div key={upgrade.name} className="cyber-card dealer-upgrade">
                    <div className="card-header">
                      <span className="dealer-icon">{upgrade.icon}</span>
                      <h3 className="cyber-card-title">{upgrade.name}</h3>
                      <div className="card-corner"></div>
                    </div>
                    <div className="card-content">
                      <div className="upgrade-description">
                        {upgrade.description}
                      </div>
                      <div className="cyber-stat">
                        <span className="stat-label">COST:</span>
                        <span className="stat-value">${upgrade.cost.toLocaleString()}</span>
                      </div>
                      <div className="cyber-stat">
                        <span className="stat-label">LEVEL:</span>
                        <span className="stat-value">
                          {upgrade.bought}/{upgrade.maxLevel || '∞'}
                          {isMaxed && <span className="maxed-label">MAXED</span>}
                        </span>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button
                        className={`cyber-button upgrade-btn ${canAfford && !isMaxed ? "active" : ""}`}
                        disabled={!canAfford || isMaxed}
                        onClick={() => handleDealerUpgrade(index)}
                      >
                        <span className="btn-text">
                          {isMaxed ? "MAXED" : "UPGRADE"}
                        </span>
                        <span className="btn-glow"></span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="dealer-hire-section">
              <button
                className="cyber-button hire-btn"
                onClick={hireDealer}
                disabled={money < dealerCost}
              >
                <span className="btn-text">HIRE DEALER (${dealerCost.toLocaleString()})</span>
                <span className="btn-glow"></span>
              </button>
              <div className="dealer-income-info">
                <span>Current income: ${totalDealerIncome.toFixed(2)}/sec</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;