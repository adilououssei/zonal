// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Events from './pages/Events'
import News from './pages/News'
import Contact from './pages/Contact'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="programs" element={<Programs />} />
        <Route path="events" element={<Events />} />
        <Route path="news" element={<News />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}

export default App