import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const CATEGORIES = ['Tout', 'dessert', 'viennoiserie', 'tarte', 'boisson']

export default function Recipes() {
  const [recipes,  setRecipes]  = useState([])
  const [category, setCategory] = useState('')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/recipes', { params: { category: category || undefined } })
      .then(r => setRecipes(r.data.data || []))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6ee' }}>

      {/* Banner */}
      <div style={{
        background: '#1a0a05',
        padding: '4rem 2rem', textAlign: 'center',
      }}>
        <p style={{ color: '#c0392b', fontSize: '0.8rem', letterSpacing: '3px',
          textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Notre savoir-faire
        </p>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Nos Recettes
        </h1>
        <p style={{ color: '#888', fontSize: '1rem' }}>
          Découvrez les secrets de notre cuisine artisanale
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {CATEGORIES.map(cat => {
            const val = cat === 'Tout' ? '' : cat
            const active = category === val
            return (
              <button key={cat} onClick={() => setCategory(val)} style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '25px',
                border: '1px solid',
                borderColor: active ? '#c0392b' : '#e0d6c8',
                background: active ? '#c0392b' : '#fff',
                color: active ? '#fff' : '#666',
                cursor: 'pointer', fontSize: '0.85rem',
                fontWeight: active ? 600 : 400,
                textTransform: 'capitalize',
              }}>
                {cat}
              </button>
            )
          })}
        </div>

        {/* Grille recettes */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍰</div>
            <p>Chargement des recettes...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {recipes.map(recipe => (
              <Link key={recipe.id} to={`/recettes/${recipe.id}`}
                style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', borderRadius: '16px',
                  overflow: 'hidden', border: '1px solid #f0e8dc',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  height: '100%',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}>

                  {/* Image */}
                  {recipe.image ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${recipe.image}`}
                      alt={recipe.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      height: '200px', background: '#1a0a05',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '4rem',
                    }}>🍰</div>
                  )}

                  <div style={{ padding: '1.5rem' }}>
                    <span style={{
                      display: 'inline-block',
                      background: '#fdf3f3', color: '#c0392b',
                      fontSize: '0.7rem', padding: '3px 10px',
                      borderRadius: '20px', marginBottom: '0.75rem',
                      fontWeight: 600, textTransform: 'capitalize',
                    }}>
                      {recipe.category}
                    </span>

                    <h3 style={{
                      fontSize: '1.15rem', color: '#1a0a05',
                      marginBottom: '0.5rem', fontWeight: 700,
                    }}>
                      {recipe.name}
                    </h3>

                    <p style={{
                      fontSize: '0.85rem', color: '#888',
                      lineHeight: 1.6, marginBottom: '1rem',
                    }}>
                      {recipe.description?.substring(0, 100)}...
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <span style={{
                        fontSize: '0.8rem', color: '#666',
                        background: '#f5f5f5', padding: '4px 10px',
                        borderRadius: '8px',
                      }}>
                        ⏱ {recipe.duration} min
                      </span>
                      <span style={{
                        fontSize: '0.8rem', color: '#666',
                        background: '#f5f5f5', padding: '4px 10px',
                        borderRadius: '8px',
                      }}>
                        👥 {recipe.servings} pers.
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <p>Aucune recette dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  )
}