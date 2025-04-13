// MollyUI.tsx
import { useState, useEffect } from "react";
import "./MollyUI.css";
import { useGame } from "./GameContext";

interface BinaryDigit {
  id: string;
  digit: string;
  left: number;
  duration: number;
}

interface FloatingNotification {
  id: string;
  text: string;
  color: string;
  top: number;
  left: number;
}

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

      container.appendChild(drop);

      setTimeout(() => {
        drop.remove();
      }, (duration + delay) * 1000);
    };

    for (let i = 0; i < 150; i++) {
      setTimeout(createDrop, i * 100);
    }

    const interval = setInterval(createDrop, 150);

    return () => clearInterval(interval);
  }, []);

  return <div className="neon-rain-container"></div>;
};

const BinaryRain = () => {
  const [digits, setDigits] = useState<BinaryDigit[]>([]);

  useEffect(() => {
    const createDigit = (): BinaryDigit => {
      const digit = Math.random() > 0.5 ? '1' : '0';
      const left = Math.random() * 100;
      const animationDuration = 5 + Math.random() * 10;

      return {
        id: Math.random().toString(36).substring(2, 9),
        digit,
        left,
        duration: animationDuration,
      };
    };

    const interval = setInterval(() => {
      setDigits(prevDigits => [...prevDigits.slice(-50), createDigit()]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="binary-code">
      {digits.map(({ id, digit, left, duration }) => (
        <div
          key={id}
          className="binary-digit"
          style={{
            left: `${left}%`,
            animationDuration: `${duration}s`,
            top: '-10000000px',
          }}
        >
          {digit}
        </div>
      ))}
    </div>
  );
};

const FloatingNotification = ({ text, color, top, left }: { text: string; color: string; top: number; left: number }) => {
  return (
    <div
      className="floating-notification"
      style={{
        color,
        top: `${top}%`,
        left: `${left}%`,
        textShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
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
    risk,
    setRisk,
    riskGain,
    productStock,
    setProductStock,
  } = useGame();

  const [showRaid, setShowRaid] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<FloatingNotification[]>([]);
  const [currentStock, setCurrentStock] = useState<number>(0);

  useEffect(() => {
    setCurrentStock(productStock[currentProduct.name] || 0);
  }, [currentProduct, productStock]);

  const buyPrice = currentProduct.buyPrice;
  const sellPrice = currentProduct.sellPrice;

  const dealerIncomePerSecond = 0.1;
  const dealerPriceGrowthRate = 1.15;

  const addNotification = (text: string, color: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const left = 40 + Math.random() * 20;
    const top = 40 + Math.random() * 10;

    setNotifications(prev => [...prev, { id, text, color, top, left }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const income = dealers * dealerIncomePerSecond;
      setMoney(money + income);
    }, 1000);
    return () => clearInterval(interval);
  }, [dealers, money, setMoney]);

  useEffect(() => {
    if (risk >= 100 && !showRaid) {
      setShowRaid(true);
    }
  }, [risk, showRaid]);

  const handleBuy = () => {
    if (money >= buyPrice) {
      setMoney(money - buyPrice);
      const newStock = currentStock + 1;
      setCurrentStock(newStock);
      setProductStock({
        ...productStock,
        [currentProduct.name]: newStock
      });
      setRisk(Math.min(100, risk + riskGain));
      addNotification(`+1 oz.`, '#0fff50');
    }
  };

  const handleSell = () => {
    if (currentStock > 0) {
      setMoney(money + sellPrice);
      const newStock = currentStock - 1;
      setCurrentStock(newStock);
      setProductStock({
        ...productStock,
        [currentProduct.name]: newStock
      });
      setRisk(Math.min(100, risk + riskGain * 2));
      addNotification(`+$${sellPrice.toFixed(2)}`, '#00ffff');
    }
  };

  const handleHireDealer = () => {
    if (money >= dealerCost) {
      setMoney(money - dealerCost);
      setDealers(dealers + 1);
      setDealerCost(parseFloat((dealerCost * dealerPriceGrowthRate).toFixed(2)));
      setRisk(Math.min(100, risk + riskGain * 5));
      addNotification('+1 Dealer', '#ff00ff');
    }
  };

  const handleDiscardProduct = () => {
    setCurrentStock(0);
    setProductStock({
      ...productStock,
      [currentProduct.name]: 0
    });
    setRisk(Math.max(0, risk - 5));
    addNotification("All products discarded", '#ff0033');
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
    }
    setRisk(0);
    setShowRaid(false);
  };

  return (
    <div className="molly-container">
      <NeonRain />
      <BinaryRain />
      <div className="neon-grid-container"></div>

      <div className="notifications-container">
        {notifications.map(({ id, text, color, top, left }) => (
          <FloatingNotification key={id} text={text} color={color} top={top} left={left} />
        ))}
      </div>

      <div className="header-section hologram">
        <div className="title-money-wrapper">
          <h1 className="game-title glitch" data-text={`$MOLLY ${money.toFixed(2)}`}>
            $MOLLY <span className="money-amount">{money.toFixed(2)}</span>
          </h1>
        </div>
      </div>

      <div className="status-section">
        <div className="risk-header">
          <span className="status-title neon-risk glitch" data-text="RISK METER">RISK METER</span>
        </div>
        <div className="risk-container">
          <div className="scan-line"></div>
          <div
            className="risk-bar"
            style={{ width: `${risk}%` }}
          />
        </div>

        <div className="dealers-header">
          <span className="status-title neon-dealers glitch" data-text="DEALERS NETWORK">DEALERS NETWORK</span>
        </div>
        <div className="dealers-container">
          <div className="scan-line reverse"></div>
          <div className="dealers-bar">
            <span className="dealers-text glitch" data-text={`DEALERS: ${dealers}`}>DEALERS: {dealers}</span>
          </div>
        </div>
      </div>

      <div className="current-product hologram">
        <h2 className="product-title neon-purple-name glitch" data-text={`${currentProduct.emoji} ${currentProduct.name}`}>
          {currentProduct.emoji} {currentProduct.name}
        </h2>
        <div className="product-stats">
          <p>In stock: <strong className="neon-pulse-green">{currentStock} oz.</strong></p>
          <p>Buy: <strong className="neon-pulse-blue">${currentProduct.buyPrice.toFixed(2)}</strong> / Sell: <strong className="neon-pulse-purple">${currentProduct.sellPrice.toFixed(2)}</strong></p>
        </div>
        <div className="action-buttons">
          <button
            className="action-btn buy-btn cyber-button"
            onClick={handleBuy}
            disabled={money < currentProduct.buyPrice}
          >
            <span className="btn-glitch">BUY 1 oz. (${currentProduct.buyPrice.toFixed(2)})</span>
            <span className="btn-background"></span>
          </button>
          <button
            className="action-btn sell-btn cyber-button"
            onClick={handleSell}
            disabled={currentStock <= 0}
          >
            <span className="btn-glitch">SELL 1 oz. (+${currentProduct.sellPrice.toFixed(2)})</span>
            <span className="btn-background"></span>
          </button>
          <button
            className="action-btn dealer-btn cyber-button"
            onClick={handleHireDealer}
            disabled={money < dealerCost}
          >
            <span className="btn-glitch">Hire dealer (${dealerCost.toFixed(2)})</span>
            <span className="btn-background"></span>
          </button>
          <button
            className="action-btn discard-btn cyber-button"
            onClick={handleDiscardProduct}
          >
            <span className="btn-glitch">Discard Product</span>
            <span className="btn-background"></span>
          </button>
          <button
            className="action-btn stats-btn cyber-button"
            onClick={() => setShowStats(true)}
          >
            <span className="btn-glitch">Statistics</span>
            <span className="btn-background"></span>
          </button>
        </div>
      </div>

      {showStats && (
        <div className="stats-modal">
          <div className="stats-content hologram">
            <h3 className="stats-title glitch" data-text="📊 STATISTICS">📊 STATISTICS</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label neon-green">TOTAL MONEY:</span>
                <span className="stat-value neon-pulse-green">${money.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label neon-blue">INCOME/MIN:</span>
                <span className="stat-value neon-pulse-blue">${(dealers * dealerIncomePerSecond * 60).toFixed(2)}</span>
              </div>
            </div>
            <button
              className="action-btn close-btn cyber-button neon-hover"
              onClick={() => setShowStats(false)}
            >
              <span className="btn-glitch">CLOSE</span>
              <span className="btn-background"></span>
            </button>
          </div>
        </div>
      )}

      {showRaid && (
        <div className="raid-modal">
          <div className="raid-content hologram">
            <h3 className="glitch" data-text="🚔 Police Raid!">🚔 Police Raid!</h3>
            {currentStock > 0 ? (
              <>
                <p>The police found your stash!</p>
                <p>You lose <strong>all your drugs</strong> and <strong>50% of your money.</strong></p>
              </>
            ) : (
              <>
                <p>The police found nothing suspicious.</p>
                <p>You were lucky this time. Just a warning.</p>
              </>
            )}
            <button className="action-btn raid-btn cyber-button" onClick={handleRaidResolution}>
              <span className="btn-glitch">Continue</span>
              <span className="btn-background"></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MollyUI;