import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './ui/components/Header'
import Footer from './ui/components/Footer'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import SupportPage from './pages/SupportPage'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-dark-primary">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/colecao" element={<CollectionPage />} />
          <Route path="/suporte" element={<SupportPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App