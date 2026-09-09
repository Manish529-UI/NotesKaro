import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import logo from '../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import API from '../services/api'

function Navbar() {
  // ⚡ CRITICAL FIX: Direct number selector use karne se Redux state change hone par UI instantly update ho jata hai!
  const credits = useSelector((state) => state.user.userData?.credits ?? 0)
  const userData = useSelector((state) => state.user.userData)

  const [showCredits, setShowCredits] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignOut = async () => {
    try {
      await API.get("/api/auth/logout")
      localStorage.removeItem("token")
      dispatch(setUserData(null))
      setShowProfile(false)
      navigate("/auth")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative z-20 mx-6 mt-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_22px_55px_rgba(0,0,0,0.8)] flex items-center justify-between px-8 py-4"
    >
      {/* 🚀 LEFT SIDE: LOGO / BRAND */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="NotesKaro" className="w-9 h-9" />
        <Link to="/" className="text-xl font-bold tracking-wider hover:opacity-90 transition-opacity">
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            NotesKaro
          </span>
        </Link>
      </div>

      {/* 👤 RIGHT SIDE: CREDITS + PROFILE */}
      <div className="flex items-center gap-4">
        {userData ? (
          <div className="flex items-center gap-4">

            {/* 🪙 CREDITS SECTION */}
            <div className='relative'>
              <motion.div
                onClick={() => { setShowCredits(!showCredits); setShowProfile(false) }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                className='flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm shadow-md cursor-pointer'
              >
                <span className='text-lg'>🪙</span>
                <span>{credits}</span>
                <motion.span 
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.97 }}
                  className='ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-white text-black text-xs font-bold'
                >
                  ➕
                </motion.span>
              </motion.div>

              <AnimatePresence>
                {showCredits && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 10, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className='absolute right-0 mt-4 w-64 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-4 text-white z-50'
                  >
                    <h4 className='font-semibold mb-2 text-white'>
                      Buy Credits
                    </h4>

                    <p className='text-sm text-gray-300 mb-4 leading-relaxed'>
                      Unlock instant AI study notes, smart mind maps & exam-ready PDFs in seconds.
                    </p>

                    <button
                      onClick={() => { setShowCredits(false); navigate("/pricing"); }}
                      className='w-full py-2 rounded-lg bg-gradient-to-br from-white to-gray-200 text-black font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer'
                    >
                      Buy More Credits 
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 🎯 PROFILE AVATAR WITH DROPDOWN */}
            <div className="relative">
              <motion.div
                onClick={() => { setShowProfile(!showProfile); setShowCredits(false) }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm shadow-md cursor-pointer select-none"
              >
                <span className="text-lg font-bold">
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </span>
              </motion.div>

              {/* 🎯 PROFILE POPUP MENU */}
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 10, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className='absolute right-0 mt-4 w-52 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-4 text-white z-50'
                  >
                    <MenuItem text="History" onClick={() => { setShowProfile(false); navigate("/history"); }} />
                    <div className="h-px bg-white/10 my-1 mx-1" />
                    <MenuItem text="Sign Out" red onClick={handleSignOut} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <Link to="/auth">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-black text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all shadow-md cursor-pointer"
            >
              Get Started
            </motion.button>
          </Link>
        )}
      </div>
    </motion.div>
  )
}

function MenuItem({ onClick, text, red }) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full text-left px-4 py-2 text-sm cursor-pointer
        transition-colors rounded-lg
        ${
          red
            ? "text-red-400 hover:bg-red-500/10"
            : "text-gray-200 hover:bg-white/10"
        }
      `}
    >
      {text}
    </div>
  );
}

export default Navbar;