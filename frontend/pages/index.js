// NOTICE: This file is protected under RCF-PL v1.2.3
// [RCF:PUBLIC]
import Head from 'next/head'
import AuroraAccess from '../components/AuroraAccess'
import DigitalVault from '../components/DigitalVault'
import { useState } from 'react'

export default function Home() {
  const [view, setView] = useState('access');

  return (
    <div className="page">
      <Head>
        <title>Aurora Access</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="hero">
        <img src="/banner.png" alt="Aurora" className="banner" />
        <h1>Aurora Access</h1>
        <p className="tag">
          Freedom is not a feature — it’s a right written in light.
        </p>

        <nav className="tabs">
          <button
            onClick={() => setView('access')}
            className={`tab-btn ${view === 'access' ? 'active' : ''}`}
          >
            Access Portal
          </button>
          <button
            onClick={() => setView('vault')}
            className={`tab-btn ${view === 'vault' ? 'active' : ''}`}
          >
            Digital Vault
          </button>
        </nav>

        <div className="content">
          {view === 'access' ? <AuroraAccess /> : <DigitalVault />}
        </div>
      </main>

      <style jsx>{`
        .page {
          font-family: Inter, system-ui, Segoe UI, Roboto, 'Helvetica Neue', Arial;
          color: #e6f0ff;
          background: #05061a;
          min-height: 100vh;
        }
        .banner {
          width: 100%;
          max-height: 250px;
          object-fit: cover;
          filter: brightness(0.6) saturate(1.2);
          border-bottom: 1px solid rgba(79, 70, 229, 0.2);
        }
        .hero {
          padding: 2rem;
          text-align: center;
          max-width: 1000px;
          margin: 0 auto;
        }
        h1 {
          font-size: 2.8rem;
          margin: 1rem 0;
          letter-spacing: -1px;
          background: linear-gradient(to right, #fff, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .tag {
          opacity: 0.7;
          font-weight: 300;
          letter-spacing: 1px;
        }
        .tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 2rem 0;
        }
        .tab-btn {
          background: transparent;
          border: 1px solid rgba(129, 140, 248, 0.3);
          color: #818cf8;
          padding: 0.6rem 1.5rem;
          border-radius: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        .tab-btn:hover {
          background: rgba(129, 140, 248, 0.1);
          border-color: #818cf8;
        }
        .tab-btn.active {
          background: #4f46e5;
          color: white;
          border-color: #4f46e5;
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.4);
        }
        .content {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}
