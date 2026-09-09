import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'
import FinalResult from '../components/FinalResult'

import logo from '../assets/logo.png'
import TopicForm from '../components/TopicForm'

function Notes() {
  const navigate = useNavigate();
  
  // ✅ FIXED: Correct path `userData` search kar rahe hain (Navbar wale exact logic se)
  const credits = useSelector((state) => state.user.userData?.credits ?? 0);

  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  return (
    <div className="w-full mx-auto px-4 py-6">
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-6 shadow-[0_20px_45px_rgba(0,0,0,0.6)] items-start flex md:items-center justify-between gap-4 flex-col md:flex-row"
      >
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="flex items-baseline gap-2.5 text-2xl font-bold">
            <img src={logo} alt="NotesKaro" className="w-8 h-8 self-center shrink-0" />
            <span className="flex items-baseline gap-1">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                NotesKaro
              </span>
              <span className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              </span>
            </span>
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            AI-powered exam-oriented notes & revision
          </p>
        </div>

        <div className='flex items-center gap-4 flex-wrap'>
          <button className='flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm' onClick={() => navigate("/pricing")}>
            <span className='text-xl'>🪙</span>
            {/* ✅ Live dynamic Redux Credits */}
            <span className="font-bold">{credits}</span>
            <motion.span 
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.97 }}
              className='ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-white text-black text-xs font-bold cursor-pointer'
            >
              ➕
            </motion.span>
          </button>

          <button 
            onClick={() => navigate("/history")} 
            className='px-4 py-3 rounded-full text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center gap-2 cursor-pointer'
          >
            📚 My Notes
          </button>
        </div>
      </motion.header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
        <TopicForm loading={loading} setLoading={setLoading} setResult={setResult} setError={setError}/>
      </motion.div>

      {/* ⏳ Loading State Animation */}
{loading && (
  <motion.div
    animate={{ opacity: [0.3, 1, 0.3] }}
    transition={{ repeat: Infinity, duration: 1.2 }}
    className="text-center text-black font-medium mb-6"
  >
    Generating exam-focused notes...
  </motion.div>
)}

{/* ❌ Error State Message */}
{error && (
  <div className="mb-6 text-center text-red-600 font-medium">
    {error}
  </div>
)}

      {!result && (
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="
            h-64
            rounded-2xl
            flex flex-col items-center justify-center
            bg-white/60 backdrop-blur-lg
            border border-dashed border-gray-300
            text-gray-500
            shadow-inner
          "
        > 
          <span className="text-4xl mb-3">📘</span>
          <p className="text-sm">
            Generated notes will appear here
          </p>
        </motion.div>
      )}

      {result && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col lg:grid lg:grid-cols-4 gap-6"
  >
    {/* 📌 LEFT SIDEBAR / NAVIGATION (1 Column) */}
    <div className="lg:col-span-1">
      <Sidebar result={result} /> 
      
    </div>

    <div className="lg:col-span-3 rounded-2xl bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] p-6">
      <FinalResult result={result} />
</div>

    
  </motion.div>
)}



    </div>
  )
}

export default Notes;