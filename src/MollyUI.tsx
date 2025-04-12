import { useState, useEffect } from "react";
import "./MollyUI.css";
import { useGame } from "./GameContext";

interface BinaryDigit {
  id: string;
  digit: string;
  left: number;
  duration: number;
}

const BinaryRain = () => {
  const [digits, setDigits] = useState<BinaryDigit[]>([]);

  useEffect(() => {
    const createDigit = (): BinaryDigit => {
      const digit = Math.random() > 0.5 ? '1' : '0';
      const left = Math.random() * 100;
      const animationDuration = 5 + Math.random() * 10;

      return {
        id: Math.random().toString(36).substr(2, 9),
        digit,
        left,
        duration: animationDuration
      };
    };

    const interval = setInterval(() => {
      setDigits(prev => [...prev.slice(-50), createDigit()]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="binary-code">
      {digits.map(({id, digit, left, duration}) => (
        <div
          key={id}
          className="binary-digit"
          style={{
            left: `${left}%`,
            animationDuration: `${duration}s`,
            top: '-20px'
          }}
        >
          {digit}
        </div>
      ))}
    </div>
  );
};

const MollyUI = () => {
  const {
    money,
    setMoney,
    currentProduct,
    staff,
    setStaff,
    dealers,
    setDealers,
    dealerCost,
    setDealerCost,
  } = useGame();

  const [totalEarned, setTotalEarned] = useState<number>(money);
  const [totalSold, setTotalSold] = useState<number>(0);
  const [risk, setRisk] = useState<number>(0);
  const [showRaid, setShowRaid] = useState<boolean>(false);

  const buyPrice = currentProduct.buyPrice;
  const sellPrice = currentProduct.sellPrice;
  const productName = currentProduct.name;
  const productEmoji = currentProduct.emoji;

  const dealerIncomePerSecond = 0.1;
  const dealerPriceGrowthRate = 1.15;

  useEffect(() => {
    const interval = setInterval(() => {
      const income = dealers * dealerIncomePerSecond;
      setMoney(prev => prev + income);
      setTotalEarned(prev => prev + income);
    }, 1000);
    return () => clearInterval(interval);
  }, [dealers, setMoney]);

  useEffect(() => {
    if (risk >= 100 && !showRaid) {
      setShowRaid(true);
    }
  }, [risk, showRaid]);

  const handleBuy = () => {
    if (money >= buyPrice) {
      setMoney(money - buyPrice);
      setStaff(staff + 1);
    }
  };

  const handleSell = () => {
    if (staff > 0) {
      setMoney(money + sellPrice);
      setTotalEarned(totalEarned + sellPrice);
      setStaff(staff - 1);
      setTotalSold(totalSold + 1);
      setRisk(risk + 2);
    }
  };

  const handleHireDealer = () => {
    if (money >= dealerCost) {
      setMoney(money - dealerCost);
      setDealers(dealers + 1);
      setDealerCost(parseFloat((dealerCost * dealerPriceGrowthRate).toFixed(2)));
      setRisk(risk + 5);
    }
  };

  const handleRaidResolution = () => {
    if (staff > 0) {
      const lost = money * 0.5;
      setMoney(money - lost);
      setStaff(0);
    }
    setRisk(0);
    setShowRaid(false);
  };

  return (
    <div className="molly-container">
      <BinaryRain />

      <div className="header-section">
        <div className="title-money-wrapper">
          <h1 className="game-title">$MOLLY <span className="money-amount">${money.toFixed(2)}</span></h1>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-label">Risk:</span>
            <span className={`stat-value ${risk >= 50 ? "danger" : ""}`}>{risk}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Dealers:</span>
            <span className="stat-value">{dealers}</span>
          </div>
        </div>
      </div>

      <div className="current-product">
        <h2 className="product-title">{productEmoji} {productName}</h2>
        <div className="product-stats">
          <p>In stock: <strong>{staff} units</strong></p>
          <p>Buy: <strong>${buyPrice.toFixed(2)}</strong> / Sell: <strong>${sellPrice.toFixed(2)}</strong></p>
        </div>

        <div className="action-buttons">
          <button
            className="action-btn buy-btn"
            onClick={handleBuy}
            disabled={money < buyPrice}
          >
            Buy 1 unit (${buyPrice.toFixed(2)})
          </button>
          <button
            className="action-btn sell-btn"
            onClick={handleSell}
            disabled={staff <= 0}
          >
            Sell 1 unit (+${sellPrice.toFixed(2)})
          </button>
          <button
            className="action-btn dealer-btn"
            onClick={handleHireDealer}
            disabled={money < dealerCost}
          >
            Hire dealer (${dealerCost.toFixed(2)})
          </button>
        </div>
      </div>

      {showRaid && (
        <div className="raid-modal">
          <div className="raid-content">
            <h3>🚔 Police Raid!</h3>
            {staff > 0 ? (
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