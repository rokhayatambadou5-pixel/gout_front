import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function Boutique() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [category,   setCategory]   = useState('')
  const [search,     setSearch]     = useState('')
  const [loading,    setLoading]    = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    api.get('/products', { params: { category, search } })
      .then(r => setProducts(r.data.data || []))
      .finally(() => setLoading(false))
  }, [category, search])

  const handleAdd = (product) => {
    addItem(product)
    toast.success(`${product.name} ajouté au panier !`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6ee' }}>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #c0392b, #922b21)',
        padding: '4rem 2rem', textAlign: 'center',
      }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Notre Boutique
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
          Pâtisseries artisanales préparées chaque jour
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>

        {/* Recherche */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="🔍 Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', maxWidth: '400px',
              padding: '0.75rem 1rem',
              border: '1px solid #e0d6c8',
              borderRadius: '25px',
              fontSize: '0.95rem',
              background: '#fff',
              outline: 'none',
            }}
          />
        </div>

        {/* Filtres catégories */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button onClick={() => setCategory('')}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '25px',
              border: '1px solid',
              borderColor: !category ? '#c0392b' : '#e0d6c8',
              background: !category ? '#c0392b' : '#fff',
              color: !category ? '#fff' : '#666',
              cursor: 'pointer', fontSize: '0.85rem',
              fontWeight: !category ? 600 : 400,
            }}>
            Tout
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.slug)}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '25px',
                border: '1px solid',
                borderColor: category === cat.slug ? '#c0392b' : '#e0d6c8',
                background: category === cat.slug ? '#c0392b' : '#fff',
                color: category === cat.slug ? '#fff' : '#666',
                cursor: 'pointer', fontSize: '0.85rem',
                fontWeight: category === cat.slug ? 600 : 400,
              }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Grille produits */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎂</div>
            <p>Chargement des produits...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
            <p style={{ fontSize: '1.1rem' }}>Aucun produit trouvé.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {products.map(product => (
              <div key={product.id} style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #f0e8dc',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(192,57,43,0.15)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>

                {/* Image */}
                <Link to={`/boutique/${product.id}`}>
                  {product.image ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${product.image}`}
                      alt={product.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{
                      height: '200px', background: '#fff8ec',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '4rem',
                    }}>🎂</div>
                  )}
                </Link>

                {/* Corps */}
                <div style={{ padding: '1.2rem' }}>
                  <p style={{
                    fontSize: '0.7rem', color: '#c0392b',
                    textTransform: 'uppercase', letterSpacing: '1px',
                    marginBottom: '0.3rem',
                  }}>
                    {product.category?.name}
                  </p>
                  <Link to={`/boutique/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#1a0a05', marginBottom: '0.5rem' }}>
                      {product.name}
                    </h3>
                  </Link>
                  <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {product.description?.substring(0, 80)}...
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c0392b' }}>
                      {Number(product.price).toLocaleString()} FCFA
                    </span>
                    <button onClick={() => handleAdd(product)} style={{
                      background: '#c0392b', color: '#fff',
                      border: 'none', padding: '0.5rem 1rem',
                      borderRadius: '8px', cursor: 'pointer',
                      fontSize: '0.85rem', fontWeight: 600,
                      transition: 'opacity 0.2s',
                    }}
                      onMouseEnter={e => e.target.style.opacity = '0.85'}
                      onMouseLeave={e => e.target.style.opacity = '1'}>
                      + Ajouter
                    </button>
                  </div>

                  {product.stock < 5 && product.stock > 0 && (
                    <p style={{ fontSize: '0.75rem', color: '#e67e22', marginTop: '0.5rem' }}>
                      ⚠️ Plus que {product.stock} en stock
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}