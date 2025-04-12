import React from "react";
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
    setMoney
  } = useGame();

  const handleUnlock = (product: { name: string; unlockPrice: number }) => {
    if (money >= product.unlockPrice) {
      setMoney(money - product.unlockPrice);
      unlockProduct(product.name);
    }
  };

  return (
    <div className="progress-container">
      <h2>📈 Progress</h2>
      <div className="product-list">
        {productList.map((product) => {
          const isUnlocked = unlocked.includes(product.name);
          const isCurrent = currentProduct.name === product.name;
          const canUnlock = money >= product.unlockPrice;

          return (
            <div key={product.name} className={`progress-card ${!isUnlocked ? "locked" : ""}`}>
              <h3>{product.name}</h3>
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
    </div>
  );
};

export default Progress;