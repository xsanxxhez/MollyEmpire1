import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  name: string;
  unlockPrice: number;
  buyPrice: number;
  sellPrice: number;
  emoji: string;
}

const productList: Product[] = [
  { name: "BrainBooster3000", unlockPrice: 0, buyPrice: 0.5, sellPrice: 1, emoji: "🧠" },
  { name: "Chill Pill 5001", unlockPrice: 50, buyPrice: 12, sellPrice: 15, emoji: "💊" },
  { name: "Dinosaur Tranquilizer", unlockPrice: 180, buyPrice: 35, sellPrice: 40, emoji: "🦖" },
  { name: "Weed", unlockPrice: 650, buyPrice: 50, sellPrice: 67.5, emoji: "🍁" },
  { name: "mdma", unlockPrice: 1580, buyPrice: 140, sellPrice: 180, emoji: "✨" },
  { name: "Doggy Gas", unlockPrice: 7100, buyPrice: 300, sellPrice: 385, emoji: "🐶" },
  { name: "Doggy Gas 2.0", unlockPrice: 14000, buyPrice: 500, sellPrice: 655, emoji: "🐶⚡" },
  { name: "Do not sniff it", unlockPrice: 40000, buyPrice: 800, sellPrice: 1130, emoji: "☠️" },
  { name: "Cocaine", unlockPrice: 120000, buyPrice: 1800, sellPrice: 2500, emoji: "❄️" },
  { name: "Heroin", unlockPrice: 150000, buyPrice: 2000, sellPrice: 2800, emoji: "💉" },
  { name: "Gravel42", unlockPrice: 375000, buyPrice: 5500, sellPrice: 7900, emoji: "🪨" },
  { name: "Hollow", unlockPrice: 1000000, buyPrice: 12000, sellPrice: 20000, emoji: "🕳️" },
  { name: "HeroinMod", unlockPrice: 2500000, buyPrice: 25000, sellPrice: 45000, emoji: "💉⚡" },
  { name: "MindKiller", unlockPrice: 10000000, buyPrice: 100000, sellPrice: 150000, emoji: "🧠💀" },
];

interface GameContextType {
  money: number;
  setMoney: (v: number) => void;
  unlocked: string[];
  unlockProduct: (name: string) => void;
  currentProduct: Product;
  setCurrentProduct: (p: Product) => void;
  productList: Product[];

  staff: number;
  setStaff: (v: number) => void;
  dealers: number;
  setDealers: (v: number) => void;
  dealerCost: number;
  setDealerCost: (v: number) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedData = JSON.parse(localStorage.getItem("game-data") || "{}");

  const [money, setMoneyState] = useState<number>(savedData.money ?? 1);
  const [unlocked, setUnlocked] = useState<string[]>(savedData.unlocked ?? ["BrainBooster3000"]);
  const [currentProduct, setCurrentProduct] = useState<Product>(
    productList.find(p => p.name === savedData.currentProduct) || productList[0]
  );
  const [staff, setStaff] = useState<number>(savedData.staff ?? 0);
  const [dealers, setDealers] = useState<number>(savedData.dealers ?? 0);
  const [dealerCost, setDealerCost] = useState<number>(savedData.dealerCost ?? 3);

  const setMoney = (v: number) => setMoneyState(v);

  const unlockProduct = (name: string) => {
    if (!unlocked.includes(name)) {
      setUnlocked(prev => [...prev, name]);
    }
  };

  // 💾 Сохраняем при изменениях
  useEffect(() => {
    localStorage.setItem(
      "game-data",
      JSON.stringify({
        money,
        unlocked,
        currentProduct: currentProduct.name,
        staff,
        dealers,
        dealerCost,
      })
    );
  }, [money, unlocked, currentProduct, staff, dealers, dealerCost]);

  return (
    <GameContext.Provider
      value={{
        money,
        setMoney,
        unlocked,
        unlockProduct,
        currentProduct,
        setCurrentProduct,
        productList,
        staff,
        setStaff,
        dealers,
        setDealers,
        dealerCost,
        setDealerCost,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
};
