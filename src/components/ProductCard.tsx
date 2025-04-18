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
  } = useGame();

  return (
    <div className="progress-container">
      <h2>📈 Progress</h2>
      <div className="product-list">
        {productList.map((product) => {
          const isUnlocked = unlocked.includes(product.name);
          const isCurrent = currentProduct.name === product.name;
          const canUnlock = money >= product.unlockPrice;

          return (
            <div
              key={product.name}
              className={`progress-card ${!isUnlocked ? "locked" : ""}`}
            >
              <h3>{product.name}</h3>
              <p>Buy: ${product.buyPrice} / Sell: ${product.sellPrice}</p>

              {!isUnlocked ? (
                <button
                  disabled={!canUnlock}
                  onClick={() => unlockProduct(product.name)}
                >
                  Unlock (${product.unlockPrice})
                </button>
              ) : isCurrent ? (
                <span className="current-label">In Use</span>
              ) : (
                <button onClick={() => setCurrentProduct(product)}>Use</button>
              )}
            </div>
          );
        })}
      </div>
    </div> //гааыгрмышгм
  );
};

export default Progress;
