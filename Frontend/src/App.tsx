import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthProvider from './context/AuthContext'
import { RequireAuth, RequireRole } from './routes/guards'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Forum from './pages/Forum'
import Documents from './pages/Documents'
import Membership from './pages/Membership'
import ExternalLinks from './pages/ExternalLinks'
import BodyDetails from './pages/BodyDetails'
import Suggestions from './pages/Suggestions'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import Files from './pages/Files'
import MutualTransfers from './pages/MutualTransfers'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<RequireRole role="admin"><Admin /></RequireRole>} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/events" element={<RequireAuth><Events /></RequireAuth>} />
              <Route path="/forum" element={<RequireAuth><Forum /></RequireAuth>} />
              <Route path="/documents" element={<RequireAuth><Documents /></RequireAuth>} />
              <Route path="/apply-membership" element={<RequireAuth><Membership /></RequireAuth>} />
              <Route path="/body-details" element={<RequireAuth><BodyDetails /></RequireAuth>} />
              <Route path="/suggestions" element={<RequireAuth><Suggestions /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/files" element={<RequireAuth><Files /></RequireAuth>} />
              <Route path="/mutual-transfers" element={<RequireAuth><MutualTransfers /></RequireAuth>} />
              <Route path="/external-links" element={<RequireAuth><ExternalLinks /></RequireAuth>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
