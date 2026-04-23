import { useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const INFO = [
  { icon: '📍', label: 'Adresse',   value: '123 Av. Cheikh Anta Diop\nDakar, Sénégal' },
  { icon: '📞', label: 'Téléphone', value: '+221 33 XXX XX XX' },
  { icon: '✉️', label: 'Email',     value: 'contact@gouts-partages.sn' },
  { icon: '🕐', label: 'Horaires',  value: 'Lun–Sam : 08h00 – 20h00\nDim : 09h00 – 17h00' },
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success('Message envoyé avec succès !')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1px solid #e0d6c8',
    borderRadius: '10px', fontSize: '0.95rem',
    background: '#fdf6ee', color: '#1a0a05',
    fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6ee' }}>

      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a05, #2d1209)',
        padding: '4rem 2rem', textAlign: 'center',
      }}>
        <p style={{ color: '#c0392b', fontSize: '0.8rem', letterSpacing: '3px',
          textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Parlons ensemble
        </p>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Contactez-nous
        </h1>
        <p style={{ color: '#888' }}>Nous répondons sous 24h</p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: '3rem',
          alignItems: 'start',
        }}>

          {/* Infos */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700,
              color: '#1a0a05', marginBottom: '2rem' }}>
              Nos coordonnées
            </h2>

            {INFO.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1rem',
                alignItems: 'flex-start', marginBottom: '1.5rem',
              }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '50%',
                  background: '#fdf3f3', border: '1px solid #f5d5d5',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.2rem',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700,
                    color: '#c0392b', textTransform: 'uppercase',
                    letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.6,
                    whiteSpace: 'pre-line' }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Réseaux sociaux */}
            <div style={{ marginTop: '2rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700,
                color: '#888', textTransform: 'uppercase',
                letterSpacing: '0.5px', marginBottom: '1rem' }}>
                Suivez-nous
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {['Facebook', 'Instagram', 'WhatsApp'].map(s => (
                  <span key={s} style={{
                    padding: '0.4rem 0.9rem',
                    border: '1px solid #e0d6c8',
                    borderRadius: '20px', fontSize: '0.8rem',
                    color: '#666', cursor: 'pointer',
                    background: '#fff',
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '2.5rem',
            border: '1px solid #f0e8dc',
            boxShadow: '0 8px 30px rgba(192,57,43,0.06)',
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700,
              color: '#1a0a05', marginBottom: '0.5rem' }}>
              Envoyer un message
            </h2>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Commande spéciale, question ou suggestion ?
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem',
                    fontWeight: 700, color: '#888', textTransform: 'uppercase',
                    letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                    Nom *
                  </label>
                  <input name="name" value={form.name}
                    onChange={handleChange} required
                    placeholder="Votre nom"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#c0392b'}
                    onBlur={e => e.target.style.borderColor = '#e0d6c8'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem',
                    fontWeight: 700, color: '#888', textTransform: 'uppercase',
                    letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                    Email *
                  </label>
                  <input type="email" name="email" value={form.email}
                    onChange={handleChange} required
                    placeholder="votre@email.com"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#c0392b'}
                    onBlur={e => e.target.style.borderColor = '#e0d6c8'} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem',
                  fontWeight: 700, color: '#888', textTransform: 'uppercase',
                  letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                  Objet
                </label>
                <input name="subject" value={form.subject}
                  onChange={handleChange}
                  placeholder="Sujet de votre message"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c0392b'}
                  onBlur={e => e.target.style.borderColor = '#e0d6c8'} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem',
                  fontWeight: 700, color: '#888', textTransform: 'uppercase',
                  letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                  Message *
                </label>
                <textarea name="message" value={form.message}
                  onChange={handleChange} required rows={5}
                  placeholder="Décrivez votre demande..."
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '130px' }}
                  onFocus={e => e.target.style.borderColor = '#c0392b'}
                  onBlur={e => e.target.style.borderColor = '#e0d6c8'} />
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', background: loading ? '#ccc' : '#c0392b',
                color: '#fff', border: 'none', padding: '1rem',
                borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
              }}>
                {loading ? 'Envoi en cours...' : '✉️ Envoyer le message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}