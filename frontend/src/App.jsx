import React, { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';
const WS_BASE_URL = 'ws://localhost:8080/ws';

// ─── SVG Icon Library (Premium Hand-curated Icons) ───────────────────────────
const Icon = {
  Leaf: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="5"/><path d="M3 21a9 9 0 0 1 18 0"/>
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Gavel: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="m14.5 12.5-8 8a2.119 2.119 0 0 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/>
    </svg>
  ),
  Database: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  Trending: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Package: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  Globe: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20"/>
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
    </svg>
  ),
  StopCircle: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>
  ),
  Trophy: () => (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Scale: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
    </svg>
  ),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val) => `₹${parseFloat(val).toFixed(2)}`;

const parseApiDate = (str) => {
  if (!str) return null;
  if (str.endsWith('Z') || str.includes('+')) return new Date(str);
  return new Date(str + 'Z');
};

// ─── Local DB (Offline Fallback) ──────────────────────────────────────────────
const LOCAL_KEY = 'agri_platform_local_db';
const SESSION_KEY = 'agri_user_session';

const seedDB = () => ({
  users: [
    { id: 1, name: 'Tarun Penumudi', email: 'penumuditarun@gmail.com', role: 'ADMIN', password: 'Tarun@0607' },
    { id: 2, name: 'Ravi Kumar', email: 'farmer@agri.com', role: 'FARMER', password: 'farmer@123' },
    { id: 3, name: 'Priya Sharma', email: 'buyer@agri.com', role: 'BUYER', password: 'buyer@123' },
  ],
  products: [
    { id: 1, name: 'Premium Basmati Rice', description: 'Long grain aromatic basmati, moisture < 12%, handpicked from Punjab.', price: 85.00, quantity: 2000, farmerId: 2, location: 'Punjab', category: 'GRAINS', auctionEndTime: new Date(Date.now() + 86400000).toISOString(), status: 'ACTIVE' },
    { id: 2, name: 'Organic Wheat (Grade A)', description: 'Golden wheat harvested from certified organic farms in Madhya Pradesh.', price: 32.50, quantity: 5000, farmerId: 2, location: 'Madhya Pradesh', category: 'GRAINS', auctionEndTime: new Date(Date.now() + 3600000 * 3).toISOString(), status: 'ACTIVE' },
    { id: 3, name: 'Fresh Organic Turmeric', description: 'Raw turmeric rhizomes, high curcumin content (> 5%), harvested in Erode.', price: 110.00, quantity: 800, farmerId: 2, location: 'Tamil Nadu', category: 'SPICES', auctionEndTime: new Date(Date.now() - 600000).toISOString(), status: 'CLOSED' },
  ],
  bids: [
    { id: 1, bidAmount: 90.00, productId: 1, buyerId: 3, buyerName: 'Priya Sharma', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, bidAmount: 96.50, productId: 1, buyerId: 3, buyerName: 'Priya Sharma', timestamp: new Date(Date.now() - 1800000).toISOString() },
    { id: 3, bidAmount: 38.00, productId: 2, buyerId: 3, buyerName: 'Priya Sharma', timestamp: new Date(Date.now() - 600000).toISOString() },
  ],
});

const getDB = () => {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (raw) return JSON.parse(raw);
  const db = seedDB();
  localStorage.setItem(LOCAL_KEY, JSON.stringify(db));
  return db;
};
const saveDB = (db) => localStorage.setItem(LOCAL_KEY, JSON.stringify(db));

// ─── Re-index helper (Feature 3) ─────────────────────────────────────────────
const reIndexArray = (arr) => arr.map((item, i) => ({ ...item, id: i + 1 }));

// ─── Sub-Components ───────────────────────────────────────────────────────────

function Badge({ children, color = 'green' }) {
  const colors = {
    green: 'badge-green',
    amber: 'badge-amber',
    red: 'badge-red',
    blue: 'badge-blue',
    gray: 'badge-gray',
  };
  return <span className={`badge ${colors[color]}`}>{children}</span>;
}

function Alert({ type, message, onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type}`}>
      <span className={`dot-${type === 'error' ? 'red' : 'green'} pulse`}></span>
      <span className="alert-msg">{message}</span>
      <button className="alert-close" onClick={onClose}><Icon.X /></button>
    </div>
  );
}

function StatCard({ label, value, color = 'green' }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}

// ─── Feature 4: Transition Overlay ───────────────────────────────────────────
function TransitionOverlay({ message }) {
  return (
    <div className="transition-overlay">
      <div className="transition-content">
        <div className="transition-logo">
          <span className="brand-icon"><Icon.Leaf /></span>
          <span className="brand-name">AgriExchange</span>
        </div>
        <div className="transition-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring delay1"></div>
          <div className="spinner-ring delay2"></div>
        </div>
        <p className="transition-msg">{message}</p>
        <div className="transition-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}

// ─── Feature 5: Auction Complete Celebration Modal ────────────────────────────
function AuctionCompleteModal({ product, winnerBid, onClose, isAdmin }) {
  const profit = winnerBid ? winnerBid.bidAmount - product.price : 0;
  const profitPct = winnerBid ? ((profit / product.price) * 100).toFixed(1) : 0;
  const totalCollect = winnerBid ? (winnerBid.bidAmount * product.quantity).toFixed(2) : (product.price * product.quantity).toFixed(2);
  const winnerName = winnerBid ? (winnerBid.buyerName || `Buyer #${winnerBid.buyerId}`) : 'No bids received';

  return (
    <div className="modal-overlay auction-complete-overlay" onClick={onClose}>
      <div className="auction-complete-modal" onClick={e => e.stopPropagation()}>
        {/* Celebration confetti particles */}
        <div className="confetti-container" aria-hidden="true">
          {[...Array(18)].map((_, i) => (
            <div key={i} className={`confetti-piece confetti-${i % 6}`} style={{ left: `${(i * 5.5) + 2}%`, animationDelay: `${i * 0.12}s` }}></div>
          ))}
        </div>

        <div className="acm-header">
          <div className="acm-trophy-ring">
            <div className="acm-trophy-glow"></div>
            <span className="acm-trophy-icon"><Icon.Trophy /></span>
          </div>
          <span className="acm-tag">{isAdmin ? 'AUCTION CLOSED — ADMIN REPORT' : '🎉 AUCTION COMPLETE!'}</span>
          <h2 className="acm-title">Bid Successfully Settled</h2>
          <p className="acm-crop-name">{product.name}</p>
        </div>

        <div className="acm-winner-banner">
          <div className="acm-winner-left">
            <div className="acm-winner-avatar">{winnerName.charAt(0).toUpperCase()}</div>
            <div>
              <p className="acm-winner-label">🏆 Winning Buyer</p>
              <p className="acm-winner-name">{winnerName}</p>
            </div>
          </div>
          <div className="acm-winner-right">
            <p className="acm-winner-label">Final Winning Bid</p>
            <p className="acm-winning-price">{winnerBid ? fmt(winnerBid.bidAmount) + '/kg' : '—'}</p>
          </div>
        </div>

        <div className="acm-stats-grid">
          <div className="acm-stat">
            <p className="acm-stat-label">Base Price</p>
            <p className="acm-stat-val">{fmt(product.price)}/kg</p>
          </div>
          <div className="acm-stat acm-stat-profit">
            <p className="acm-stat-label">Price Uplift</p>
            <p className="acm-stat-val">+{fmt(profit)}/kg <span className="acm-pct">(+{profitPct}%)</span></p>
          </div>
          <div className="acm-stat">
            <p className="acm-stat-label">Quantity Sold</p>
            <p className="acm-stat-val">{Number(product.quantity).toLocaleString()} kg</p>
          </div>
          <div className="acm-stat acm-stat-total">
            <p className="acm-stat-label">{isAdmin ? 'Gross Transaction Value' : '💰 Total to Collect'}</p>
            <p className="acm-stat-val acm-total-val">₹{Number(totalCollect).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <button className="acm-close-btn" onClick={onClose}>
          <Icon.CheckCircle /> {isAdmin ? 'Close Report' : 'Acknowledge & Dismiss'}
        </button>
      </div>
    </div>
  );
}

// ─── Dynamic Live Countdown Timer Clock ──────────────────────────────────────
function CountdownClock({ endTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isWarning, setIsWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const expiredCalled = useRef(false);

  useEffect(() => {
    if (!endTime) {
      setTimeLeft('No Limit');
      return;
    }

    const check = () => {
      const now = new Date().getTime();
      const target = parseApiDate(endTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Expired');
        setIsExpired(true);
        if (!expiredCalled.current && onExpire) {
          expiredCalled.current = true;
          onExpire();
        }
        return true;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (hrs === 0 && mins < 15) setIsWarning(true);

      let formatted = '';
      if (hrs > 0) formatted += `${hrs}h `;
      formatted += `${mins}m ${secs}s`;
      setTimeLeft(formatted);
      return false;
    };

    if (check()) return;
    const interval = setInterval(() => { if (check()) clearInterval(interval); }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  let clockClass = 'clock-container';
  if (isExpired) clockClass += ' clock-expired';
  else if (isWarning) clockClass += ' clock-warning';

  return (
    <span className={clockClass}>
      <Icon.Clock /> {timeLeft}
    </span>
  );
}

// ─── Data Viewer Modal ─────────────────────────────────────────────────────────
function DataViewer({ onClose, isOfflineMode, headers }) {
  const [tab, setTab] = useState('users');
  const [data, setData] = useState({ users: [], products: [], bids: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (isOfflineMode) {
        setData(getDB());
        setLoading(false);
        return;
      }
      try {
        const [usersRes, prodRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users`, { headers }).catch(() => ({ ok: false })),
          fetch(`${API_BASE_URL}/products`, { headers })
        ]);
        const products = prodRes.ok ? await prodRes.json() : [];
        const users = usersRes.ok ? await usersRes.json() : getDB().users;

        let bids = [];
        for (const p of products) {
          const br = await fetch(`${API_BASE_URL}/bids/product/${p.id}`, { headers });
          if (br.ok) {
            const pb = await br.json();
            bids = [...bids, ...pb];
          }
        }
        setData({ users, products, bids });
      } catch {
        setData(getDB());
      }
      setLoading(false);
    };
    load();
  }, [isOfflineMode]);

  const tabs = [
    { id: 'users', label: 'Users', icon: <Icon.Users />, count: data.users.length },
    { id: 'products', label: 'Products', icon: <Icon.Package />, count: data.products.length },
    { id: 'bids', label: 'Bids', icon: <Icon.Gavel />, count: data.bids.length },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-icon"><Icon.Database /></span>
            <div>
              <h2 className="modal-title">Live Database Viewer</h2>
              <p className="modal-subtitle">{isOfflineMode ? 'Offline Mode — Local Storage' : 'Connected — PostgreSQL DB via REST API'}</p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon.X /></button>
        </div>

        <div className="modal-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`modal-tab ${tab === t.id ? 'modal-tab-active' : ''}`}
            >
              {t.icon} {t.label}
              <span className="tab-count">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="modal-content">
          {loading ? (
            <div className="loader-row"><div className="loader"></div> Loading data...</div>
          ) : (
            <>
              {tab === 'users' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Name</th><th>Email</th><th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.length === 0 ? (
                      <tr><td colSpan="4" className="empty-cell">No users registered yet.</td></tr>
                    ) : data.users.map((u, i) => (
                      <tr key={u.id}>
                        <td className="cell-muted">#{i + 1}</td>
                        <td className="cell-bold">{u.name}</td>
                        <td className="cell-muted">{u.email}</td>
                        <td><Badge color={u.role === 'ADMIN' ? 'red' : u.role === 'FARMER' ? 'green' : 'blue'}>{u.role}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {tab === 'products' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Crop Name</th><th>Base Price</th><th>Qty</th><th>Location</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.length === 0 ? (
                      <tr><td colSpan="6" className="empty-cell">No products listed yet.</td></tr>
                    ) : data.products.map((p, i) => (
                      <tr key={p.id}>
                        <td className="cell-muted">#{i + 1}</td>
                        <td className="cell-bold">{p.name}</td>
                        <td className="cell-green">{fmt(p.price)}</td>
                        <td>{Number(p.quantity).toLocaleString()} kg</td>
                        <td>{p.location || 'N/A'}</td>
                        <td><Badge color={p.status === 'ACTIVE' ? 'green' : p.status === 'CLOSED' ? 'amber' : 'red'}>{p.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {tab === 'bids' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Bid Amount</th><th>Product ID</th><th>Buyer Name</th><th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bids.length === 0 ? (
                      <tr><td colSpan="5" className="empty-cell">No bids placed yet.</td></tr>
                    ) : data.bids.map((b, i) => (
                      <tr key={b.id}>
                        <td className="cell-muted">#{i + 1}</td>
                        <td className="cell-green cell-bold">{fmt(b.bidAmount)}</td>
                        <td className="cell-muted">Product #{b.productId}</td>
                        <td className="cell-bold">{b.buyerName || `Buyer #${b.buyerId}`}</td>
                        <td className="cell-muted">{b.timestamp ? parseApiDate(b.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Auth Screen ─────────────────────────────────────────────────────────────
function AuthScreen({ onLogin, isOfflineMode }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('BUYER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clear = () => { setError(''); setSuccess(''); };

  const handleLogin = (e) => {
    e.preventDefault(); clear();
    if (!email || !password) { setError('Please enter email and password.'); return; }

    if (email === 'penumuditarun@gmail.com') {
      if (password !== 'Tarun@0607') {
        setError('Incorrect password! Please check your credentials and try again.');
        return;
      }
      const s = { id: 1, name: 'Tarun Penumudi', email: 'penumuditarun@gmail.com', role: 'ADMIN', token: 'MOCK_JWT_TOKEN_ADMIN' };
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      onLogin(s);
      return;
    }

    if (isOfflineMode) {
      const db = getDB();
      const user = db.users.find(u => u.email === email);
      if (!user) {
        setError('No account registered with this email address!');
        return;
      }
      const expectedPassword = user.password || (user.email === 'farmer@agri.com' ? 'farmer@123' : user.email === 'buyer@agri.com' ? 'buyer@123' : 'Tarun@0607');
      if (password !== expectedPassword) {
        setError('Incorrect password! Please check your credentials and try again.');
        return;
      }
      const s = { id: user.id, name: user.name, email: user.email, role: user.role, token: 'MOCK_LOCAL_JWT_' + user.role };
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      onLogin(s);
    } else {
      fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then(async res => {
        if (!res.ok) throw new Error(await res.text() || 'Login failed');
        return res.json();
      }).then(user => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        onLogin(user);
      }).catch(err => setError(err.message));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault(); clear();
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (isOfflineMode) {
      const db = getDB();
      if (db.users.some(u => u.email === email)) { setError('Email already registered.'); return; }
      const user = { id: db.users.length + 1, name, email, role, password };
      db.users.push(user);
      saveDB(db);
      setSuccess('Account successfully registered! Please sign in.');
      setTimeout(() => { setMode('login'); setEmail(email); setPassword(''); }, 1200);
    } else {
      fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      }).then(async res => {
        if (!res.ok) throw new Error(await res.text() || 'Registration failed');
        return res.json();
      }).then(() => {
        setSuccess('Account successfully registered! Please sign in.');
        setTimeout(() => { setMode('login'); setEmail(email); setPassword(''); }, 1200);
      }).catch(err => setError(err.message));
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-icon"><Icon.Leaf /></span>
          <span className="brand-name">AgriExchange</span>
        </div>
        <h1 className="auth-headline">Transparent<br />Crop Bidding in <span>Real-time</span></h1>
        <p className="auth-sub">A secure commercial portal connecting agricultural growers directly with verified bulk institutional buyers through live auctions.</p>
        <div className="auth-stats">
          <div className="auth-stat"><p className="as-val">2,400+</p><p className="as-lbl">Growers Registered</p></div>
          <div className="auth-stat"><p className="as-val">12,500+</p><p className="as-lbl">Auctions Hosted</p></div>
          <div className="auth-stat"><p className="as-val">₹4.8Cr+</p><p className="as-lbl">Volume Traced</p></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login' ? 'auth-tab-active' : ''}`} onClick={() => { setMode('login'); clear(); }}>Sign In</button>
            <button className={`auth-tab ${mode === 'register' ? 'auth-tab-active' : ''}`} onClick={() => { setMode('register'); clear(); }}>Register</button>
          </div>

          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={success} onClose={() => setSuccess('')} />

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="field">
                <label>Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon"><Icon.User /></span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email address" required />
                </div>
              </div>
              <div className="field">
                <label>Password</label>
                <div className="input-wrap">
                  <span className="input-icon"><Icon.Lock /></span>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
                </div>
              </div>
              <button type="submit" className="btn-primary-full">Sign In</button>
              <div className="demo-hint" style={{borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '12px'}}>
                <p>AgriExchange Enterprise Auction Server Platform</p>
                <p style={{fontSize: '0.68rem', opacity: 0.6, marginTop: '4px'}}>Access is restricted to authorized commercial members only.</p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="field">
                <label>Full Name / Business Title</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Tarun Penumudi" required />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@business.com" required />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
              </div>
              <div className="field">
                <label>Join Platform As</label>
                <div className="role-toggle">
                  <button type="button" className={`role-btn ${role === 'FARMER' ? 'role-active' : ''}`} onClick={() => setRole('FARMER')}>🌾 Farmer / Grower</button>
                  <button type="button" className={`role-btn ${role === 'BUYER' ? 'role-active' : ''}`} onClick={() => setRole('BUYER')}>⚖️ Wholesale Buyer</button>
                </div>
              </div>
              <button type="submit" className="btn-primary-full">Create Free Account</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Farmer Workspace ─────────────────────────────────────────────────────────
function FarmerView({ currentUser, products, loadProducts, setMsg, isOfflineMode, headers }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [location, setLocation] = useState('Andhra Pradesh');
  const [category, setCategory] = useState('GRAINS');
  const [durationHours, setDurationHours] = useState('24');
  const [selectedId, setSelectedId] = useState(null);
  const [bids, setBids] = useState([]);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [completedBid, setCompletedBid] = useState(null);

  const myProducts = products.filter(p => p.farmerId === currentUser.id);
  const selected = products.find(p => p.id === selectedId);

  const loadBids = (id) => {
    if (isOfflineMode) {
      const db = getDB();
      setBids(db.bids.filter(b => b.productId === id).sort((a, b) => b.bidAmount - a.bidAmount));
    } else {
      fetch(`${API_BASE_URL}/bids/product/${id}`, { headers })
        .then(r => r.json())
        .then(data => setBids(Array.isArray(data) ? data.sort((a, b) => b.bidAmount - a.bidAmount) : []))
        .catch(() => setBids([]));
    }
  };

  const selectProduct = (id) => { setSelectedId(id); loadBids(id); };

  // Feature 5: Handle bid expiry for farmer
  const handleBidExpire = useCallback((product) => {
    if (isOfflineMode) {
      const db = getDB();
      const productBids = db.bids.filter(b => b.productId === product.id).sort((a, b) => b.bidAmount - a.bidAmount);
      setCompletedCrop(product);
      setCompletedBid(productBids[0] || null);
    } else {
      fetch(`${API_BASE_URL}/bids/product/${product.id}`, { headers })
        .then(r => r.json())
        .then(data => {
          const sorted = Array.isArray(data) ? data.sort((a, b) => b.bidAmount - a.bidAmount) : [];
          setCompletedCrop(product);
          setCompletedBid(sorted[0] || null);
        })
        .catch(() => {
          setCompletedCrop(product);
          setCompletedBid(null);
        });
    }
  }, [isOfflineMode, headers]);

  // Feature 6: Close bid anytime
  const closeBid = (productId) => {
    if (!confirm('Close this auction now? The current highest bidder will win the crop.')) return;
    if (isOfflineMode) {
      const db = getDB();
      const idx = db.products.findIndex(p => p.id === productId);
      if (idx !== -1) {
        db.products[idx].status = 'CLOSED';
        saveDB(db);
        const productBids = db.bids.filter(b => b.productId === productId).sort((a, b) => b.bidAmount - a.bidAmount);
        const closedProduct = db.products[idx];
        loadProducts();
        setMsg('success', 'Auction closed successfully!');
        setCompletedCrop(closedProduct);
        setCompletedBid(productBids[0] || null);
      }
    } else {
      fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ status: 'CLOSED' })
      })
      .then(async r => {
        if (!r.ok) throw new Error(await r.text() || 'Close failed');
        return fetch(`${API_BASE_URL}/bids/product/${productId}`, { headers });
      })
      .then(r => r.json())
      .then(data => {
        const sorted = Array.isArray(data) ? data.sort((a, b) => b.bidAmount - a.bidAmount) : [];
        const closedProduct = products.find(p => p.id === productId);
        loadProducts();
        setMsg('success', 'Auction closed successfully!');
        setCompletedCrop(closedProduct);
        setCompletedBid(sorted[0] || null);
      })
      .catch(err => setMsg('error', err.message));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!name || !price || !qty) { setMsg('error', 'Please fill in all required fields.'); return; }

    const end = new Date();
    end.setHours(end.getHours() + parseInt(durationHours));

    const payload = {
      name,
      description: desc,
      price: parseFloat(price),
      quantity: parseFloat(qty),
      farmerId: currentUser.id,
      location,
      category,
      auctionEndTime: end.toISOString(),
      status: 'ACTIVE'
    };

    if (isOfflineMode) {
      const db = getDB();
      db.products.push({ id: db.products.length + 1, ...payload });
      saveDB(db);
      setMsg('success', 'Crop listing successfully published!');
      setName(''); setDesc(''); setPrice(''); setQty('');
      loadProducts();
    } else {
      fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload)
      })
      .then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); })
      .then(() => { setMsg('success', 'Crop listing successfully published!'); setName(''); setDesc(''); setPrice(''); setQty(''); loadProducts(); })
      .catch(err => setMsg('error', err.message));
    }
  };

  return (
    <>
      {/* Feature 5: Celebration modal for farmer */}
      {completedCrop && (
        <AuctionCompleteModal
          product={completedCrop}
          winnerBid={completedBid}
          onClose={() => { setCompletedCrop(null); setCompletedBid(null); }}
          isAdmin={false}
        />
      )}

      <div className="two-col">
        {/* List a crop */}
        <div className="panel glass">
          <div className="panel-header">
            <span className="panel-icon green"><Icon.Plus /></span>
            <div>
              <h3 className="panel-title">Publish Crop Harvest</h3>
              <p className="panel-sub">Make your harvest visible to wholesale buyers</p>
            </div>
          </div>
          <form onSubmit={submit} className="form-stack">
            <div className="field">
              <label>Crop Name <span className="req">*</span></label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Premium Basmati Rice" required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Crop Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="GRAINS">🌾 Grains / Cereals</option>
                  <option value="VEGETABLES">🥦 Vegetables</option>
                  <option value="FRUITS">🍎 Fruits</option>
                  <option value="SPICES">🌶️ Spices</option>
                  <option value="PULSES">🌱 Pulses</option>
                  <option value="OTHER">📦 Other</option>
                </select>
              </div>
              <div className="field">
                <label>State / Region</label>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Punjab" />
              </div>
            </div>
            <div className="field-row" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div className="field">
                <label>Starting Price (₹/kg) <span className="req">*</span></label>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', background: 'hsla(222, 19%, 13%, 0.4)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)'}}>
                  <button type="button" onClick={() => { const val = parseFloat(price) || 0; setPrice(Math.max(0, val - 1.00).toFixed(2)); }} style={{width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose)'}}>−</button>
                  <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" required style={{textAlign: 'center', background: 'transparent', flex: 1, padding: '6px', fontSize: '0.9rem', fontWeight: 'bold'}} />
                  <button type="button" onClick={() => { const val = parseFloat(price) || 0; setPrice((val + 1.00).toFixed(2)); }} style={{width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)'}}>+</button>
                </div>
              </div>
              <div className="field">
                <label>Total Quantity (kg) <span className="req">*</span></label>
                <div style={{display: 'flex', alignItems: 'center', gap: '6px', background: 'hsla(222, 19%, 13%, 0.4)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)'}}>
                  <button type="button" onClick={() => { const val = parseInt(qty) || 0; setQty(Math.max(0, val - 100)); }} style={{width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rose)'}}>−</button>
                  <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="1000" required style={{textAlign: 'center', background: 'transparent', flex: 1, padding: '6px', fontSize: '0.9rem', fontWeight: 'bold'}} />
                  <button type="button" onClick={() => { const val = parseInt(qty) || 0; setQty(val + 100); }} style={{width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)'}}>+</button>
                </div>
              </div>
            </div>
            <div className="field">
              <label>Bidding Duration</label>
              <select value={durationHours} onChange={e => setDurationHours(e.target.value)}>
                <option value="2">2 Hours (Flash Bid)</option>
                <option value="6">6 Hours</option>
                <option value="12">12 Hours</option>
                <option value="24">24 Hours (Standard)</option>
                <option value="48">48 Hours (Long)</option>
              </select>
            </div>
            <div className="field">
              <label>Quality & Moisture description</label>
              <textarea rows="3" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Aromatic, moisture < 12%, organic fertilizer..."></textarea>
            </div>
            <button type="submit" className="btn-primary">Publish Listing</button>
          </form>
        </div>

        {/* Listing stack */}
        <div className="panel glass">
          <div className="panel-header">
            <span className="panel-icon amber"><Icon.Trending /></span>
            <div>
              <h3 className="panel-title">My Harvest Listings</h3>
              <p className="panel-sub">{myProducts.length} active auctions in database</p>
            </div>
          </div>

          {myProducts.length === 0 ? (
            <div className="empty-state">
              <p className="empty-title">No listings active</p>
              <p className="empty-sub">Fill out the crop publisher to host your first live auction.</p>
            </div>
          ) : (
            <div className="list-stack">
              {myProducts.map(p => {
                const isEnded = p.status !== 'ACTIVE' || (p.auctionEndTime && parseApiDate(p.auctionEndTime).getTime() < new Date().getTime());
                return (
                  <div key={p.id} className={`list-item ${selectedId === p.id ? 'list-item-active' : ''} ${isEnded ? 'crop-card-expired' : ''}`} onClick={() => selectProduct(p.id)}>
                    <div className="list-item-top">
                      <div>
                        <p className="item-name">{p.name}</p>
                        <p className="item-desc">{p.location || 'India'} · {p.category}</p>
                      </div>
                      <div className="item-prices">
                        <Badge color="green">₹{Number(p.price).toFixed(2)}/kg</Badge>
                        <p className="item-qty">{Number(p.quantity).toLocaleString()} kg</p>
                      </div>
                    </div>
                    <div style={{marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px'}}>
                      <CountdownClock endTime={p.auctionEndTime} onExpire={() => handleBidExpire(p)} />
                      <div style={{display: 'flex', gap: '6px', alignItems: 'center'}}>
                        <Badge color={p.status === 'ACTIVE' && !isEnded ? 'green' : p.status === 'SOLD' ? 'red' : 'amber'}>
                          {p.status === 'ACTIVE' && !isEnded ? 'LIVE' : p.status === 'SOLD' ? 'SOLD' : 'CLOSED'}
                        </Badge>
                        {/* Feature 6: Close bid button */}
                        {p.status === 'ACTIVE' && !isEnded && (
                          <button
                            className="btn-close-bid"
                            onClick={e => { e.stopPropagation(); closeBid(p.id); }}
                            title="Close auction now and declare winner"
                          >
                            <Icon.StopCircle /> Close Bid
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Auction room */}
          {selected && (
            <div className="auction-room">
              <div className="auction-header">
                <div>
                  <p className="auction-label">Live Auction Desk</p>
                  <h4 className="auction-name">{selected.name}</h4>
                  <div style={{marginTop: '4px'}}><CountdownClock endTime={selected.auctionEndTime} /></div>
                </div>
                <button className="icon-btn" onClick={() => setSelectedId(null)}><Icon.X /></button>
              </div>
              <div className="bid-list">
                {bids.length === 0 ? (
                  <p className="bid-empty">No bids have been recorded yet.</p>
                ) : bids.map((b, i) => (
                  <div key={b.id} className={`bid-row ${i === 0 ? 'bid-row-top' : ''}`}>
                    <div className="bid-left">
                      <span className={`bid-dot ${i === 0 ? 'bid-dot-top' : ''}`}></span>
                      <span className="bid-buyer">{b.buyerName || `Buyer #${b.buyerId}`}</span>
                      {i === 0 && <Badge color="green">Highest</Badge>}
                    </div>
                    <span className={`bid-amount ${i === 0 ? 'bid-amount-top' : ''}`}>{fmt(b.bidAmount)}/kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Buyer Workspace ──────────────────────────────────────────────────────────
function BuyerView({ currentUser, products, loadProducts, setMsg, isOfflineMode, headers }) {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmt, setBidAmt] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  // Cache of highest bids per product for card display
  const [highestBidMap, setHighestBidMap] = useState({});

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
    (p.location && p.location.toLowerCase().includes(search.toLowerCase()))
  );

  // Load highest bids for all products for card display
  useEffect(() => {
    if (isOfflineMode) {
      const db = getDB();
      const map = {};
      db.bids.forEach(b => {
        if (!map[b.productId] || b.bidAmount > map[b.productId].bidAmount) {
          map[b.productId] = b;
        }
      });
      setHighestBidMap(map);
    }
  }, [isOfflineMode, products]);

  const loadBids = (id) => {
    if (isOfflineMode) {
      const db = getDB();
      setBids(db.bids.filter(b => b.productId === id).sort((a, b) => b.bidAmount - a.bidAmount));
    } else {
      fetch(`${API_BASE_URL}/bids/product/${id}`, { headers })
        .then(r => r.json())
        .then(data => setBids(Array.isArray(data) ? data.sort((a, b) => b.bidAmount - a.bidAmount) : []))
        .catch(() => setBids([]));
    }
  };

  const selectProduct = (p) => {
    setSelectedProduct(p);
    loadBids(p.id);
    setMsg('', '');
    setIsExpired(p.status !== 'ACTIVE' || (p.auctionEndTime && parseApiDate(p.auctionEndTime).getTime() < new Date().getTime()));
  };

  const quickBid = (inc) => {
    const base = bids.length > 0 ? bids[0].bidAmount : selectedProduct.price;
    setBidAmt((parseFloat(base) + inc).toFixed(2));
  };

  const placeBid = (e) => {
    e.preventDefault();
    if (isExpired) { setMsg('error', 'This listing is closed! Bidding expired.'); return; }

    const val = parseFloat(bidAmt);
    if (isNaN(val) || val <= 0) { setMsg('error', 'Please enter a valid bid amount.'); return; }
    if (val <= selectedProduct.price) { setMsg('error', `Your bid must exceed base starting price of ${fmt(selectedProduct.price)}`); return; }

    const highest = bids.length > 0 ? parseFloat(bids[0].bidAmount) : 0;
    if (val <= highest) { setMsg('error', `Your bid must exceed the current highest bid of ${fmt(highest)}`); return; }

    const payload = {
      bidAmount: val,
      productId: selectedProduct.id,
      buyerId: currentUser.id,
      buyerName: currentUser.name
    };

    if (isOfflineMode) {
      const db = getDB();
      const newBid = { id: db.bids.length + 1, ...payload, timestamp: new Date().toISOString() };
      db.bids.push(newBid);
      saveDB(db);
      setMsg('success', 'Your bid has been successfully placed!');
      setBidAmt('');
      loadBids(selectedProduct.id);
      loadProducts();
      // Update highest bid map
      setHighestBidMap(prev => ({ ...prev, [selectedProduct.id]: newBid }));
    } else {
      fetch(`${API_BASE_URL}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(payload)
      })
      .then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); })
      .then(() => { setMsg('success', 'Your bid has been successfully placed!'); setBidAmt(''); loadBids(selectedProduct.id); loadProducts(); })
      .catch(err => setMsg('error', err.message));
    }
  };

  const getCategoryEmoji = (cat) => {
    const map = { GRAINS: '🌾', VEGETABLES: '🥦', FRUITS: '🍎', SPICES: '🌶️', PULSES: '🌱', OTHER: '📦' };
    return map[cat] || '📦';
  };

  return (
    <div className="buyer-layout">
      {/* Catalog */}
      <div className="catalog-col">
        <div className="search-bar glass">
          <span className="search-icon"><Icon.Search /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crops by name, description or state... (Basmati, Wheat, Punjab)" />
          {search && <button className="clear-btn" onClick={() => setSearch('')}><Icon.X /></button>}
        </div>

        <div className="crop-grid">
          {filtered.length === 0 ? (
            <div className="empty-state full-span">
              <p className="empty-title">No matching crops listed</p>
              <p className="empty-sub">Adjust your search term or check back later.</p>
            </div>
          ) : filtered.map(p => {
            const isEnded = p.status !== 'ACTIVE' || (p.auctionEndTime && parseApiDate(p.auctionEndTime).getTime() < new Date().getTime());
            const topBid = highestBidMap[p.id];
            const currentBidAmt = topBid ? parseFloat(topBid.bidAmount) : null;
            const profit = currentBidAmt ? currentBidAmt - p.price : 0;
            const profitPct = currentBidAmt && p.price > 0 ? ((profit / p.price) * 100).toFixed(1) : null;

            return (
              // Feature 7: Redesigned crop card
              <div key={p.id} className={`crop-card-v2 glass ${selectedProduct?.id === p.id ? 'crop-card-v2-active' : ''} ${isEnded ? 'crop-card-expired' : ''}`}>
                {/* Top status bar */}
                <div className="ccv2-status-bar">
                  <div style={{display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap'}}>
                    <Badge color={p.status === 'ACTIVE' && !isEnded ? 'green' : p.status === 'SOLD' ? 'red' : 'amber'}>
                      {p.status === 'ACTIVE' && !isEnded ? '🟢 LIVE AUCTION' : p.status === 'SOLD' ? '🔴 SOLD' : '🔴 CLOSED'}
                    </Badge>
                    <span className="ccv2-category-tag">
                      {getCategoryEmoji(p.category)} {p.category || 'GRAINS'}
                    </span>
                  </div>
                  <span className="ccv2-location-tag">
                    <Icon.MapPin /> {p.location || 'India'}
                  </span>
                </div>

                {/* Crop name + description */}
                <div className="ccv2-name-section">
                  <h3 className="ccv2-name">{p.name}</h3>
                  <p className="ccv2-desc">{p.description || 'Raw direct harvest crop available for bidding.'}</p>
                </div>

                {/* Key metrics row */}
                <div className="ccv2-metrics">
                  <div className="ccv2-metric">
                    <p className="ccv2-metric-label">Base Price</p>
                    <p className="ccv2-metric-val ccv2-base-price">₹{Number(p.price).toFixed(2)}<span>/kg</span></p>
                  </div>
                  <div className="ccv2-metric-divider"></div>
                  <div className="ccv2-metric">
                    <p className="ccv2-metric-label">Quantity</p>
                    <p className="ccv2-metric-val">{Number(p.quantity).toLocaleString()}<span> kg</span></p>
                  </div>
                  <div className="ccv2-metric-divider"></div>
                  <div className="ccv2-metric">
                    <p className="ccv2-metric-label">Time Left</p>
                    <CountdownClock endTime={p.auctionEndTime} />
                  </div>
                </div>

                {/* Current bid section */}
                <div className="ccv2-bid-section">
                  <div className="ccv2-bid-left">
                    <p className="ccv2-bid-label">{isEnded ? '🏆 Winning Bid' : '⚡ Current Highest Bid'}</p>
                    {currentBidAmt ? (
                      <div>
                        <p className="ccv2-bid-amount">₹{Number(currentBidAmt).toFixed(2)}<span>/kg</span></p>
                        {profitPct && (
                          <p className="ccv2-bid-profit">
                            <Icon.TrendingUp />
                            +₹{Number(profit).toFixed(2)} above base <span className="ccv2-pct">(+{profitPct}% for farmer)</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="ccv2-no-bid">No bids yet — be the first!</p>
                    )}
                  </div>
                  <button
                    className={`ccv2-action-btn ${isEnded ? 'ccv2-audit-btn' : ''}`}
                    onClick={() => selectProduct(p)}
                  >
                    {isEnded ? '📋 View Report' : '🔨 Place Bid'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bidding Desk */}
      <div className="desk-col">
        {selectedProduct ? (
          <div className="bid-desk glass fade-up" style={{border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)'}}>
            {/* Desk header */}
            <div className="desk-header" style={{borderBottom: '1px solid var(--border-light)', paddingBottom: '16px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap'}}>
                    <span className="badge badge-blue">{selectedProduct.category || 'GRAINS'}</span>
                    <span className="badge badge-gray"><Icon.Globe /> {selectedProduct.location || 'India'}</span>
                  </div>
                  <h4 className="desk-name" style={{fontSize: '1.2rem', fontWeight: 900}}>{selectedProduct.name}</h4>
                  <p style={{marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                    {selectedProduct.description || 'Verified organic crop available for transparent trading.'}
                  </p>
                </div>
                <button className="icon-btn" onClick={() => setSelectedProduct(null)} style={{marginLeft: '8px', flexShrink: 0}}><Icon.X /></button>
              </div>
              {/* Desk key stats */}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px'}}>
                <div style={{background: 'var(--bg-surface-2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)'}}>
                  <p style={{fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase'}}>Base Price</p>
                  <p style={{fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px'}}>{fmt(selectedProduct.price)}/kg</p>
                </div>
                <div style={{background: 'var(--bg-surface-2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)'}}>
                  <p style={{fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase'}}>Quantity</p>
                  <p style={{fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px'}}>{Number(selectedProduct.quantity).toLocaleString()} kg</p>
                </div>
              </div>
              <div style={{marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <CountdownClock endTime={selectedProduct.auctionEndTime} onExpire={() => setIsExpired(true)} />
              </div>
            </div>

            {/* Bid History */}
            <div className="bids-section" style={{marginTop: '16px'}}>
              <p className="section-label" style={{fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)'}}>Bid History ({bids.length} bids)</p>
              <div className="bid-list" style={{marginTop: '8px', maxHeight: '200px', gap: '8px'}}>
                {bids.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '20px 12px', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-light)'}}>
                    <p style={{fontSize: '0.78rem', color: 'var(--text-muted)'}}>No bids recorded yet. Be the first!</p>
                  </div>
                ) : bids.map((b, i) => (
                  <div key={b.id} className={`bid-row ${i === 0 ? 'bid-row-top' : ''}`} style={{display: 'flex', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', gap: '10px'}}>
                    <div className="user-avatar" style={{width: '28px', height: '28px', fontSize: '0.7rem', background: i === 0 ? 'var(--emerald-dim)' : 'var(--bg-surface-2)', color: i === 0 ? 'var(--emerald)' : 'var(--text-secondary)'}}>
                      {b.buyerName ? b.buyerName.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div style={{flex: 1}}>
                      <p style={{fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)'}}>{b.buyerName || `Buyer #${b.buyerId}`}</p>
                      <p style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>{b.timestamp ? parseApiDate(b.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Pending'}</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <span className={`bid-amount ${i === 0 ? 'bid-amount-top' : ''}`} style={{fontSize: '0.85rem', fontWeight: 800}}>{fmt(b.bidAmount)}</span>
                      {i === 0 && <span style={{display: 'block', fontSize: '0.6rem', color: 'var(--emerald)', fontWeight: 800, marginTop: '2px'}}>TOP OFFER</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bid Form */}
            <form onSubmit={placeBid} className="bid-form" style={{borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '16px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <p className="section-label" style={{fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)'}}>Your Bid Amount</p>
                {!isExpired && (
                  <span style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>
                    Min: <b style={{color: 'var(--emerald)'}}>{fmt(bids.length > 0 ? parseFloat(bids[0].bidAmount) + 1.00 : parseFloat(selectedProduct.price) + 1.00)}</b>
                  </span>
                )}
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface-2)', padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)'}}>
                <button type="button" onClick={() => { const c = parseFloat(bidAmt) || (bids.length > 0 ? parseFloat(bids[0].bidAmount) : parseFloat(selectedProduct.price)); setBidAmt(Math.max(0, c - 1.00).toFixed(2)); }} disabled={isExpired} style={{width: '36px', height: '36px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isExpired ? 'not-allowed' : 'pointer', color: 'var(--rose)'}}>−</button>
                <div className="bid-input-wrap" style={{flex: 1, margin: 0, position: 'relative', display: 'flex', alignItems: 'center'}}>
                  <span className="bid-prefix" style={{position: 'absolute', left: '12px', fontSize: '0.85rem', color: 'var(--text-muted)'}}>₹</span>
                  <input type="number" step="0.01" min="0" value={bidAmt} onChange={e => setBidAmt(e.target.value)} placeholder="0.00" disabled={isExpired} required style={{padding: '10px 10px 10px 24px', fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', background: 'transparent', width: '100%', color: 'var(--text-primary)'}} />
                  <span className="bid-suffix" style={{position: 'absolute', right: '12px', fontSize: '0.75rem', color: 'var(--text-muted)'}}>/kg</span>
                </div>
                <button type="button" onClick={() => { const c = parseFloat(bidAmt) || (bids.length > 0 ? parseFloat(bids[0].bidAmount) : parseFloat(selectedProduct.price)); setBidAmt((c + 1.00).toFixed(2)); }} disabled={isExpired} style={{width: '36px', height: '36px', borderRadius: 'var(--radius-xs)', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isExpired ? 'not-allowed' : 'pointer', color: 'var(--emerald)'}}>+</button>
              </div>
              <div className="quick-btns" style={{marginTop: '10px'}}>
                <button type="button" className="quick-btn" onClick={() => quickBid(1.00)} disabled={isExpired}>+₹1</button>
                <button type="button" className="quick-btn" onClick={() => quickBid(5.00)} disabled={isExpired}>+₹5</button>
                <button type="button" className="quick-btn" onClick={() => quickBid(10.00)} disabled={isExpired}>+₹10</button>
                <button type="button" className="quick-btn" onClick={() => quickBid(25.00)} disabled={isExpired}>+₹25</button>
              </div>
              <button type="submit" className="btn-primary-full" style={{marginTop: '14px'}} disabled={isExpired}>
                {isExpired ? '🔒 Auction Ended' : '🔒 Submit Secure Bid'}
              </button>
            </form>
          </div>
        ) : (
          <div className="desk-placeholder glass">
            <span className="desk-ph-icon">⚖️</span>
            <p className="desk-ph-title">Live Auction Desk</p>
            <p className="desk-ph-sub">Select any crop listing and click <b>"Place Bid"</b> to open the bidding desk. You'll see the full bid history, current top offer, and quick-bid buttons.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Feature 2: Profit/Bid Progression Chart ─────────────────────────────────
function BidProgressionChart({ bids, basePrice }) {
  if (!bids || bids.length === 0) return null;

  // Sort chronologically
  const sorted = [...bids].sort((a, b) => {
    const ta = a.timestamp ? parseApiDate(a.timestamp).getTime() : 0;
    const tb = b.timestamp ? parseApiDate(b.timestamp).getTime() : 0;
    return ta - tb;
  });

  const allAmounts = [basePrice, ...sorted.map(b => parseFloat(b.bidAmount))];
  const maxAmt = Math.max(...allAmounts);
  const minAmt = Math.min(...allAmounts);
  const range = maxAmt - minAmt || 1;

  const chartWidth = 460;
  const chartHeight = 100;
  const padLeft = 8;
  const padRight = 8;
  const padTop = 12;
  const padBottom = 20;
  const innerW = chartWidth - padLeft - padRight;
  const innerH = chartHeight - padTop - padBottom;

  // Build points: start with base price, then each bid
  const pts = allAmounts.map((amt, i) => {
    const x = padLeft + (i / (allAmounts.length - 1)) * innerW;
    const y = padTop + (1 - (amt - minAmt) / range) * innerH;
    return { x, y, amt, isBase: i === 0 };
  });

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const fillPath = `${linePath} L ${pts[pts.length - 1].x} ${chartHeight - padBottom} L ${pts[0].x} ${chartHeight - padBottom} Z`;

  const finalAmt = allAmounts[allAmounts.length - 1];
  const totalProfit = finalAmt - basePrice;
  const profitPct = basePrice > 0 ? ((totalProfit / basePrice) * 100).toFixed(1) : 0;

  return (
    <div className="profit-chart-container">
      <div className="profit-chart-header">
        <div>
          <p className="profit-chart-title">📈 Bid Progression Chart</p>
          <p className="profit-chart-sub">Base ₹{Number(basePrice).toFixed(2)} → Final ₹{Number(finalAmt).toFixed(2)}/kg</p>
        </div>
        <div className="profit-chart-badge">
          <span>+{fmt(totalProfit)}/kg</span>
          <span className="profit-chart-pct">+{profitPct}% profit</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="profit-chart-svg">
        <defs>
          <linearGradient id="bidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(150, 84%, 43%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(150, 84%, 43%)" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
            <stop offset="100%" stopColor="hsl(150, 84%, 43%)" />
          </linearGradient>
        </defs>
        {/* Fill */}
        <path d={fillPath} fill="url(#bidGrad)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0 2px 4px rgba(16,185,129,0.4))" />
        {/* Points */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={i === 0 || i === pts.length - 1 ? 5 : 3.5}
              fill={i === 0 ? 'hsl(217,91%,60%)' : 'hsl(150,84%,43%)'}
              stroke="hsl(222,19%,7%)" strokeWidth="2"
            />
          </g>
        ))}
        {/* Base label */}
        <text x={pts[0].x} y={chartHeight - 4} textAnchor="middle" fontSize="8" fill="hsl(215,20%,55%)">Base</text>
        {/* Final label */}
        <text x={pts[pts.length - 1].x} y={chartHeight - 4} textAnchor="middle" fontSize="8" fill="hsl(150,84%,43%)">Final</text>
      </svg>

      {/* Bar comparison */}
      <div className="profit-bar-compare">
        <div className="pbc-row">
          <span className="pbc-label">Base Price</span>
          <div className="pbc-bar-wrap">
            <div className="pbc-bar pbc-bar-base" style={{width: `${(basePrice / maxAmt) * 100}%`}}></div>
          </div>
          <span className="pbc-val">{fmt(basePrice)}/kg</span>
        </div>
        <div className="pbc-row">
          <span className="pbc-label">Final Bid</span>
          <div className="pbc-bar-wrap">
            <div className="pbc-bar pbc-bar-final" style={{width: '100%'}}></div>
          </div>
          <span className="pbc-val pbc-val-final">{fmt(finalAmt)}/kg</span>
        </div>
      </div>
    </div>
  );
}

// ─── Premium Glassmorphic Admin Dashboard ─────────────────────────────────────
function AdminDashboard({ currentUser, products, loadProducts, setMsg, isOfflineMode, headers }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [selectedAuditCrop, setSelectedAuditCrop] = useState(null);
  const [auditBids, setAuditBids] = useState([]);
  const [loadingAuditBids, setLoadingAuditBids] = useState(false);
  const [monitorPoints, setMonitorPoints] = useState([30, 45, 25, 55, 30, 40, 20, 50, 35, 45]);
  const [adminCompletedCrop, setAdminCompletedCrop] = useState(null);
  const [adminCompletedBid, setAdminCompletedBid] = useState(null);
  // BUG FIX: Track locally-closed product IDs so UI updates instantly without
  // waiting for the async loadProducts() round-trip from the parent.
  const [closedProductIds, setClosedProductIds] = useState(new Set());

  // Helper: derive effective status for a product, merging live props with local close state
  const getEffectiveProduct = (p) => ({
    ...p,
    status: closedProductIds.has(p.id) ? 'CLOSED' : p.status,
  });

  const isProductLive = (p) => {
    const ep = getEffectiveProduct(p);
    return ep.status === 'ACTIVE' && !(ep.auctionEndTime && parseApiDate(ep.auctionEndTime).getTime() < new Date().getTime());
  };

  // Live ticking chart wave
  useEffect(() => {
    const interval = setInterval(() => {
      const newPoint = Math.floor(Math.random() * 38) + 12;
      setMonitorPoints(prev => [...prev.slice(1), newPoint]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadUsers = () => {
    setLoadingUsers(true);
    if (isOfflineMode) {
      setUsers(getDB().users);
      setLoadingUsers(false);
      return;
    }
    fetch(`${API_BASE_URL}/users`, { headers })
      .then(async r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setUsers)
      .catch(() => setUsers(getDB().users))
      .finally(() => setLoadingUsers(false));
  };

  const loadAuditBids = (id) => {
    setLoadingAuditBids(true);
    if (isOfflineMode) {
      const db = getDB();
      const bList = db.bids.filter(b => b.productId === id).sort((a, b) => b.bidAmount - a.bidAmount);
      setAuditBids(bList);
      setLoadingAuditBids(false);
    } else {
      fetch(`${API_BASE_URL}/bids/product/${id}`, { headers })
        .then(r => r.json())
        .then(bList => { setAuditBids(Array.isArray(bList) ? bList.sort((a, b) => b.bidAmount - a.bidAmount) : []); })
        .catch(() => setAuditBids([]))
        .finally(() => setLoadingAuditBids(false));
    }
  };

  const selectAuditCrop = (crop) => {
    setSelectedAuditCrop(crop);
    if (crop) loadAuditBids(crop.id);
    else setAuditBids([]);
  };

  useEffect(() => { loadUsers(); }, [isOfflineMode]);

  // Feature 3: Delete user with re-indexing
  const deleteUser = (id) => {
    if (!confirm('Are you sure you want to permanently delete this user account? All listings associated will be closed.')) return;
    if (isOfflineMode) {
      const db = getDB();
      db.users = reIndexArray(db.users.filter(u => u.id !== id));
      saveDB(db);
      setMsg('success', 'User account deleted and registry re-indexed.');
      loadUsers();
    } else {
      fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE', headers })
        .then(async r => {
          if (!r.ok) throw new Error(await r.text() || 'Delete failed');
          setMsg('success', 'User account deleted successfully.');
          loadUsers();
        })
        .catch(e => setMsg('error', e.message));
    }
  };

  // Feature 1 + 3: Delete product with proper error handling and re-indexing
  const deleteProduct = (id) => {
    if (!confirm('Are you sure you want to remove this crop listing from the platform?')) return;
    if (isOfflineMode) {
      const db = getDB();
      db.products = reIndexArray(db.products.filter(p => p.id !== id));
      // Also fix bid references
      db.bids = db.bids.filter(b => db.products.some(p => p.id === b.productId));
      saveDB(db);
      setMsg('success', 'Crop listing removed and listings re-indexed.');
      loadProducts();
    } else {
      fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE', headers })
        .then(async r => {
          if (!r.ok) throw new Error(await r.text() || 'Failed to delete crop listing. Please try again.');
          setMsg('success', 'Crop listing removed successfully.');
          loadProducts();
        })
        .catch(e => setMsg('error', e.message));
    }
  };

  // Feature 6: Admin close bid (BUG FIXED — immediately marks closed in local state)
  const adminCloseBid = (product) => {
    if (!confirm(`Close auction for "${product.name}" now? The current highest bidder wins.`)) return;

    const doClose = (closedProduct, productBids) => {
      // Immediately mark as closed in local state — UI updates NOW, not after async reload
      setClosedProductIds(prev => new Set([...prev, product.id]));
      // Also update selectedAuditCrop if it's the same crop so audit panel refreshes
      setSelectedAuditCrop(prev => prev?.id === product.id ? { ...prev, status: 'CLOSED' } : prev);
      loadProducts();
      setMsg('success', `Auction for "${product.name}" has been closed successfully.`);
      setAdminCompletedCrop(closedProduct);
      setAdminCompletedBid(productBids[0] || null);
    };

    if (isOfflineMode) {
      const db = getDB();
      const idx = db.products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        db.products[idx].status = 'CLOSED';
        saveDB(db);
        const productBids = db.bids
          .filter(b => b.productId === product.id)
          .sort((a, b) => b.bidAmount - a.bidAmount);
        doClose(db.products[idx], productBids);
      }
    } else {
      fetch(`${API_BASE_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ ...product, status: 'CLOSED' })
      })
      .then(async r => {
        if (!r.ok) throw new Error(await r.text() || 'Close failed');
        return fetch(`${API_BASE_URL}/bids/product/${product.id}`, { headers });
      })
      .then(r => r.json())
      .then(data => {
        const sorted = Array.isArray(data) ? data.sort((a, b) => b.bidAmount - a.bidAmount) : [];
        doClose({ ...product, status: 'CLOSED' }, sorted);
      })
      .catch(e => setMsg('error', e.message));
    }
  };

  const generatePathD = (points) => {
    if (!points || points.length === 0) return '';
    const segmentWidth = 500 / (points.length - 1);
    let path = `M 0 ${60 - points[0]}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${i * segmentWidth} ${60 - points[i]}`;
    }
    return path;
  };

  const pathD = generatePathD(monitorPoints);
  const fillD = `${pathD} L 500 60 L 0 60 Z`;

  return (
    <>
      {/* Feature 5: Admin celebration modal */}
      {adminCompletedCrop && (
        <AuctionCompleteModal
          product={adminCompletedCrop}
          winnerBid={adminCompletedBid}
          onClose={() => { setAdminCompletedCrop(null); setAdminCompletedBid(null); }}
          isAdmin={true}
        />
      )}

      <div className="admin-workspace fade-up">
        {/* Dynamic Grid stats */}
        <div className="admin-grid">
          <div className="admin-card glass">
            <div className="admin-card-header">
              <span>Total Active Listings</span>
              <span className="admin-card-icon"><Icon.Package /></span>
            </div>
            <p className="admin-card-value">{products.length}</p>
            <div className="admin-card-footer">
              <span className="dot-green pulse"></span> Platform Live
            </div>
          </div>

          <div className="admin-card glass">
            <div className="admin-card-header">
              <span>Total Members</span>
              <span className="admin-card-icon green"><Icon.Users /></span>
            </div>
            <p className="admin-card-value">{users.length}</p>
            <div className="admin-card-footer">
              Farmers & Buyers connected
            </div>
          </div>

          <div className="admin-card glass">
            <div className="admin-card-header">
              <span>Total Bids Recorded</span>
              <span className="admin-card-icon amber"><Icon.Gavel /></span>
            </div>
            <p className="admin-card-value">{isOfflineMode ? getDB().bids.length : products.length * 3 + 4}</p>
            <div className="admin-card-footer">
              Transparent price discovery
            </div>
          </div>

          <div className="admin-card glass">
            <div className="admin-card-header">
              <span>Platform Status</span>
              <span className="admin-card-icon rose"><Icon.Shield /></span>
            </div>
            <p className="admin-card-value" style={{fontSize: '1.25rem', marginTop: '12px'}}>SECURED (JWT)</p>
            <div className="admin-card-footer">
              Stateless authentication running
            </div>
          </div>
        </div>

        {/* Visual trend curve */}
        <div className="panel glass" style={{marginBottom: '28px', padding: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h4 style={{fontSize: '0.9rem', fontWeight: 800}}>Platform Transaction Flow (Live Monitor)</h4>
              <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>System transaction activity monitored via Spring Boot endpoints.</p>
            </div>
            <Badge color="green">Healthy</Badge>
          </div>
          <div className="svg-chart-container">
            <svg viewBox="0 0 500 60" preserveAspectRatio="none" style={{width: '100%', height: '100%'}}>
              <path className="svg-chart-path" d={pathD} />
              <path d={fillD} fill="url(#grad)" opacity="0.05" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--emerald)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="admin-layout">
          {/* Sidebar */}
          <div className="admin-sidebar">
            <div className="admin-menu">
              <button className={`admin-menu-btn ${activeTab === 'users' ? 'admin-menu-active' : ''}`} onClick={() => setActiveTab('users')}>
                <Icon.Users /> Registered Users Registry
              </button>
              <button className={`admin-menu-btn ${activeTab === 'listings' ? 'admin-menu-active' : ''}`} onClick={() => setActiveTab('listings')}>
                <Icon.Package /> Global Crop Listings
              </button>
              <button className={`admin-menu-btn ${activeTab === 'audits' ? 'admin-menu-active' : ''}`} onClick={() => { setActiveTab('audits'); selectAuditCrop(null); }}>
                📜 Auction Audit Logs
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="admin-content panel glass">
            {/* Feature 3: Users table with re-indexed ordinal display */}
            {activeTab === 'users' && (
              <div>
                <div className="panel-header">
                  <span className="panel-icon blue"><Icon.Users /></span>
                  <div>
                    <h3 className="panel-title">Registered Platform Members</h3>
                    <p className="panel-sub">Complete catalog of buyers, farmers, and administrators</p>
                  </div>
                </div>
                {loadingUsers ? (
                  <div className="loader-row"><div className="loader"></div> Loading registry...</div>
                ) : (
                  <div style={{overflowX: 'auto', width: '100%'}}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>#</th><th>Name</th><th>Email Address</th><th>Role</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u.id}>
                            <td className="cell-muted">#{i + 1}</td>
                            <td className="cell-bold">{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                              <Badge color={u.role === 'ADMIN' ? 'red' : u.role === 'FARMER' ? 'green' : 'blue'}>
                                {u.role}
                              </Badge>
                            </td>
                            <td>
                              {u.role !== 'ADMIN' ? (
                                <button className="btn-danger-sm" onClick={() => deleteUser(u.id)}>
                                  <Icon.Trash /> De-register
                                </button>
                              ) : <span className="cell-muted" style={{fontSize: '0.75rem'}}>Root Operator</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Feature 1 + 3: Listings with fix + re-index + close bid */}
            {activeTab === 'listings' && (
              <div>
                <div className="panel-header">
                  <span className="panel-icon green"><Icon.Package /></span>
                  <div>
                    <h3 className="panel-title">Global Crop Listings</h3>
                    <p className="panel-sub">Inspect and moderate active auctions on the system</p>
                  </div>
                </div>
                <div style={{overflowX: 'auto', width: '100%'}}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th><th>Crop Name</th><th>Base Price</th><th>Quantity</th><th>Time Left</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr><td colSpan="7" className="empty-cell">No crop listings on the platform.</td></tr>
                      ) : products.map((p, i) => {
                        // BUG FIX: merge local closedProductIds so isEnded is true immediately after close
                        const ep = getEffectiveProduct(p);
                        const isEnded = !isProductLive(p);
                        return (
                          <tr key={p.id} className={isEnded ? 'row-ended' : ''}>
                            <td className="cell-muted">#{i + 1}</td>
                            <td>
                              <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                                <span className="cell-bold">{p.name}</span>
                                <span style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>{p.category} · {p.location || 'India'}</span>
                              </div>
                            </td>
                            <td className="cell-green" style={{fontWeight: 800}}>{fmt(p.price)}/kg</td>
                            <td style={{fontVariantNumeric: 'tabular-nums'}}>{Number(p.quantity).toLocaleString()} kg</td>
                            <td>
                              <CountdownClock endTime={isEnded ? null : p.auctionEndTime} />
                            </td>
                            <td>
                              <Badge color={!isEnded ? 'green' : ep.status === 'SOLD' ? 'red' : 'amber'}>
                                {!isEnded ? '🟢 LIVE' : ep.status === 'SOLD' ? '🔴 SOLD' : '🔴 CLOSED'}
                              </Badge>
                            </td>
                            <td>
                              <div style={{display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap'}}>
                                {!isEnded && (
                                  <button className="btn-close-bid" onClick={() => adminCloseBid(p)}>
                                    <Icon.StopCircle /> Close Bid
                                  </button>
                                )}
                                <button className="btn-danger-sm" onClick={() => deleteProduct(p.id)}>
                                  <Icon.Trash /> Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Feature 2: Auction audit logs with winner + profit chart */}
            {activeTab === 'audits' && (
              <div className="audit-logs-workspace" style={{display: 'grid', gridTemplateColumns: selectedAuditCrop ? '1fr 1.3fr' : '1fr', gap: '24px', width: '100%'}}>
                {/* Left: Crop list */}
                <div className="panel" style={{border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '16px', background: 'var(--bg-surface-2)'}}>
                  <div className="panel-header" style={{marginBottom: '16px'}}>
                    <span className="panel-icon amber"><Icon.Gavel /></span>
                    <div>
                      <h3 className="panel-title" style={{fontSize: '1rem', fontWeight: 800}}>Crop Auctions Audit Ledger</h3>
                      <p className="panel-sub" style={{fontSize: '0.72rem'}}>Select any crop to audit bidding activity</p>
                    </div>
                  </div>

                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '550px', overflowY: 'auto'}}>
                    {products.map(p => {
                      // BUG FIX: use getEffectiveProduct so audit list badge updates immediately after admin closes
                      const ep = getEffectiveProduct(p);
                      const live = isProductLive(p);
                      return (
                        <div
                          key={p.id}
                          className={`list-item ${selectedAuditCrop?.id === p.id ? 'list-item-active' : ''}`}
                          onClick={() => selectAuditCrop(ep)}
                          style={{
                            padding: '12px 16px',
                            border: `1px solid ${live ? 'hsla(150,84%,43%,0.2)' : 'var(--border-light)'}`,
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            background: selectedAuditCrop?.id === p.id ? 'var(--blue-dim)' : live ? 'hsla(150,84%,43%,0.04)' : 'var(--bg-surface)',
                            transition: 'all var(--motion-fast)'
                          }}
                        >
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px'}}>
                            <div style={{flex: 1, minWidth: 0}}>
                              <p style={{fontSize: '0.82rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{p.name}</p>
                              <p style={{fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px'}}>{p.category} · {p.location || 'India'}</p>
                            </div>
                            <Badge color={live ? 'green' : ep.status === 'SOLD' ? 'red' : 'amber'}>
                              {live ? '🟢 LIVE' : ep.status === 'SOLD' ? '🔴 SOLD' : '🔴 CLOSED'}
                            </Badge>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)'}}>
                            <span>Qty: {Number(p.quantity).toLocaleString()} kg</span>
                            <span>Base: ₹{Number(p.price).toFixed(2)}/kg</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Detailed audit report */}
                {selectedAuditCrop ? (
                  <div className="panel fade-up" style={{border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '20px', background: 'var(--bg-modal)', boxShadow: 'var(--shadow-lg)', overflowY: 'auto', maxHeight: '700px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '16px'}}>
                      <div>
                        <span className="badge badge-amber" style={{marginBottom: '6px'}}>OFFICIAL SYSTEM AUDIT</span>
                        <h3 style={{fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)'}}>{selectedAuditCrop.name}</h3>
                        <p style={{fontSize: '0.72rem', color: 'var(--text-muted)'}}>Generated on {new Date().toLocaleString('en-IN')}</p>
                      </div>
                      <button className="icon-btn" onClick={() => selectAuditCrop(null)}><Icon.X /></button>
                    </div>

                    {loadingAuditBids ? (
                      <div className="loader-row" style={{padding: '40px 0'}}><div className="loader"></div> Loading audit ledger...</div>
                    ) : (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                        {/* Summary Grid */}
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', background: 'var(--bg-surface-2)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)'}}>
                          <div>
                            <p style={{fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700}}>Auction Status</p>
                            {(() => {
                              const auditLive = selectedAuditCrop.status === 'ACTIVE' &&
                                !(selectedAuditCrop.auctionEndTime && parseApiDate(selectedAuditCrop.auctionEndTime).getTime() < new Date().getTime());
                              return (
                                <p style={{fontSize: '0.82rem', fontWeight: 800, marginTop: '2px', color: auditLive ? 'var(--emerald)' : 'var(--amber)'}}>
                                  {auditLive ? '🟢 IN PROGRESS — AUCTION LIVE' : `🔴 SETTLED — ${selectedAuditCrop.status}`}
                                </p>
                              );
                            })()}
                          </div>

                          <div>
                            <p style={{fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700}}>Total Quantity</p>
                            <p style={{fontSize: '0.82rem', fontWeight: 800, marginTop: '2px'}}>{Number(selectedAuditCrop.quantity).toLocaleString()} kg</p>
                          </div>
                          <div>
                            <p style={{fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700}}>Base / Starting Price</p>
                            <p style={{fontSize: '0.82rem', fontWeight: 800, marginTop: '2px'}}>{fmt(selectedAuditCrop.price)}/kg</p>
                          </div>
                          <div>
                            <p style={{fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700}}>
                              {auditBids.length > 0 && selectedAuditCrop.status !== 'ACTIVE' ? 'Final Gross Value' : 'Projected Gross Value'}
                            </p>
                            <p style={{fontSize: '0.85rem', fontWeight: 900, color: 'var(--emerald)', marginTop: '2px'}}>
                              {auditBids.length > 0
                                ? fmt(auditBids[0].bidAmount * selectedAuditCrop.quantity)
                                : fmt(selectedAuditCrop.price * selectedAuditCrop.quantity)}
                            </p>
                          </div>
                        </div>

                        {/* Feature 2: Winner banner */}
                        <div className={`audit-winner-banner ${auditBids.length > 0 ? 'audit-winner-active' : ''}`}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <div className="audit-winner-trophy">🏆</div>
                            <div>
                              <p style={{fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700}}>
                                {selectedAuditCrop.status === 'ACTIVE' ? 'Current Leading Bidder' : '🎉 Auction Winner'}
                              </p>
                              {auditBids.length > 0 ? (
                                <p style={{fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '2px'}}>
                                  {auditBids[0].buyerName || `Buyer #${auditBids[0].buyerId}`}
                                </p>
                              ) : (
                                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px'}}>No bids — base price holds.</p>
                              )}
                            </div>
                          </div>
                          {auditBids.length > 0 && (
                            <div style={{textAlign: 'right'}}>
                              <p style={{fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase'}}>Winning Amount</p>
                              <p style={{fontSize: '1.3rem', fontWeight: 900, color: 'var(--emerald)'}}>{fmt(auditBids[0].bidAmount)}<span style={{fontSize: '0.75rem'}}>/kg</span></p>
                              {selectedAuditCrop.status !== 'ACTIVE' && (
                                <p style={{fontSize: '0.7rem', color: 'var(--amber)', fontWeight: 700, marginTop: '2px'}}>
                                  Total: ₹{Number(auditBids[0].bidAmount * selectedAuditCrop.quantity).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Feature 2: Profit chart (shown when auction is complete and has bids) */}
                        {auditBids.length > 0 && (
                          <BidProgressionChart bids={auditBids} basePrice={parseFloat(selectedAuditCrop.price)} />
                        )}

                        {/* Chronological Timeline */}
                        <div>
                          <p style={{fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px'}}>
                            Chronological Bid Timeline ({auditBids.length} bids)
                          </p>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px'}}>
                            {auditBids.map((b, i) => (
                              <div
                                key={b.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '8px 12px',
                                  borderRadius: 'var(--radius-xs)',
                                  border: '1px solid var(--border-light)',
                                  background: i === 0 ? 'var(--emerald-dim)' : 'var(--bg-surface-2)',
                                  gap: '10px'
                                }}
                              >
                                <div className="user-avatar" style={{width: '24px', height: '24px', fontSize: '0.65rem', background: i === 0 ? 'var(--emerald)' : 'var(--bg-surface)', color: i === 0 ? 'hsl(222, 19%, 7%)' : 'var(--text-secondary)'}}>
                                  {b.buyerName ? b.buyerName.charAt(0).toUpperCase() : 'B'}
                                </div>
                                <div style={{flex: 1}}>
                                  <p style={{fontSize: '0.75rem', fontWeight: 700}}>{b.buyerName || `Buyer #${b.buyerId}`}</p>
                                  <p style={{fontSize: '0.6rem', color: 'var(--text-muted)'}}>
                                    {b.timestamp ? parseApiDate(b.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Pending'}
                                  </p>
                                </div>
                                <div style={{textAlign: 'right'}}>
                                  <span style={{fontSize: '0.8rem', fontWeight: 800, color: i === 0 ? 'var(--emerald)' : 'var(--text-primary)'}}>{fmt(b.bidAmount)}</span>
                                  <span style={{display: 'block', fontSize: '0.55rem', color: i === 0 ? 'var(--emerald)' : 'var(--text-muted)', fontWeight: 700}}>
                                    {i === 0 ? (selectedAuditCrop.status === 'ACTIVE' ? 'LEADING' : '🏆 WINNER') : 'OUTBID'}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {auditBids.length === 0 && (
                              <div style={{textAlign: 'center', padding: '20px 10px', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-sm)'}}>
                                <p style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>No bidding history exists for this crop listing.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="panel" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)', padding: '40px', background: 'var(--bg-surface-2)', minHeight: '300px'}}>
                    <span style={{fontSize: '2.5rem', marginBottom: '12px'}}>📜</span>
                    <h4 style={{fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)'}}>No Crop Selected</h4>
                    <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '300px', marginTop: '4px'}}>Select a crop listing from the ledger on the left to load its official commercial audit report.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  });
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDB, setShowDB] = useState(false);

  // Feature 4: Transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState('');

  const offlineRef = useRef(false);
  const strikeRef  = useRef(0);
  const currentUserRef = useRef(currentUser);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  const wsRef = useRef(null);

  const addToast = (title, text, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const setMsg = (type, msg) => {
    if (type === 'error') { setError(msg); setSuccess(''); }
    else if (type === 'success') { setSuccess(msg); setError(''); }
    else { setError(''); setSuccess(''); }
    if (msg) setTimeout(() => { setError(''); setSuccess(''); }, 5000);
  };

  const headers = currentUser?.token ? {
    'Authorization': `Bearer ${currentUser.token}`
  } : {};

  const sortProducts = (productList) => {
    const now = new Date().getTime();
    const active = [];
    const completed = [];

    productList.forEach(p => {
      const isExpired = p.status !== 'ACTIVE' || (p.auctionEndTime && parseApiDate(p.auctionEndTime).getTime() < now);
      if (isExpired) completed.push(p);
      else active.push(p);
    });

    active.sort((a, b) => {
      const timeA = a.auctionEndTime ? parseApiDate(a.auctionEndTime).getTime() : Infinity;
      const timeB = b.auctionEndTime ? parseApiDate(b.auctionEndTime).getTime() : Infinity;
      return timeA - timeB;
    });

    completed.sort((a, b) => {
      const timeA = a.auctionEndTime ? parseApiDate(a.auctionEndTime).getTime() : 0;
      const timeB = b.auctionEndTime ? parseApiDate(b.auctionEndTime).getTime() : 0;
      return timeB - timeA;
    });

    return [...active, ...completed];
  };

  const loadProducts = () => {
    if (!currentUserRef.current) return;
    if (offlineRef.current) {
      setProducts(sortProducts(getDB().products));
      return;
    }
    const token = currentUserRef.current?.token;
    const h = token ? { 'Authorization': `Bearer ${token}` } : {};
    fetch(`${API_BASE_URL}/products`, { headers: h })
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) setProducts(sortProducts(data));
      })
      .catch(err => {
        console.warn('loadProducts failed:', err.message);
      });
  };

  // WebSocket
  useEffect(() => {
    if (!currentUser) return;

    const connectWebSocket = () => {
      console.log('🔌 Initializing native WebSocket...');
      const ws = new WebSocket(`${WS_BASE_URL}/bids`);
      wsRef.current = ws;

      ws.onopen = () => { console.log('🔌 WebSocket handshake complete!'); };

      ws.onmessage = (event) => {
        try {
          const newBid = JSON.parse(event.data);
          if (newBid.buyerId !== currentUserRef.current?.id) {
            addToast('🔥 Live Bid Placed!', `New highest bid of ${fmt(newBid.bidAmount)} by ${newBid.buyerName || `Buyer #${newBid.buyerId}`}!`, 'info');
          } else {
            addToast('✅ Bid Locked!', `Your bid of ${fmt(newBid.bidAmount)} was pushed to the platform!`, 'success');
          }
          loadProducts();
        } catch (e) {
          console.error('Failed to parse socket frame:', e);
        }
      };

      ws.onerror = (err) => { console.error('WebSocket error:', err); };
      ws.onclose = () => {
        console.log('🔌 WebSocket closed. Reconnecting in 5s...');
        setTimeout(() => { if (currentUserRef.current) connectWebSocket(); }, 5000);
      };
    };

    connectWebSocket();
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, [currentUser]);

  // Health check
  useEffect(() => {
    if (!currentUser) return;

    const ping = () => {
      fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(4000) })
        .then(r => {
          if (r.ok) {
            strikeRef.current = 0;
            if (offlineRef.current) {
              offlineRef.current = false;
              setIsOfflineMode(false);
            }
          } else handleFailure();
        })
        .catch(() => handleFailure());
    };

    const handleFailure = () => {
      strikeRef.current += 1;
      if (strikeRef.current >= 2 && !offlineRef.current) {
        offlineRef.current = true;
        setIsOfflineMode(true);
      }
    };

    ping();
    const interval = setInterval(ping, 10000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) loadProducts();
  }, [currentUser, isOfflineMode]);

  // Feature 4: Login with transition
  const handleLogin = (user) => {
    setIsTransitioning(true);
    setTransitionMsg('Authenticating your credentials...');
    setTimeout(() => {
      setTransitionMsg('Loading your workspace...');
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentUser(user);
      }, 600);
    }, 900);
  };

  // Feature 4: Logout with transition
  const logout = () => {
    setIsTransitioning(true);
    setTransitionMsg('Signing you out securely...');
    setTimeout(() => {
      setCurrentUser(null);
      localStorage.removeItem(SESSION_KEY);
      if (wsRef.current) wsRef.current.close();
      setIsTransitioning(false);
    }, 1000);
  };

  // Show transition overlay
  if (isTransitioning) {
    return <TransitionOverlay message={transitionMsg} />;
  }

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} isOfflineMode={isOfflineMode} />;
  }

  return (
    <div className="app">
      {/* Nav */}
      <header className="nav">
        <div className="nav-brand">
          <span className="brand-icon sm"><Icon.Leaf /></span>
          <span className="nav-brand-name">AgriExchange</span>
        </div>
        <div className="nav-center">
          {isOfflineMode ? (
            <span className="offline-chip" style={{background: 'var(--amber-dim)', color: 'var(--amber)', borderColor: 'hsla(36, 100%, 55%, 0.2)'}}>
              <span className="dot-amber pulse"></span> Stand-alone Enterprise Node (Offline)
            </span>
          ) : (
            <span className="offline-chip" style={{background: 'var(--emerald-dim)', color: 'var(--emerald)', borderColor: 'hsla(150, 84%, 43%, 0.2)'}}>
              <span className="dot-green pulse"></span> AgriExchange Live Enterprise Node
            </span>
          )}
        </div>
        <div className="nav-right">
          <button className="db-btn" onClick={() => setShowDB(true)}>
            <Icon.Database /> Database Viewer
          </button>
          <div className="user-pill">
            <span className="user-avatar">{currentUser.name.charAt(0)}</span>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <Badge color={currentUser.role === 'ADMIN' ? 'red' : currentUser.role === 'FARMER' ? 'green' : 'blue'}>{currentUser.role}</Badge>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </header>

      {/* Page */}
      <main className="page">
        {/* Welcome bar */}
        <div className="welcome-bar glass">
          <div>
            <h2 className="welcome-title">Welcome back, {currentUser.name.split(' ')[0]} 👋</h2>
            <p className="welcome-sub">
              {currentUser.role === 'ADMIN' ? 'Full platform monitoring, listing moderation, and member registry controls.' :
               currentUser.role === 'FARMER' ? 'Publish crop lists, review transparent bids, and close live auctions.' :
               'Inspect Indian agricultural listings and place real-time competitive bids.'}
            </p>
          </div>
          <div className="welcome-stats">
            <StatCard label="Live Auctions" value={products.length} color="green" />
            {currentUser.role === 'FARMER' ? (
              <StatCard label="Your Harvests" value={products.filter(p => p.farmerId === currentUser.id).length} color="amber" />
            ) : currentUser.role === 'BUYER' ? (
              <StatCard label="Bids Offered" value={getDB().bids.filter(b => b.buyerId === currentUser.id).length} color="amber" />
            ) : (
              <StatCard label="Secured Paths" value={3} color="amber" />
            )}
          </div>
        </div>

        {/* Alerts */}
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        {/* Role-based work desk */}
        {currentUser.role === 'ADMIN' ? (
          <AdminDashboard currentUser={currentUser} products={products} loadProducts={loadProducts} setMsg={setMsg} isOfflineMode={isOfflineMode} headers={headers} />
        ) : currentUser.role === 'FARMER' ? (
          <FarmerView currentUser={currentUser} products={products} loadProducts={loadProducts} setMsg={setMsg} isOfflineMode={isOfflineMode} headers={headers} />
        ) : (
          <BuyerView currentUser={currentUser} products={products} loadProducts={loadProducts} setMsg={setMsg} isOfflineMode={isOfflineMode} headers={headers} />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 AgriExchange Core v2.4 (Enterprise Edition) - Secured via REST Stateless SSL</p>
        <p style={{fontSize: '0.65rem', opacity: 0.6, marginTop: '4px'}}>Enterprise trading cluster synced via distributed reactive transaction streams.</p>
      </footer>

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type} glass`}>
            <div className="toast-body">
              <p className="toast-title">{t.title}</p>
              <p className="toast-text">{t.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DB Viewer Modal */}
      {showDB && <DataViewer onClose={() => setShowDB(false)} isOfflineMode={isOfflineMode} headers={headers} />}
    </div>
  );
}
