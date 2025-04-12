import React, { useState } from "react";
import { useGame } from "../GameContext";
import "../styles/Progress.css";

const Progress: React.FC = () => {
  const {
    productList,
    unlocked,
    unlockProduct,
    currentProduct,
    setCurrentProduct,
    money,
    setMoney,
    riskGain,
    setRiskGain,
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
      setRiskGain(Math.max(0.1, riskGain - upgrade.reduction));
    }
  };

  return (
    <div className="progress-container">
      <h2>📈 Progress</h2>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`tab-button ${activeTab === "riskReduction" ? "active" : ""}`}
          onClick={() => setActiveTab("riskReduction")}
        >
          Risk Reduction
        </button>
      </div>

      {activeTab === "products" && (
        <div className="product-list">
          {productList.map((product) => {
            const isUnlocked = unlocked.includes(product.name);
            const isCurrent = currentProduct.name === product.name;
            const canUnlock = money >= product.unlockPrice;

            return (
              <div key={product.name} className={`progress-card ${!isUnlocked ? "locked" : ""}`}>
                <h3 className="neon-purple-name">{product.name}</h3>
                <p>Buy: ${product.buyPrice} / Sell: ${product.sellPrice}</p>
                {!isUnlocked && (
                  <button
                    disabled={!canUnlock}
                    onClick={() => handleUnlock(product)}
                  >
                    Unlock (${product.unlockPrice})
                  </button>
                )}
                {isUnlocked && !isCurrent && (
                  <button onClick={() => setCurrentProduct(product)}>Use</button>
                )}
                {isCurrent && <span className="current-label">In Use</span>}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "riskReduction" && (
        <div className="upgrade-list">
          {upgradeData.map((upgrade, index) => {
            const canAfford = money >= upgrade.cost;

            return (
              <div key={upgrade.name} className="upgrade-card">
                <h3 className="neon-purple-name">{upgrade.name}</h3>
                <p>Cost: ${upgrade.cost}</p>
                <p>Risk Gain Reduction: -{upgrade.reduction}% per action</p>
                <p>Current Level: {upgrade.bought}</p>
                <button
                  disabled={!canAfford}
                  onClick={() => handleUpgrade(index)}
                >
                  Buy Upgrade
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Progress;