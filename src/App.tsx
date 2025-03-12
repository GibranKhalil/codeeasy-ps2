import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import GeneralLayout from './ui/layouts/generalLayout'
import SnippetPage from './pages/SnippetPage'
import OnlyHeaderLayout from './ui/layouts/onlyHeaderLayout'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-dark-1">
        <Routes>
          <Route path="/" element={<GeneralLayout><HomePage /></GeneralLayout>} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/snippet/:pid" element={<OnlyHeaderLayout><SnippetPage /></OnlyHeaderLayout>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App