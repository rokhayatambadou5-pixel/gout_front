
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header style={{
      background: '#1a0a05', padding: '0 2rem',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: '64px',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link to="/" style={{ color: '#f1c40f', fontWeight: 700,
        fontSize: '1.2rem', textDecoration: 'none' }}>
        Goûts & Partages
      </Link>
      <nav style={{ display: 'flex', gap: '2rem' }}>
        {[['/', 'Accueil'], ['/boutique', 'Boutique'],
          ['/recettes', 'Recettes'], ['/contact', 'Contact']
        ].map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              color: isActive ? '#f1c40f' : '#ccc',
              textDecoration: 'none', fontSize: '0.9rem',
            })}>
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
