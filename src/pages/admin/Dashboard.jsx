import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../api/axios';

const STATUS_COLORS = {
  pending:    '#f39c12',
  confirmed:  '#3498db',
  preparing:  '#9b59b6',
  delivering: '#1abc9c',
  delivered:  '#2ecc71',
  cancelled:  '#e74c3c',
};

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [orders,  setOrders]  = useState([]);
  const [recent,  setRecent]  = useState([]);
  const [topProd, setTopProd] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard/stats'),
      api.get('/admin/dashboard/revenue-chart'),
      api.get('/admin/dashboard/orders-chart'),
      api.get('/admin/dashboard/recent-orders'),
      api.get('/admin/dashboard/top-products'),
    ]).then(([s, r, o, rc, tp]) => {
      setStats(s.data);
      setRevenue(r.data.map(d => ({
        month: d.month, revenue: Math.round(d.revenue)
      })));
      setOrders(o.data.map(d => ({
        name: d.status, value: d.count, fill: STATUS_COLORS[d.status]
      })));
      setRecent(rc.data);
      setTopProd(tp.data);
    });
  }, []);

  if (!stats) return <div className="loading">Chargement du tableau de bord...</div>;

  const kpis = [
    { label: 'Chiffre d\'affaires total', value: stats.revenue_total.toLocaleString() + ' FCFA', icon: '💰', color: '#2ecc71' },
    { label: 'CA ce mois',                value: stats.revenue_month.toLocaleString() + ' FCFA', icon: '📈', color: '#3498db' },
    { label: 'Commandes totales',         value: stats.orders_total,  icon: '📦', color: '#9b59b6' },
    { label: 'Commandes aujourd\'hui',    value: stats.orders_today,  icon: '🕐', color: '#f39c12' },
    { label: 'En attente',                value: stats.orders_pending, icon: '⏳', color: '#e74c3c' },
    { label: 'Clients',                   value: stats.customers_total, icon: '👥', color: '#1abc9c' },
    { label: 'Produits',                  value: stats.products_total, icon: '🎂', color: '#e67e22' },
    { label: 'Rupture de stock',          value: stats.products_out,  icon: '⚠️', color: '#e74c3c' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue ! Voici un aperçu de votre activité.</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div key={i} className="kpi-card" style={{ '--kpi-color': k.color }}>
            <div className="kpi-icon">{k.icon}</div>
            <div className="kpi-info">
              <p className="kpi-label">{k.label}</p>
              <p className="kpi-value">{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
        {/* Chiffre d'affaires */}
        <div className="chart-card wide">
          <h3>Chiffre d'affaires (12 mois)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }}
                     tickFormatter={v => (v/1000) + 'k'} />
              <Tooltip formatter={v => v.toLocaleString() + ' FCFA'} />
              <Line type="monotone" dataKey="revenue"
                    stroke="#c0392b" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statuts commandes */}
        <div className="chart-card">
          <h3>Commandes par statut</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={orders} cx="50%" cy="50%" outerRadius={90}
                   dataKey="value" label={({ name, percent }) =>
                     `${name} ${(percent * 100).toFixed(0)}%`}>
                {orders.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top produits */}
        <div className="chart-card">
          <h3>Top 5 produits</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProd} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={100}
                     tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="qty" fill="#c0392b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dernières commandes */}
      <div className="recent-orders">
        <h3>Dernières commandes</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Total</th>
              <th>Paiement</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(o => (
              <tr key={o.id}>
                <td><code>{o.reference}</code></td>
                <td>{o.customer}</td>
                <td><strong>{o.total.toLocaleString()} FCFA</strong></td>
                <td>
                  <span className={`badge payment-${o.payment_status}`}>
                    {o.payment_status === 'paid' ? '✅ Payé' : '⏳ En attente'}
                  </span>
                </td>
                <td>
                  <span className="badge" style={{
                    background: STATUS_COLORS[o.status] + '20',
                    color: STATUS_COLORS[o.status]
                  }}>
                    {o.status}
                  </span>
                </td>
                <td>{o.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}