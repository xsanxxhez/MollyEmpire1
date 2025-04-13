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
      const animationDuration = 5 + Math.random() * 0;

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
    setCurrentProduct,
    productList,
    staff,
    setStaff,
    dealers,
    setDealers,
    dealerCost,
    setDealerCost,
    risk,
    setRisk,
    riskGain,
    productStock,
    setProductStock,
    unlocked,
  } = useGame();

  const [showRaid, setShowRaid] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<FloatingNotification[]>([]);
  const [currentStock, setCurrentStock] = useState<number>(0);

  // Синхронизация текущего количества товара при смене продукта
  useEffect(() => {
    setCurrentStock(productStock[currentProduct.name] || 0);
  }, [currentProduct, productStock]);

  const buyPrice = currentProduct.buyPrice;
  const sellPrice = currentProduct.sellPrice;

  const dealerIncomePerSecond = 0.1;
  const dealerPriceGrowthRate = 1.15;
  const incomePerMinute = dealers * dealerIncomePerSecond * 60;

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

  const handleProductChange = (product: typeof currentProduct) => {
    if (unlocked.includes(product.name)) {
      setCurrentProduct(product);
      // При смене товара сохраняем текущее количество в productStock
      setProductStock({
        ...productStock,
        [currentProduct.name]: currentStock
      });
      // И загружаем количество для нового товара
      setCurrentStock(productStock[product.name] || 0);
    }
  };

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
        <div className="title-money-wrapper">
          <h1 className="game-title">$MOLLY <span className="money-amount">{money.toFixed(2)}</span></h1>
        </div>
      </div>

      <div className="status-section">
        <div className="risk-header">
          <span className="status-title neon-risk">RISK METER</span>
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
            <span className="dealers-text">DEALERS: {dealers}</span>
          </div>
        </div>
      </div>

      <div className="current-product">
        

        <h2 className="product-title neon-purple-name">{currentProduct.emoji} {currentProduct.name}</h2>
        <div className="product-stats">
          <p>In stock: <strong>{currentStock} oz.</strong></p>
          <p>Buy: <strong>${buyPrice.toFixed(2)}</strong> / Sell: <strong>${sellPrice.toFixed(2)}</strong></p>
        </div>
        <div className="action-buttons">
          <button
            className="action-btn buy-btn"
            onClick={handleBuy}
            disabled={money < buyPrice}
          >
            Buy 1 oz. (${buyPrice.toFixed(2)})
          </button>
          <button
            className="action-btn sell-btn"
            onClick={handleSell}
            disabled={currentStock <= 0}
          >
            Sell 1 oz. (+${sellPrice.toFixed(2)})
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
                <span className="stat-value neon-pulse-blue">${incomePerMinute.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label neon-purple">REFERRALS:</span>
                <span className="stat-value neon-pulse-purple">0</span>
              </div>
            </div>
            <button
              className="action-btn close-btn neon-hover"
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
                <p>The police found your stash!</p>
                <p>You lose <strong>all your drugs</strong> and <strong>50% of your money.</strong></p>
              </>
            ) : (
              <>
                <p>The police found nothing suspicious.</p>
                <p>You were lucky this time. Just a warning.</p>
              </>
            )}
            <button className="action-btn raid-btn" onClick={handleRaidResolution}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MollyUI;