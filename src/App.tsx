import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ObjectsGridPage from './pages/ObjectsGridPage'
import DashboardPage from './pages/DashboardPage'
import DetailPage from './pages/DetailPage'
import ApiDocsPage from './pages/ApiDocsPage'

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/objects" element={<ObjectsGridPage />} />
            <Route path="/dashboard/:type" element={<DashboardPage />} />
            <Route path="/:type-display" element={<DetailPage />} />
            <Route path="/api-docs" element={<ApiDocsPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  )
}

export default App
