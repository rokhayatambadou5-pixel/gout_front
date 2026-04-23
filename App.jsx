import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

import Navbar        from './components/Navbar';
import Footer        from './components/Footer';
import AdminLayout   from './components/admin/AdminLayout';

import Home          from './pages/Home';
import Boutique      from './pages/Boutique';
import ProductDetail from './pages/ProductDetail';
import Recipes       from './pages/Recipes';
import About         from './pages/About';
import Contact       from './pages/Contact';
import Cart          from './pages/Cart';
import Checkout      from './pages/Checkout';
import OrderSuccess  from './pages/OrderSuccess';
import Login         from './pages/Login';
import Register      from './pages/Register';

import Dashboard     from './pages/admin/Dashboard';
import AdminOrders   from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import AdminCustomers from './pages/admin/Customers';

function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Chargement...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Admin */}
        <Route path="/admin/*" element={
          <ProtectedAdmin>
            <AdminLayout>
              <Routes>
                <Route path="/"          element={<Dashboard />} />
                <Route path="/commandes" element={<AdminOrders />} />
                <Route path="/produits"  element={<AdminProducts />} />
                <Route path="/clients"   element={<AdminCustomers />} />
              </Routes>
            </AdminLayout>
          </ProtectedAdmin>
        }/>

        {/* Public */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/"              element={<Home />} />
                <Route path="/boutique"      element={<Boutique />} />
                <Route path="/boutique/:id"  element={<ProductDetail />} />
                <Route path="/recettes"      element={<Recipes />} />
                <Route path="/a-propos"      element={<About />} />
                <Route path="/contact"       element={<Contact />} />
                <Route path="/panier"        element={<Cart />} />
                <Route path="/commande"      element={<Checkout />} />
                <Route path="/commande/:id/succes" element={<OrderSuccess />} />
                <Route path="/login"         element={<Login />} />
                <Route path="/inscription"   element={<Register />} />
              </Routes>
            </main>
            <Footer />
          </>
        }/>
      </Routes>
    </>
  );
}