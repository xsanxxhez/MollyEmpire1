import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  name: string;
  unlockPrice: number;
  buyPrice: number;
  sellPrice: number;
  emoji: string;
  riskMultiplier: number;
}

interface BaseUpgrade {
  name: string;
  cost: number;
  bought: number;
  description: string;
  icon: string;
  type: 'permanent' | 'instant';
  costMultiplier: number;
  maxLevel?: number;
}

interface SecurityUpgrade extends BaseUpgrade {
  effect: number;
}

interface DealerUpgrade extends BaseUpgrade {
  incomeMultiplier?: number;
  efficiency?: number;
  bulkBonus?: number;
  riskReduction?: number;
}



const productList: Product[] = [
  { name: "BrainBooster3000", unlockPrice: 0, buyPrice: 0.5, sellPrice: 1, emoji: "🧠", riskMultiplier: 0.1 },
  { name: "Pill 5001", unlockPrice: 120, buyPrice: 12, sellPrice: 15, emoji: "💊", riskMultiplier: 0.275 },
  { name: "Dinosaur Tranquilizer", unlockPrice: 750, buyPrice: 35, sellPrice: 40, emoji: "🦖", riskMultiplier: 0.35 },
  { name: "Zoomer Fuel", unlockPrice: 1750, buyPrice: 45, sellPrice: 60, emoji: "⚡", riskMultiplier: 0.39 },
  { name: "Weed", unlockPrice: 2800, buyPrice: 50, sellPrice: 67.5, emoji: "🍁", riskMultiplier: 0.39 },
  { name: "Boomer Elixir", unlockPrice: 7300, buyPrice: 75, sellPrice: 100, emoji: "👴⚗️", riskMultiplier: 0.2 },
  { name: "mdma", unlockPrice: 16900, buyPrice: 140, sellPrice: 180, emoji: "✨", riskMultiplier: 0.48 },
  { name: "Fairy Dust", unlockPrice: 25000, buyPrice: 200, sellPrice: 275, emoji: "🧚✨", riskMultiplier: 0.49 },
  { name: "Gas", unlockPrice: 33100, buyPrice: 300, sellPrice: 385, emoji: "🐶", riskMultiplier: 0.65 },
  { name: "Unicorn Tears", unlockPrice: 40000, buyPrice: 400, sellPrice: 550, emoji: "🦄😢", riskMultiplier: 0.75 },
  { name: "Gas 2.0", unlockPrice: 50000, buyPrice: 500, sellPrice: 655, emoji: "🐶⚡", riskMultiplier: 0.95 },
  { name: "Do not sniff it", unlockPrice: 85000, buyPrice: 800, sellPrice: 1130, emoji: "☠️", riskMultiplier: 0.95 },
  { name: "Mystery Powder", unlockPrice: 100000, buyPrice: 1200, sellPrice: 1750, emoji: "🦠", riskMultiplier: 0.95 },
  { name: "Cocaine", unlockPrice: 180000, buyPrice: 1800, sellPrice: 2500, emoji: "❄️", riskMultiplier: 1.55 },
  { name: "Heroin", unlockPrice: 255000, buyPrice: 2000, sellPrice: 3500, emoji: "💉", riskMultiplier: 1.55 },
  { name: "Black Hole Essence", unlockPrice: 400000, buyPrice: 3500, sellPrice: 5000, emoji: "🕳️⚫", riskMultiplier: 1.75 },
  { name: "Gravel42", unlockPrice: 775000, buyPrice: 5500, sellPrice: 7900, emoji: "🪨", riskMultiplier: 1.9 },
  { name: "Neutron Star Dust", unlockPrice: 1550000, buyPrice: 9000, sellPrice: 13000, emoji: "⭐💫", riskMultiplier: 1.9 },
  { name: "Hollow", unlockPrice: 2800000, buyPrice: 12000, sellPrice: 20000, emoji: "🕳️", riskMultiplier: 1.6 },
  { name: "Dark Matter", unlockPrice: 5000000, buyPrice: 18000, sellPrice: 30000, emoji: "⚫🌀", riskMultiplier: 1.9 },
  { name: "HeroinMod", unlockPrice: 10500000, buyPrice: 25000, sellPrice: 45000, emoji: "💉⚡", riskMultiplier: 2.9},
  { name: "Quantum Crack", unlockPrice: 20000000, buyPrice: 60000, sellPrice: 90000, emoji: "⚛️💥", riskMultiplier: 4.0 },
  { name: "MindKiller", unlockPrice: 115000000, buyPrice: 150000, sellPrice: 220000, emoji: "🧠💀", riskMultiplier: 5.0 },
  { name: "The Singularity", unlockPrice: 10101010100, buyPrice: 450000, sellPrice: 655000, emoji: "🌀♾️", riskMultiplier: 7.0 },
];

const defaultSecurityUpgrades: SecurityUpgrade[] = [
  {
    name: "Secure Storage",
    cost: 12500,
    effect: 0.05,
    bought: 0,
    description: "Permanently reduces risk gain by 5%",
    icon: "🔒",
    type: 'permanent',
    costMultiplier: 2.0
  },
  {
    name: "Bribe Network",
    cost: 85000,
    effect: 0.07,
    bought: 0,
    description: "Permanently reduces risk gain by 7%",
    icon: "💰",
    type: 'permanent',
    costMultiplier: 2.5
  },
  {
    name: "Elite Lawyers",
    cost: 100000,
    effect: 0.10,
    bought: 0,
    description: "Permanently reduces risk gain by 10%",
    icon: "👨‍⚖️",
    type: 'permanent',
    costMultiplier: 3.8
  },
  {
    name: "Police Bribe",
    cost: 800,
    effect: 15,
    bought: 0,
    description: "Instantly reduces risk by 15 points",
    icon: "👮‍♂️",
    type: 'instant',
    costMultiplier: 1.5
  },
  {
    name: "Evidence Cleanup",
    cost: 1800,
    effect: 25,
    bought: 0,
    description: "Instantly reduces risk by 25 points",
    icon: "🧹",
    type: 'instant',
    costMultiplier: 1.4
  }
];

const defaultDealerUpgrades: DealerUpgrade[] = [
  {
    name: "Better Connections",
    description: "Increase dealer income by 20%",
    cost: 1200,
    incomeMultiplier: 0.2,
    bought: 0,
    icon: "🔌",
    type: 'permanent',
    costMultiplier: 5.5,
    maxLevel: 50
  },
  {
    name: "Loyalty Program",
    description: "Dealers work 30% more efficiently",
    cost: 7000,
    efficiency: 0.3,
    bought: 0,
    icon: "💎",
    type: 'permanent',
    costMultiplier: 5.5,
    maxLevel: 50
  },
  {
    name: "Distribution Network",
    description: "Increase income by 40%",
    cost: 22500,
    incomeMultiplier: 0.4,
    bought: 0,
    icon: "🌐",
    type: 'permanent',
    costMultiplier: 5.5,
    maxLevel: 50
  },
  {
    name: "Security Training",
    description: "Reduce risk from dealers by 50%",
    cost: 130000,
    riskReduction: 0.5,
    bought: 0,
    icon: "🛡️",
    type: 'permanent',
    costMultiplier: 3.0,
    maxLevel: 50
  },
  {
    name: "Elite Dealers",
    description: "Double base income per dealer + risk reduction",
    cost: 1000000,
    incomeMultiplier: 1.0,
    riskReduction: 0.8,
    bought: 0,
    icon: "👑",
    type: 'permanent',
    costMultiplier: 2.5,
    maxLevel: 15
  },
];

interface GameContextType {
  money: number;
  setMoney: (v: number | ((prev: number) => number)) => void;
  unlocked: string[];
  unlockProduct: (name: string) => void;
  currentProduct: Product;
  setCurrentProduct: (p: Product) => void;
  productList: Product[];
  productStock: { [key: string]: number };
  setProductStock: (stock: { [key: string]: number }) => void;
  dealers: number;
  setDealers: (v: number) => void;
  dealerCost: number;
  setDealerCost: (v: number | ((prev: number) => number)) => void;
  dealerIncome: number;
  setDealerIncome: (v: number | ((prev: number) => number)) => void;
  risk: number;
  setRisk: (v: number | ((prev: number) => number)) => void;
  riskGain: number;
  setRiskGain: (v: number) => void;
  securityUpgrades: SecurityUpgrade[];
  setSecurityUpgrades: (upgrades: SecurityUpgrade[]) => void;
  dealerUpgrades: DealerUpgrade[];
  setDealerUpgrades: (upgrades: DealerUpgrade[]) => void;
  saveGame: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedData = JSON.parse(localStorage.getItem("game-data") || "{}");

  const [money, setMoneyState] = useState<number>(savedData.money ?? 1);
  const [unlocked, setUnlocked] = useState<string[]>(savedData.unlocked ?? ["BrainBooster3000"]);
  const [currentProduct, setCurrentProduct] = useState<Product>(
    productList.find(p => p.name === savedData.currentProduct) || productList[0]
  );
  const [productStock, setProductStock] = useState<{ [key: string]: number }>(
    savedData.productStock ?? productList.reduce((acc, product) => {
      acc[product.name] = savedData.productStock?.[product.name] || 0;
      return acc;
    }, {} as { [key: string]: number })
  );
  const [dealers, setDealers] = useState<number>(savedData.dealers ?? 0);
  const [dealerCost, setDealerCost] = useState<number>(savedData.dealerCost ?? 3);
  const [dealerIncome, setDealerIncome] = useState<number>(savedData.dealerIncome ?? 0.5);
  const [risk, setRisk] = useState<number>(savedData.risk ?? 0);
  const [riskGain, setRiskGain] = useState<number>(savedData.riskGain ?? 2);
  const [securityUpgrades, setSecurityUpgrades] = useState<SecurityUpgrade[]>(
    savedData.securityUpgrades || defaultSecurityUpgrades.map(u => ({
      ...u,
      type: u.type || 'permanent'
    }))
  );
  const [dealerUpgrades, setDealerUpgrades] = useState<DealerUpgrade[]>(
    savedData.dealerUpgrades || defaultDealerUpgrades.map(u => ({
      ...u,
      maxLevel: u.maxLevel ?? 50
    }))
  );

  const setMoney = (v: number | ((prev: number) => number)) => {
    if (typeof v === 'function') {
      setMoneyState(v);
    } else {
      setMoneyState(v);
    }
  };

  const unlockProduct = (name: string) => {
    if (!unlocked.includes(name)) {
      setUnlocked(prev => [...prev, name]);
    }
  };

  const saveGame = () => {
    const gameData = {
      money,
      unlocked,
      currentProduct: currentProduct.name,
      productStock,
      dealers,
      dealerCost,
      dealerIncome,
      risk,
      riskGain,
      securityUpgrades: securityUpgrades.map(u => ({
        name: u.name,
        cost: u.cost,
        bought: u.bought,
        description: u.description,
        icon: u.icon,
        type: u.type,
        costMultiplier: u.costMultiplier,
        effect: (u as SecurityUpgrade).effect,
        maxLevel: u.maxLevel
      })),
      dealerUpgrades: dealerUpgrades.map(u => ({
        name: u.name,
        cost: u.cost,
        bought: u.bought,
        description: u.description,
        icon: u.icon,
        type: u.type,
        costMultiplier: u.costMultiplier,
        incomeMultiplier: u.incomeMultiplier,
        efficiency: u.efficiency,
        riskReduction: u.riskReduction,
        maxLevel: u.maxLevel
      })),
    };
    localStorage.setItem("game-data", JSON.stringify(gameData));
  };

  useEffect(() => {
    saveGame();
  }, [money, unlocked, currentProduct, productStock, dealers, dealerCost, dealerIncome, risk, riskGain, securityUpgrades, dealerUpgrades]);

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
        productStock,
        setProductStock,
        dealers,
        setDealers,
        dealerCost,
        setDealerCost,
        dealerIncome,
        setDealerIncome,
        risk,
        setRisk,
        riskGain,
        setRiskGain,
        securityUpgrades,
        setSecurityUpgrades,
        dealerUpgrades,
        setDealerUpgrades,
        saveGame,
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