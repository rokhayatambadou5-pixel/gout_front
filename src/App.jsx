// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
// import { Routes, Route, Navigate } from 'react-router-dom'
// import { Toaster } from 'react-hot-toast'

// import Navbar  from './components/Navbar'
// import Footer  from './components/Footer'
// import Home    from './pages/Home'


// export default function App() {
//   return (
//     <>
//       <Toaster position="top-right" />
//       <Navbar />
//       <main>
//         <Routes>
//           <Route path="/" element={<Home />} />
//         </Routes>
//       </main>
//       <Footer />
//     </>
//   )
// }


import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
//import { useAuth } from './context/AuthContext';

import Navbar        from './components/Navbar';
import Footer        from './components/Footer';
// import AdminLayout   from './components/admin/AdminLayout';

import Home          from './pages/Home';
import Boutique      from './pages/Boutique';
// import ProductDetail from './pages/ProductDetail';
import Recipes       from './pages/Recipes';
//import About         from './pages/About';
import Contact       from './pages/Contact';
// import Cart          from './pages/Cart';
// import Checkout      from './pages/Checkout';
// import OrderSuccess  from './pages/OrderSuccess';
// import Login         from './pages/Login';
// import Register      from './pages/Register';

import Dashboard     from './pages/admin/Dashboard';
// import AdminOrders   from './pages/admin/Orders';
// import AdminProducts from './pages/admin/Products';
// import AdminCustomers from './pages/admin/Customers';

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