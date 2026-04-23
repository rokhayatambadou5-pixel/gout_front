import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'wave',           label: 'Wave',              icon: '🌊', color: '#1BA9FF' },
  { id: 'orange_money',   label: 'Orange Money',       icon: '🟠', color: '#FF6600' },
  { id: 'free_money',     label: 'Free Money',         icon: '💚', color: '#00A651' },
  { id: 'card',           label: 'Carte bancaire',     icon: '💳', color: '#2C3E50' },
  { id: 'cash_on_delivery', label: 'Paiement à la livraison', icon: '💵', color: '#27AE60' },
];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name:    user?.name  || '',
    customer_email:   user?.email || '',
    customer_phone:   user?.phone || '',
    delivery_address: '',
    payment_method:   'wave',
    notes:            '',
  });
  const [loading, setLoading] = useState(false);

  const deliveryFee = total >= 25000 ? 0 : 1500;
  const grandTotal  = total + deliveryFee;

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!items.length) return toast.error('Votre panier est vide');
    setLoading(true);
    try {
      // 1. Créer la commande
      const { data: order } = await api.post('/orders', {
        ...form,
        items: items.map(i => ({
          id: i.id, name: i.name, price: i.price, quantity: i.quantity,
        })),
        subtotal:     total,
        delivery_fee: deliveryFee,
        total:        grandTotal,
      });

      // 2. Si paiement en ligne → rediriger vers PayTech
      if (form.payment_method !== 'cash_on_delivery') {
        const { data: pay } = await api.post(
          `/orders/${order.order.id}/pay`
        );
        clearCart();
        window.location.href = pay.redirect_url; // Redirection PayTech
      } else {
        // Paiement à la livraison
        clearCart();
        navigate(`/commande/${order.order.id}/succes`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-grid">

        {/* Formulaire */}
        <div className="checkout-form-section">
          <h2>Informations de livraison</h2>
          <form onSubmit={handleSubmit}>

            <div className="form-row">
              <div className="form-group">
                <label>Nom complet *</label>
                <input name="customer_name" value={form.customer_name}
                       onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Téléphone *</label>
                <input name="customer_phone" value={form.customer_phone}
                       onChange={handleChange} required placeholder="+221 7X XXX XX XX" />
              </div>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="customer_email" value={form.customer_email}
                     onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Adresse de livraison *</label>
              <input name="delivery_address" value={form.delivery_address}
                     onChange={handleChange} required placeholder="Ex: Almadies, Rue 10" />
            </div>

            {/* Méthode de paiement */}
            <h3 style={{ margin: '1.5rem 0 1rem' }}>Mode de paiement</h3>
            <div className="payment-methods">
              {PAYMENT_METHODS.map(m => (
                <label key={m.id}
                  className={`payment-option ${form.payment_method === m.id ? 'selected' : ''}`}
                  style={{ '--pm-color': m.color }}>
                  <input type="radio" name="payment_method" value={m.id}
                         checked={form.payment_method === m.id}
                         onChange={handleChange} />
                  <span className="pm-icon">{m.icon}</span>
                  <span className="pm-label">{m.label}</span>
                  {form.payment_method === m.id && <span className="pm-check">✓</span>}
                </label>
              ))}
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Notes (optionnel)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange}
                        rows={3} placeholder="Instructions spéciales..." />
            </div>

            <button type="submit" className="btn-checkout" disabled={loading}>
              {loading ? 'Traitement...' : `Confirmer et payer ${grandTotal.toLocaleString()} FCFA`}
            </button>
          </form>
        </div>

        {/* Résumé commande */}
        <div className="checkout-summary">
          <h2>Récapitulatif</h2>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <div>
                  <p className="si-name">{item.name}</p>
                  <p className="si-qty">x{item.quantity}</p>
                </div>
                <p className="si-price">
                  {(item.price * item.quantity).toLocaleString()} FCFA
                </p>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="st-row">
              <span>Sous-total</span>
              <span>{total.toLocaleString()} FCFA</span>
            </div>
            <div className="st-row">
              <span>Livraison</span>
              <span>{deliveryFee === 0 ? 'Gratuite 🎉' : `${deliveryFee.toLocaleString()} FCFA`}</span>
            </div>
            {deliveryFee > 0 && (
              <p className="free-delivery-hint">
                Livraison gratuite à partir de 25 000 FCFA
              </p>
            )}
            <div className="st-row total-row">
              <span>Total</span>
              <span>{grandTotal.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}