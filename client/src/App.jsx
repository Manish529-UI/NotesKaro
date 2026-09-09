import React, { useEffect, useState } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import History from './pages/History'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
import { getCurrentUser } from './services/api.js'
import { useDispatch, useSelector } from 'react-redux'

import NotFound from './pages/NotFound'

export const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true) // 👈 1. Loading state add ki

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getCurrentUser(dispatch) // 👈 API call complete hone ka wait karega
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setLoading(false) // 👈 2. API call done hone par loading stop
      }
    }

    fetchUser()
  }, [dispatch])

  const { userData } = useSelector((state) => state.user)

  // 👈 3. Jab tak backend verification ho raha hai, blank/loader dikhao (Auth page mat dikhao)
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path='/' element={userData ? <Home /> : <Navigate to="/auth" replace />} />
      <Route path='/auth' element={userData ? <Navigate to="/" replace /> : <Auth />} />
      <Route path='/history' element={userData? <History/> : <Navigate to="/auth" replace/>}/>
      <Route path='/notes' element={userData? <Notes/> : <Navigate to="/auth" replace/>}/>
      <Route path='/pricing' element={userData? <Pricing/> : <Navigate to="/auth" replace/>}/>
      
      {/* 404 Catch-all route */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
