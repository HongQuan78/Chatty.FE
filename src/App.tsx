import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import Dashboard from './Dashboard'
import Settings from './Settings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
