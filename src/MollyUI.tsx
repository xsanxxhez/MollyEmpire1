import { useState, useEffect } from "react";
import "./MollyUI.css";
import { useGame } from "./GameContext";

const NeonRain = () => {
  useEffect(() => {
    const container = document.querySelector('.neon-rain-container');
    if (!container) return;

    const createDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'neon-drop';

      const left = Math.random() * 120;
      const duration = 3 + Math.random() * 3;
      const height = 15 + Math.random() * 30;
      const delay = Math.random() * 2;
      const opacity = 0.3 + Math.random() * 0.5;

      drop.style.left = `${left}%`;
      drop.style.height = `${height}px`;
      drop.style.animationDuration = `${duration}s`;
      drop.style.animationDelay = `${delay}s`;
      drop.style.width = `${0.4 + Math.random() * 1}px`;
      drop.style.opacity = `${opacity}`;

      const colors = ['#0fff50', '#00ffff', '#ff00ff', '#9d00ff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      drop.style.background = `linear-gradient(to bottom, ${color} 0%, transparent 100%)`;
      drop.style.boxShadow = `0 0 10px ${color}`;

      container.appendChild(drop);

      setTimeout(() => {
        drop.remove();
      }, (duration + delay) * 1000);
    };

    for (let i = 0; i < 100; i++) {
      setTimeout(createDrop, i * 100);
    }

    const interval = setInterval(createDrop, 150);
    return () => clearInterval(interval);
  }, []);

  return <div className="neon-rain-container"></div>;
};

const BinaryRain = () => {
  useEffect(() => {
    const container = document.querySelector('.binary-rain');
    if (!container) return;

    const chars = ['0', '1'];
    const drops: HTMLDivElement[] = [];

    const createDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'binary-digit';

      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = 5 + Math.random() * 10;
      const opacity = 0.1 + Math.random() * 0.6;
      const length = 5 + Math.floor(Math.random() * 15);

      let content = '';
      for (let i = 0; i < length; i++) {
        content += chars[Math.floor(Math.random() * chars.length)];
      }

      drop.textContent = content;
      drop.style.left = `${left}%`;
      drop.style.top = `-${length * 2}%`;
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

    for (let i = 0; i < 50; i++) {
      setTimeout(createDrop, i * 200);
    }

    const interval = setInterval(createDrop, 200);
    return () => clearInterval(interval);
  }, []);

  return <div className="binary-rain"></div>;
};

const FloatingNotification = ({ text, color, top, left }: { text: string; color: string; top: number; left: number }) => {
  return (
    <div
      className="floating-notification"
      style={{
        color,
        top: `${top}%`,
        left: `${left}%`,
        textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      }}
    >
      {text}
    </div>
  );
};

const MollyUI = () => {
  const {
    money,
    setMoney,
    currentProduct,
    dealers,
    setDealers,
    dealerCost,
    setDealerCost,
    dealerIncome,
    risk,
    setRisk,
    riskGain,
    productStock,
    setProductStock,
    securityUpgrades,
  } = useGame();

  const [showRaid, setShowRaid] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; color: string; top: number; left: number }>>([]);
  const [currentStock, setCurrentStock] = useState(0);

  const dealerEfficiency = 0.98;
  const dealerCostIncrease = 0.1;

  useEffect(() => {
    setCurrentStock(productStock[currentProduct.name] || 0);
  }, [currentProduct, productStock]);

  const addNotification = (text: string, color: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const left = 30 + Math.random() * 40;
    const top = 50 + Math.random() * 20;

    setNotifications(prev => [...prev, { id, text, color, top, left }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 2000);
  };

  const getPermanentRiskReduction = () => {
    return securityUpgrades
      .filter(u => u.type === 'permanent')
      .reduce((sum, upgrade) => sum + (upgrade.effect * upgrade.bought), 0);
  };

  const getEffectiveRiskGain = (baseGain: number) => {
    const reduction = getPermanentRiskReduction();
    return baseGain * (1 - Math.min(reduction, 0.9));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (dealers > 0) {
        const totalIncome = dealers * dealerIncome;
        setMoney((prev: number) => prev + totalIncome);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [dealers, dealerIncome, setMoney]);

  useEffect(() => {
    if (risk >= 100 && !showRaid) {
      setShowRaid(true);
    }
  }, [risk, showRaid]);

  const handleBuy = () => {
    if (money >= currentProduct.buyPrice) {
      setMoney(money - currentProduct.buyPrice);
      const newStock = currentStock + 1;
      setCurrentStock(newStock);
      setProductStock({
        ...productStock,
        [currentProduct.name]: newStock
      });
      setRisk(prev => Math.min(100, prev + getEffectiveRiskGain(riskGain) * currentProduct.riskMultiplier));
      addNotification(`+1 oz.`, '#0fff50');
    }
  };

  const handleSell = () => {
    if (currentStock > 0) {
      setMoney(money + currentProduct.sellPrice);
      const newStock = currentStock - 1;
      setCurrentStock(newStock);
      setProductStock({
        ...productStock,
        [currentProduct.name]: newStock
      });
      setRisk(prev => Math.min(100, prev + getEffectiveRiskGain(riskGain * 1.5) * currentProduct.riskMultiplier));
      addNotification(`+$${currentProduct.sellPrice.toFixed(2)}`, '#00ffff');
    }
  };

  const handleHireDealer = () => {
    if (money >= dealerCost) {
      setMoney(money - dealerCost);
      const newDealers = dealers + 1;
      setDealers(newDealers);
      const newDealerCost = dealerCost * (1 + dealerCostIncrease * newDealers);
      setDealerCost(newDealerCost);
      const riskIncrease = getEffectiveRiskGain(riskGain * 5) * Math.pow(dealerEfficiency, dealers);
      setRisk(prev => Math.min(100, prev + riskIncrease));
      addNotification('+1 Dealer', '#ff00ff');
    }
  };

  const handleDiscardProduct = () => {
    setCurrentStock(0);
    setProductStock({
      ...productStock,
      [currentProduct.name]: 0
    });
    setRisk(prev => Math.max(0, prev - 5));
    addNotification("Inventory cleared", '#ff0033');
  };

  const handleRaidResolution = () => {
    if (currentStock > 0) {
      const lost = money * 0.5;
      setMoney(money - lost);
      setCurrentStock(0);
      setProductStock({
        ...productStock,
        [currentProduct.name]: 0
      });
      addNotification(`-$${lost.toFixed(2)} RAID!`, '#ff0033');
    }
    setRisk(0);
    setShowRaid(false);
  };

  const dealerEfficiencyPercent = (100 * (1 - Math.pow(dealerEfficiency, dealers))).toFixed(1);

  return (
    <div className="molly-container">
      <NeonRain />
      <BinaryRain />

      <div className="notifications-container">
        {notifications.map(({ id, text, color, top, left }) => (
          <FloatingNotification key={id} text={text} color={color} top={top} left={left} />
        ))}
      </div>

      <div className="header-section">
        <h1 className="game-title">$MOLLY</h1>
        <span className="money-amount">{money.toFixed(2)}</span>
      </div>

      <div className="status-section">
        <div className="risk-header">
          <span className="status-title neon-risk">RISK METER</span>
          <span className="status-value">{risk.toFixed(0)}%</span>
        </div>
        <div className="risk-container">
          <div
            className="risk-bar"
            style={{ width: `${risk}%` }}
          />
        </div>

        <div className="dealers-header">
          <span className="status-title neon-dealers">DEALERS NETWORK</span>
        </div>
        <div className="dealers-container">
          <div className="dealers-bar">
            <span className="dealers-text">
              DEALERS: {dealers} (Eff: {dealerEfficiencyPercent}%)
            </span>
          </div>
        </div>
      </div>

      <div className="current-product">
        <h2 className="product-title">
          <span>{currentProduct.emoji}</span>
          {currentProduct.name}
        </h2>
        <div className="product-stats">
          <p>
            <span>In stock:</span>
            <strong>{currentStock} oz.</strong>
          </p>
          <p>
            <span>Buy:</span>
            <strong>${currentProduct.buyPrice.toFixed(2)}</strong>
            <span>Sell:</span>
            <strong>${currentProduct.sellPrice.toFixed(2)}</strong>
          </p>
        </div>
           <div className="action-buttons-container">
                <div className="action-buttons">
                  <button
                    className="action-btn buy-btn"
                    onClick={handleBuy}
                    disabled={money < currentProduct.buyPrice}
                  >
                    Buy 1 oz. (${currentProduct.buyPrice.toFixed(2)})
                  </button>
                  <button
                    className="action-btn sell-btn"
                    onClick={handleSell}
                    disabled={currentStock <= 0}
                  >
                    Sell 1 oz. (+${currentProduct.sellPrice.toFixed(2)})
                  </button>
                  <button
                    className="action-btn dealer-btn"
                    onClick={handleHireDealer}
                    disabled={money < dealerCost}
                  >
                    Hire dealer (${dealerCost.toFixed(2)})
                  </button>
                  <button
                    className="action-btn discard-btn"
                    onClick={handleDiscardProduct}
                    disabled={currentStock <= 0}
                  >
                    Discard Product
                  </button>
                  <button
                    className="action-btn stats-btn"
                    onClick={() => setShowStats(true)}
                  >
                    Statistics
                  </button>
                </div>
              </div>
            </div>



      {showStats && (
        <div className="stats-modal">
          <div className="stats-content">
            <h3 className="stats-title">📊 STATISTICS</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label neon-green">TOTAL MONEY:</span>
                <span className="stat-value neon-pulse-green">${money.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label neon-blue">INCOME/MIN:</span>
                <span className="stat-value neon-pulse-blue">
                  ${(dealers * dealerIncome * 60).toFixed(2)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label neon-purple">CURRENT DRUG:</span>
                <span className="stat-value">{currentProduct.name}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label neon-green">STOCK:</span>
                <span className="stat-value">{currentStock} oz.</span>
              </div>
              <div className="stat-item">
                <span className="stat-label neon-yellow">RISK REDUCTION:</span>
                <span className="stat-value">{Math.round(getPermanentRiskReduction() * 100)}%</span>
              </div>
            </div>
            <button
              className="action-btn close-btn"
              onClick={() => setShowStats(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {showRaid && (
        <div className="raid-modal">
          <div className="raid-content">
            <h3>🚔 Police Raid!</h3>
            {currentStock > 0 ? (
              <>
                <p>The police found your staff!</p>
                <p>You lose <strong>all your drugs</strong> and <strong>50% of your money.</strong></p>
              </>
            ) : (
              <>
                <p>The police found nothing suspicious.</p>
                <p>You were lucky this time. Just a warning.</p>
              </>
            )}
            <button
              className="action-btn raid-btn"
              onClick={handleRaidResolution}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MollyUI;