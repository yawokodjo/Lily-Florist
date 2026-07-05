import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { DeliveryDetails } from './pages/DeliveryDetails'
import { Payment } from './pages/Payment'
import { Confirmation } from './pages/Confirmation'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Account } from './pages/Account'
import { About } from './pages/About'
import { NotFound } from './pages/NotFound'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/delivery" element={<DeliveryDetails />} />
        <Route path="/checkout/payment" element={<Payment />} />
        <Route path="/checkout/confirmation" element={<Confirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
