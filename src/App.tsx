import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Register from './Register'
import Login from './Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
