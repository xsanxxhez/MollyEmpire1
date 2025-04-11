import React, { useState, useEffect } from "react";
import "./MollyUI.css";
import { useGame } from "./GameContext";

const MollyUI: React.FC = () => {
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

  const [totalEarned, setTotalEarned] = useState(money);
  const [totalSold, setTotalSold] = useState(0);
  const [referrals] = useState(3);
  const [risk, setRisk] = useState(0);
  const [showRaid, setShowRaid] = useState(false);
  const [showStats, setShowStats] = useState(false);

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
  }, [dealers]);

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
      setMoney(prev => prev + sellPrice);
      setTotalEarned(prev => prev + sellPrice);
      setStaff(prev => prev - 1);
      setTotalSold(prev => prev + 1);
      setRisk(prev => prev + 2);
    }
  };

  const handleHireDealer = () => {
    if (money >= dealerCost) {
      setMoney(prev => prev - dealerCost);
      setDealers(prev => prev + 1);
      setDealerCost(prev => parseFloat((prev * dealerPriceGrowthRate).toFixed(2)));
      setRisk(prev => prev + 5);
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

  const incomePerMinute = (dealers * dealerIncomePerSecond * 60).toFixed(2);

  return (
    <div className="molly-container">
      <div className="molly-header-column">
        <div className="molly-header-top-row">
          <div className="molly-title neon-glow flicker">$MOLLY</div>
          <div className="money-counter neon-glow">${money.toFixed(2)}</div>
        </div>

        <div className="info-blocks">
          <button className="info-card neon-block" onClick={() => setShowStats(!showStats)}>
            📊 Stats: <span>{totalSold}</span>
          </button>
          <div className="info-card neon-block">
            ☣ Risk: <span className={risk >= 50 ? "danger" : ""}>{risk}%</span>
          </div>
          <div className="info-card neon-block">
            👥 Dealers: <span>{dealers}</span>
          </div>
        </div>
      </div>

      <div className="drug-info">
        <div className="drug-title">{productEmoji} <span>{productName}</span></div>
        <p>Your stock: <span>{staff} units</span></p>
        <p>Buy: <span>{buyPrice}</span> / Sell: <span>{sellPrice}</span></p>
      </div>

      <button className="action-button green" onClick={handleBuy} disabled={money < buyPrice}>
        Buy 1 unit ({buyPrice})
      </button>

      <button className="action-button blue" onClick={handleSell} disabled={staff <= 0}>
        Sell 1 unit (+{sellPrice})
      </button>

      <button className="action-button pink" onClick={handleHireDealer} disabled={money < dealerCost}>
        Hire dealer (${dealerCost.toFixed(2)})
      </button>

      {showStats && (
        <div className="stats-window">
          <h3>📊 Stats</h3>
          <p>Total earned: <strong>${totalEarned.toFixed(2)}</strong></p>
          <p>Total sold: <strong>{totalSold} units</strong></p>
          <p>Dealers hired: <strong>{dealers}</strong></p>
          <p>Referrals: <strong>{referrals}</strong></p>
          <p>Income per minute: <strong>${incomePerMinute}</strong></p>
        </div>
      )}

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
            <button className="action-button red" onClick={handleRaidResolution}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MollyUI;
