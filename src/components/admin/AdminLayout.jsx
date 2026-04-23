import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin',            label: 'Dashboard',  icon: '📊' },
  { to: '/admin/commandes',  label: 'Commandes',  icon: '📦' },
  { to: '/admin/produits',   label: 'Produits',   icon: '🎂' },
  { to: '/admin/clients',    label: 'Clients',    icon: '👥' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>🎂</span>
          <div>
            <p className="sb-name">Goûts & Partages</p>
            <p className="sb-role">Administration</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/admin'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user">
            <div className="admin-avatar">{user?.name?.[0]}</div>
            <div>
              <p className="au-name">{user?.name}</p>
              <p className="au-role">Administrateur</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            ↩ Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}