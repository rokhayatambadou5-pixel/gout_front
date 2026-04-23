
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #c0392b, #922b21)',
      minHeight: '480px', display: 'flex',
      alignItems: 'center', padding: '4rem',
      gap: '4rem',
    }}>
      <div style={{ flex: 1, color: 'white' }}>
        <p style={{ color: '#f9c9c5', fontStyle: 'italic', marginBottom: '1rem' }}>
          Bienvenue chez Goûts et Partages
        </p>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
          Des patisseries faites avec amour
        </h1>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
          Decouvrez nos gateaux, tartes et viennoiseries artisanales.
        </p>
        <Link to="/Noutique" style={{
          background: '#f1c40f', color: '#1a0a05',
          padding: '0.75rem 2rem', borderRadius: '8px',
          fontWeight: 700, textDecoration: 'none',
        }}>
          Voir la boutique
        </Link>
      </div>
      <div style={{ fontSize: '10rem' }}>🎂</div>
    </div>
  )
}
