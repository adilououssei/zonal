import { Outlet } from 'react-router-dom'
import Header from './Header.tsx'
import Footer from './Footer.tsx'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow pt-35 md:pt-40">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout