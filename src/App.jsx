import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Meters from './pages/Meters'
import Purchases from './pages/Purchases'
import Reports from './pages/Reports'
import { supabase } from './utils/supabase'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setIsAuthenticated(true)
      setAdminUser(session.user)
    }
    setLoading(false)
  }

  async function handleLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      alert('Login failed: ' + error.message)
    } else {
      setIsAuthenticated(true)
      setAdminUser(data.user)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setAdminUser(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Router>
      <Layout onLogout={handleLogout} adminUser={adminUser}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/meters" element={<Meters />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  )
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">⚡ Meter Tracker</h1>
          <p className="text-gray-500 mt-1">Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-semibold"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default App