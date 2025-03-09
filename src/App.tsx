import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import SupportPage from './pages/SupportPage'
import GeneralLayout from './ui/layouts/generalLayout'
import SnippetPage from './pages/SnippetPage'
import OnlyHeaderLayout from './ui/layouts/onlyHeaderLayout'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-dark-primary">
        <Routes>
          <Route path="/" element={<GeneralLayout><HomePage /></GeneralLayout>} />
          <Route path="/colecao" element={<CollectionPage />} />
          <Route path="/suporte" element={<SupportPage />} />
          <Route path="/snippet/:pid" element={<OnlyHeaderLayout><SnippetPage /></OnlyHeaderLayout>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App