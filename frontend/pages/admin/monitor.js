// NOTICE: This file is protected under RCF-PL v1.2.3
// [RCF:PUBLIC]
import Head from 'next/head'
import SystemMonitor from '../../components/SystemMonitor'

export default function AdminMonitor() {
  return (
    <div className="page">
      <Head>
        <title>Aurora Kernel | Admin Monitor</title>
      </Head>

      <main className="admin-container">
        <div className="admin-header">
          <div className="status-badge">ADMIN ACCESS</div>
          <h1>Kernel System Logs</h1>
          <p>Real-time telemetry from dOS Core</p>
        </div>

        <div className="content">
          <SystemMonitor />
        </div>
      </main>

      <style jsx>{`
        .page {
          background: #020310;
          min-height: 100vh;
          color: white;
          font-family: 'JetBrains Mono', monospace;
        }
        .admin-container {
          padding: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .admin-header {
          margin-bottom: 3rem;
          border-bottom: 1px solid #1e293b;
          padding-bottom: 2rem;
        }
        .status-badge {
          display: inline-block;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        h1 {
          font-size: 2.5rem;
          margin: 0;
          color: #f8fafc;
        }
        p {
          color: #94a3b8;
          margin-top: 0.5rem;
        }
        .content {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}
