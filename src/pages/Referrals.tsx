import React, { useEffect } from 'react';
import '../styles/Referrals.css';

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
      drop.style.width = `${0.3 + Math.random() * 1}px`;
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
  const [digits, setDigits] = React.useState<Array<{id: string, digit: string, left: number, duration: number}>>([]);

  React.useEffect(() => {
    const createDigit = () => {
      const digit = Math.random() > 0.5 ? '1' : '0';
      const left = Math.random() * 100;
      const animationDuration = 5 + Math.random() * 5;

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
    <div className="binary-rain">
      {digits.map(({ id, digit, left, duration }) => (
        <div
          key={id}
          className="binary-digit"
          style={{
            left: `${left}%`,
            animationDuration: `${duration}s`,
          }}
        >
          {digit}
        </div>
      ))}
    </div>
  );
};

const Referrals = () => {
  return (
    <div className="referrals-container">
      <NeonRain />
      <BinaryRain />

      <div className="content-wrapper">
        <h2 className="neon-title flicker">REFERRAL SYSTEM</h2>

        <div className="section glow-border">
          <h3 className="neon-subtitle pulse">🏆 LEADERBOARD</h3>
          <div className="table-container">
            <table className="neon-table">
              <thead>
                <tr>
                  <th className="glow-text-blue">RANK</th>
                  <th className="glow-text-purple">USERNAME</th>
                  <th className="glow-text-green">REFERRALS</th>
                  <th className="glow-text-cyan">EARNINGS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="neon-row">
                  <td className="glow-text">1</td>
                  <td className="glow-text">HACKER_ONE</td>
                  <td className="glow-text-green">427</td>
                  <td className="glow-text-cyan">$12,450</td>
                </tr>
                <tr className="neon-row">
                  <td className="glow-text">2</td>
                  <td className="glow-text">CYBER_GHOST</td>
                  <td className="glow-text-green">389</td>
                  <td className="glow-text-cyan">$10,120</td>
                </tr>
                <tr className="neon-row">
                  <td className="glow-text">3</td>
                  <td className="glow-text">DARK_NET</td>
                  <td className="glow-text-green">256</td>
                  <td className="glow-text-cyan">$7,890</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="section glow-border">
          <h3 className="neon-subtitle pulse">📋 YOUR REFERRALS</h3>
          <div className="table-container">
            <table className="neon-table">
              <thead>
                <tr>
                  <th className="glow-text-purple">USERNAME</th>
                  <th className="glow-text-blue">JOIN DATE</th>
                  <th className="glow-text-green">EARNED</th>
                </tr>
              </thead>
              <tbody>
                <tr className="neon-row">
                  <td className="glow-text">NEWBIE_01</td>
                  <td className="glow-text">2023-10-15</td>
                  <td className="glow-text-green">$25.00</td>
                </tr>
                <tr className="neon-row">
                  <td className="glow-text">DRUG_LORD</td>
                  <td className="glow-text">2023-10-10</td>
                  <td className="glow-text-green">$120.50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="referral-link glow-border">
          <p className="glow-text-cyan">YOUR REFERRAL LINK:</p>
          <div className="link-box typing-animation">https://mollygame.com/ref/DRUG_EMPIRE_42</div>
          <p className="earnings-info glow-text-green">
            Earn <span className="glow-text-yellow">10%</span> of all your referrals' income!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Referrals;