import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

// ─── SVG Icon Library ─────────────────────────────────────────────────────────
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
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (val) => `₹${parseFloat(val).toFixed(2)}`;

// ─── Local DB (Offline Fallback) ──────────────────────────────────────────────
const LOCAL_KEY = 'agri_platform_local_db';
const SESSION_KEY = 'agri_user_session';

const seedDB = () => ({
  users: [
    { id: 1, name: 'Ravi Kumar', email: 'farmer@agri.com', role: 'FARMER' },
    { id: 2, name: 'Priya Sharma', email: 'buyer@agri.com', role: 'BUYER' },
  ],
  products: [
    { id: 1, name: 'Premium Basmati Rice', description: 'Long grain aromatic basmati, moisture < 12%, handpicked from Punjab fields.', price: 85.00, quantity: 2000, farmerId: 1 },
    { id: 2, name: 'Organic Wheat (Grade A)', description: 'Golden wheat harvested from certified organic farms. Ideal for flour mills.', price: 32.50, quantity: 5000, farmerId: 1 },
    { id: 3, name: 'Sun-dried Soybeans', description: 'Non-GMO soybeans, solar-dried, high protein content.', price: 55.00, quantity: 3000, farmerId: 1 },
  ],
  bids: [
    { id: 1, bidAmount: 90.00, productId: 1, buyerId: 2, timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, bidAmount: 96.50, productId: 1, buyerId: 2, timestamp: new Date(Date.now() - 1800000).toISOString() },
    { id: 3, bidAmount: 38.00, productId: 2, buyerId: 2, timestamp: new Date(Date.now() - 600000).toISOString() },
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
      <span className={`alert-dot dot-${type}`}></span>
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

// ─── Data Viewer Modal ─────────────────────────────────────────────────────────
function DataViewer({ onClose, isOfflineMode }) {
  const [tab, setTab] = useState('users');
  const [data, setData] = useState({ users: [], products: [], bids: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (isOfflineMode) {
        const db = getDB();
        setData(db);
        setLoading(false);
        return;
      }
      try {
        const [prodRes, bidsAllRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/bids/product/0`).catch(() => ({ ok: false })),
        ]);
        const products = prodRes.ok ? await prodRes.json() : [];
        // Fetch bids per product
        let bids = [];
        for (const p of products) {
          const br = await fetch(`${API_BASE_URL}/bids/product/${p.id}`);
          if (br.ok) {
            const pb = await br.json();
            bids = [...bids, ...pb];
          }
        }
        const db = getDB();
        setData({ users: db.users, products, bids });
      } catch {
        const db = getDB();
        setData(db);
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
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-icon"><Icon.Database /></span>
            <div>
              <h2 className="modal-title">Live Database Viewer</h2>
              <p className="modal-subtitle">{isOfflineMode ? 'Offline Mode — Browser Local Storage' : 'Connected — PostgreSQL via Spring Boot API'}</p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon.X /></button>
        </div>

        {/* Tabs */}
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

        {/* Content */}
        <div className="modal-content">
          {loading ? (
            <div className="loader-row"><div className="loader"></div> Loading data...</div>
          ) : (
            <>
              {tab === 'users' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.length === 0 ? (
                      <tr><td colSpan="4" className="empty-cell">No users registered yet.</td></tr>
                    ) : data.users.map(u => (
                      <tr key={u.id}>
                        <td className="cell-muted">#{u.id}</td>
                        <td className="cell-bold">{u.name}</td>
                        <td className="cell-muted">{u.email}</td>
                        <td><Badge color={u.role === 'FARMER' ? 'green' : 'blue'}>{u.role}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {tab === 'products' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Crop Name</th><th>Base Price/kg</th><th>Qty (kg)</th><th>Farmer ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.length === 0 ? (
                      <tr><td colSpan="5" className="empty-cell">No products listed yet.</td></tr>
                    ) : data.products.map(p => (
                      <tr key={p.id}>
                        <td className="cell-muted">#{p.id}</td>
                        <td className="cell-bold">{p.name}</td>
                        <td className="cell-green">{fmt(p.price)}</td>
                        <td>{Number(p.quantity).toLocaleString()}</td>
                        <td className="cell-muted">Farmer #{p.farmerId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {tab === 'bids' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Bid Amount</th><th>Product ID</th><th>Buyer ID</th><th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bids.length === 0 ? (
                      <tr><td colSpan="5" className="empty-cell">No bids placed yet.</td></tr>
                    ) : data.bids.map(b => (
                      <tr key={b.id}>
                        <td className="cell-muted">#{b.id}</td>
                        <td className="cell-green cell-bold">{fmt(b.bidAmount)}</td>
                        <td className="cell-muted">Product #{b.productId}</td>
                        <td className="cell-muted">Buyer #{b.buyerId}</td>
                        <td className="cell-muted">{b.timestamp ? new Date(b.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
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

// ─── Auth Screen ──────────────────────────────────────────────────────────────
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
    if (isOfflineMode) {
      const db = getDB();
      const user = db.users.find(u => u.email === email);
      if (user) {
        const s = { id: user.id, name: user.name, email: user.email, role: user.role };
        localStorage.setItem(SESSION_KEY, JSON.stringify(s));
        onLogin(s);
      } else setError('No account found with that email.');
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
      const user = { id: db.users.length + 1, name, email, role };
      db.users.push(user);
      saveDB(db);
      setSuccess('Registered! Please log in.');
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
        setSuccess('Account created! Please log in.');
        setTimeout(() => { setMode('login'); setEmail(email); setPassword(''); }, 1200);
      }).catch(err => setError(err.message));
    }
  };

  return (
    <div className="auth-wrap">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <span className="brand-icon"><Icon.Leaf /></span>
          <span className="brand-name">AgriExchange</span>
        </div>
        <h1 className="auth-headline">India's Crop<br />Bidding Platform</h1>
        <p className="auth-sub">Connect farmers directly with buyers. Transparent, real-time, fair.</p>
        <div className="auth-stats">
          <div className="auth-stat"><p className="as-val">1,200+</p><p className="as-lbl">Farmers</p></div>
          <div className="auth-stat"><p className="as-val">8,400+</p><p className="as-lbl">Bids Placed</p></div>
          <div className="auth-stat"><p className="as-val">₹2.4Cr+</p><p className="as-lbl">Transacted</p></div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-right">
        <div className="auth-card">
          {isOfflineMode && (
            <div className="offline-banner">
              <span className="dot-amber pulse"></span>
              Offline Demo Mode — Data stored in browser
            </div>
          )}

          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'login' ? 'auth-tab-active' : ''}`} onClick={() => { setMode('login'); clear(); }}>Sign In</button>
            <button className={`auth-tab ${mode === 'register' ? 'auth-tab-active' : ''}`} onClick={() => { setMode('register'); clear(); }}>Register</button>
          </div>

          <Alert type="error" message={error} onClose={() => setError('')} />
          <Alert type="success" message={success} onClose={() => setSuccess('')} />

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="field">
                <label>Email</label>
                <div className="input-wrap">
                  <span className="input-icon"><Icon.User /></span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="farmer@agri.com" required />
                </div>
              </div>
              <div className="field">
                <label>Password</label>
                <div className="input-wrap">
                  <span className="input-icon"><Icon.Lock /></span>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
              </div>
              <button type="submit" className="btn-primary-full">Sign In</button>
              <div className="demo-hint">
                <p>Demo accounts:</p>
                <p><b>farmer@agri.com</b> or <b>buyer@agri.com</b> — any password</p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="field">
                <label>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rajesh Patel" required />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
              </div>
              <div className="field">
                <label>I am a</label>
                <div className="role-toggle">
                  <button type="button" className={`role-btn ${role === 'FARMER' ? 'role-active' : ''}`} onClick={() => setRole('FARMER')}>🌾 Farmer</button>
                  <button type="button" className={`role-btn ${role === 'BUYER' ? 'role-active' : ''}`} onClick={() => setRole('BUYER')}>⚖️ Buyer</button>
                </div>
              </div>
              <button type="submit" className="btn-primary-full">Create Account</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Farmer View ──────────────────────────────────────────────────────────────
function FarmerView({ currentUser, products, loadProducts, setMsg, isOfflineMode }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [bids, setBids] = useState([]);

  const myProducts = products.filter(p => p.farmerId === currentUser.id);
  const selected = products.find(p => p.id === selectedId);

  const loadBids = (id) => {
    if (isOfflineMode) {
      const db = getDB();
      setBids(db.bids.filter(b => b.productId === id).sort((a, b) => b.bidAmount - a.bidAmount));
    } else {
      fetch(`${API_BASE_URL}/bids/product/${id}`).then(r => r.json()).then(setBids).catch(() => setBids([]));
    }
  };

  const selectProduct = (id) => { setSelectedId(id); loadBids(id); };

  const submit = (e) => {
    e.preventDefault();
    if (!name || !price || !qty) { setMsg('error', 'Fill in all required fields.'); return; }
    const payload = { name, description: desc, price: parseFloat(price), quantity: parseFloat(qty), farmerId: currentUser.id };
    if (isOfflineMode) {
      const db = getDB();
      db.products.push({ id: db.products.length + 1, ...payload });
      saveDB(db);
      setMsg('success', 'Listing published!');
      setName(''); setDesc(''); setPrice(''); setQty('');
      loadProducts();
    } else {
      fetch(`${API_BASE_URL}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); })
        .then(() => { setMsg('success', 'Listing published!'); setName(''); setDesc(''); setPrice(''); setQty(''); loadProducts(); })
        .catch(err => setMsg('error', err.message));
    }
  };

  return (
    <div className="two-col">
      {/* Left: Publish form */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-icon green"><Icon.Plus /></span>
          <div>
            <h3 className="panel-title">List a Crop</h3>
            <p className="panel-sub">Publish your harvest for buyers to bid on</p>
          </div>
        </div>
        <form onSubmit={submit} className="form-stack">
          <div className="field">
            <label>Crop Name <span className="req">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Organic Turmeric" required />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Base Price (₹/kg) <span className="req">*</span></label>
              <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 85.00" required />
            </div>
            <div className="field">
              <label>Quantity (kg) <span className="req">*</span></label>
              <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 1000" required />
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea rows="3" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Quality grade, moisture level, harvest date..."></textarea>
          </div>
          <button type="submit" className="btn-primary">Publish Listing</button>
        </form>
      </div>

      {/* Right: My listings + bid monitor */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-icon amber"><Icon.Trending /></span>
          <div>
            <h3 className="panel-title">My Listings</h3>
            <p className="panel-sub">{myProducts.length} active {myProducts.length === 1 ? 'crop' : 'crops'}</p>
          </div>
        </div>

        {myProducts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No listings yet</p>
            <p className="empty-sub">Use the form to publish your first crop.</p>
          </div>
        ) : (
          <div className="list-stack">
            {myProducts.map(p => (
              <div key={p.id} className={`list-item ${selectedId === p.id ? 'list-item-active' : ''}`} onClick={() => selectProduct(p.id)}>
                <div className="list-item-top">
                  <div>
                    <p className="item-name">{p.name}</p>
                    <p className="item-desc">{p.description || 'No description'}</p>
                  </div>
                  <div className="item-prices">
                    <Badge color="green">₹{Number(p.price).toFixed(2)}/kg</Badge>
                    <p className="item-qty">{Number(p.quantity).toLocaleString()} kg</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auction room for selected */}
        {selected && (
          <div className="auction-room">
            <div className="auction-header">
              <div>
                <p className="auction-label">Auction Room</p>
                <p className="auction-name">{selected.name}</p>
              </div>
              <button className="icon-btn" onClick={() => setSelectedId(null)}><Icon.X /></button>
            </div>
            <div className="bid-list">
              {bids.length === 0 ? (
                <p className="bid-empty">No bids yet. Buyers will appear here.</p>
              ) : bids.map((b, i) => (
                <div key={b.id} className={`bid-row ${i === 0 ? 'bid-row-top' : ''}`}>
                  <div className="bid-left">
                    <span className={`bid-dot ${i === 0 ? 'bid-dot-top' : ''}`}></span>
                    <span className="bid-buyer">Buyer #{b.buyerId}</span>
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
  );
}

// ─── Buyer View ───────────────────────────────────────────────────────────────
function BuyerView({ currentUser, products, loadProducts, setMsg, isOfflineMode }) {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmt, setBidAmt] = useState('');

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const loadBids = (id) => {
    if (isOfflineMode) {
      const db = getDB();
      setBids(db.bids.filter(b => b.productId === id).sort((a, b) => b.bidAmount - a.bidAmount));
    } else {
      fetch(`${API_BASE_URL}/bids/product/${id}`).then(r => r.json()).then(data => setBids(data)).catch(() => setBids([]));
    }
  };

  const selectProduct = (p) => { setSelectedProduct(p); loadBids(p.id); setMsg('', ''); };

  const quickBid = (inc) => {
    const base = bids.length > 0 ? bids[0].bidAmount : selectedProduct.price;
    setBidAmt((parseFloat(base) + inc).toFixed(2));
  };

  const placeBid = (e) => {
    e.preventDefault();
    const val = parseFloat(bidAmt);
    if (isNaN(val) || val <= 0) { setMsg('error', 'Enter a valid bid amount.'); return; }
    if (val <= selectedProduct.price) { setMsg('error', `Bid must be above base price of ${fmt(selectedProduct.price)}`); return; }
    const highest = bids.length > 0 ? parseFloat(bids[0].bidAmount) : 0;
    if (val <= highest) { setMsg('error', `Bid must beat current highest of ${fmt(highest)}`); return; }

    const payload = { bidAmount: val, productId: selectedProduct.id, buyerId: currentUser.id };
    if (isOfflineMode) {
      const db = getDB();
      db.bids.push({ id: db.bids.length + 1, ...payload, timestamp: new Date().toISOString() });
      saveDB(db);
      setMsg('success', 'Bid placed!');
      setBidAmt('');
      loadBids(selectedProduct.id);
      loadProducts();
    } else {
      fetch(`${API_BASE_URL}/bids`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(async r => { if (!r.ok) throw new Error(await r.text()); return r.json(); })
        .then(() => { setMsg('success', 'Bid placed!'); setBidAmt(''); loadBids(selectedProduct.id); loadProducts(); })
        .catch(err => setMsg('error', err.message));
    }
  };

  const highestBid = (productId) => {
    const db = getDB();
    const pb = db.bids.filter(b => b.productId === productId).sort((a, b) => b.bidAmount - a.bidAmount);
    return pb.length > 0 ? fmt(pb[0].bidAmount) : null;
  };

  return (
    <div className="buyer-layout">
      {/* Catalog */}
      <div className="catalog-col">
        <div className="search-bar">
          <span className="search-icon"><Icon.Search /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crops — rice, wheat, soybean..." />
          {search && <button className="clear-btn" onClick={() => setSearch('')}><Icon.X /></button>}
        </div>

        <div className="crop-grid">
          {filtered.length === 0 ? (
            <div className="empty-state full-span">
              <p className="empty-title">No listings found</p>
              <p className="empty-sub">Try a different search term.</p>
            </div>
          ) : filtered.map(p => (
            <div key={p.id} className={`crop-card ${selectedProduct?.id === p.id ? 'crop-card-active' : ''}`}>
              <div className="crop-card-top">
                <div>
                  <p className="crop-name">{p.name}</p>
                  <Badge color="green">LIVE</Badge>
                </div>
              </div>
              <p className="crop-desc">{p.description || 'Organic farm harvest listed for transparent bidding.'}</p>
              <div className="crop-tags">
                <span className="tag">₹{Number(p.price).toFixed(2)}/kg base</span>
                <span className="tag">{Number(p.quantity).toLocaleString()} kg</span>
              </div>
              <div className="crop-footer">
                <div>
                  <p className="crop-bid-label">Highest Bid</p>
                  <p className="crop-bid-val">{highestBid(p.id) || 'No bids yet'}</p>
                </div>
                <button className="btn-primary-sm" onClick={() => selectProduct(p)}>Place Bid</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bidding desk */}
      <div className="desk-col">
        {selectedProduct ? (
          <div className="bid-desk">
            <div className="desk-header">
              <div>
                <p className="desk-label">Bidding Desk</p>
                <p className="desk-name">{selectedProduct.name}</p>
                <p className="desk-desc">{selectedProduct.description}</p>
              </div>
              <button className="icon-btn" onClick={() => setSelectedProduct(null)}><Icon.X /></button>
            </div>

            {/* Bid history */}
            <div className="bids-section">
              <p className="section-label">Bid History</p>
              <div className="bid-list">
                {bids.length === 0 ? (
                  <p className="bid-empty">No bids yet — be the first!</p>
                ) : bids.map((b, i) => (
                  <div key={b.id} className={`bid-row ${i === 0 ? 'bid-row-top' : ''}`}>
                    <div className="bid-left">
                      <span className={`bid-dot ${i === 0 ? 'bid-dot-top' : ''}`}></span>
                      <span className="bid-buyer">Buyer #{b.buyerId}</span>
                      {i === 0 && <Badge color="green">Top</Badge>}
                    </div>
                    <span className={`bid-amount ${i === 0 ? 'bid-amount-top' : ''}`}>{fmt(b.bidAmount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Place bid */}
            <form onSubmit={placeBid} className="bid-form">
              <p className="section-label">Your Bid (₹/kg)</p>
              <div className="bid-input-wrap">
                <span className="bid-prefix">₹</span>
                <input type="number" step="0.01" min="0" value={bidAmt} onChange={e => setBidAmt(e.target.value)} placeholder="0.00" required />
                <span className="bid-suffix">/kg</span>
              </div>
              <div className="quick-btns">
                <button type="button" className="quick-btn" onClick={() => quickBid(5)}>+₹5</button>
                <button type="button" className="quick-btn" onClick={() => quickBid(10)}>+₹10</button>
                <button type="button" className="quick-btn" onClick={() => quickBid(25)}>+₹25</button>
                <button type="button" className="quick-btn" onClick={() => quickBid(50)}>+₹50</button>
              </div>
              <button type="submit" className="btn-primary-full">Confirm Bid</button>
            </form>
          </div>
        ) : (
          <div className="desk-placeholder">
            <span className="desk-ph-icon">⚖️</span>
            <p className="desk-ph-title">Select a crop to bid</p>
            <p className="desk-ph-sub">Click "Place Bid" on any listing in the catalog.</p>
          </div>
        )}
      </div>
    </div>
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDB, setShowDB] = useState(false);

  const setMsg = (type, msg) => {
    if (type === 'error') { setError(msg); setSuccess(''); }
    else if (type === 'success') { setSuccess(msg); setError(''); }
    else { setError(''); setSuccess(''); }
    if (msg) setTimeout(() => { setError(''); setSuccess(''); }, 4000);
  };

  const loadProducts = () => {
    if (isOfflineMode) { setProducts(getDB().products); return; }
    fetch(`${API_BASE_URL}/products`).then(r => r.json()).then(setProducts).catch(() => {
      setIsOfflineMode(true);
      setProducts(getDB().products);
    });
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then(r => { if (!r.ok) throw new Error(); setIsOfflineMode(false); })
      .catch(() => setIsOfflineMode(true));
  }, []);

  useEffect(() => { loadProducts(); }, [currentUser, isOfflineMode]);

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  if (!currentUser) {
    return <AuthScreen onLogin={setCurrentUser} isOfflineMode={isOfflineMode} />;
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
          {isOfflineMode && (
            <span className="offline-chip">
              <span className="dot-amber pulse"></span>
              Offline Demo
            </span>
          )}
        </div>
        <div className="nav-right">
          <button className="db-btn" onClick={() => setShowDB(true)}>
            <Icon.Database /> View Data
          </button>
          <div className="user-pill">
            <span className="user-avatar">{currentUser.name.charAt(0)}</span>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <Badge color={currentUser.role === 'FARMER' ? 'green' : 'blue'}>{currentUser.role}</Badge>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>Sign Out</button>
        </div>
      </header>

      {/* Page */}
      <main className="page">
        {/* Welcome bar */}
        <div className="welcome-bar">
          <div>
            <h2 className="welcome-title">Welcome back, {currentUser.name.split(' ')[0]} 👋</h2>
            <p className="welcome-sub">
              {currentUser.role === 'FARMER' ? 'Publish your harvests and track incoming bids.' : 'Browse active crop listings and place competitive bids.'}
            </p>
          </div>
          <div className="welcome-stats">
            <StatCard label="Total Listings" value={products.length} color="green" />
            {currentUser.role === 'FARMER'
              ? <StatCard label="Your Harvests" value={products.filter(p => p.farmerId === currentUser.id).length} color="amber" />
              : <StatCard label="Your Bids" value={getDB().bids.filter(b => b.buyerId === currentUser.id).length} color="amber" />
            }
          </div>
        </div>

        {/* Alerts */}
        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        {/* Role-based workspace */}
        {currentUser.role === 'FARMER'
          ? <FarmerView currentUser={currentUser} products={products} loadProducts={loadProducts} setMsg={setMsg} isOfflineMode={isOfflineMode} />
          : <BuyerView currentUser={currentUser} products={products} loadProducts={loadProducts} setMsg={setMsg} isOfflineMode={isOfflineMode} />
        }
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>AgriExchange Platform — Java 17 · Spring Boot · PostgreSQL · Docker · React</p>
        <p>Capstone Project — Cloud-Native Agriculture Supply Chain</p>
      </footer>

      {/* DB Viewer Modal */}
      {showDB && <DataViewer onClose={() => setShowDB(false)} isOfflineMode={isOfflineMode} />}
    </div>
  );
}
