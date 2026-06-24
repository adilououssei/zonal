import { Outlet, useNavigation } from 'react-router-dom'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import Loader from '../ui/Loader.tsx'

const Layout = () => {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading && <Loader />}
      <Header />
      <main className="grow pt-18 md:pt-30">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout