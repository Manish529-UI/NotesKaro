import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer' 
import img from '../assets/study.png'

function Home() {
  return (
    <div className='min-h-screen overflow-hidden bg-white text-black'>
      <Navbar />
      
      {/* Top Section */}
      <section className='max-w-7xl mx-auto px-8 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="transform-gpu"
          >
            <motion.h1 
              className="text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-br from-black/90 via-black/60 to-black/90 bg-clip-text text-transparent"
              whileHover={{ y: -4 }}
              style={{
                textShadow: "0 18px 40px rgba(0,0,0,0.25)",
              }}
            >
              Create Smart <br /> AI Notes in Seconds
            </motion.h1>

            <motion.p
              whileHover={{ y: -2 }}
              className='mt-6 max-w-xl text-lg bg-gradient-to-br from-gray-700 via-gray-500/80 to-gray-700 bg-clip-text text-transparent'
              style={{
                textShadow: "0 18px 40px rgba(0,0,0,0.25)",
              }}
            >
              Instantly create exam-oriented notes, detailed project reports, 
              visual flowcharts, and quick revision guides with AI — 
              effortless, precise, and highly organized.
            </motion.p>

            {/* FIXED GET STARTED BUTTON - Instant 1-Click Navigation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='mt-10 inline-block'
            >
              <Link
                to="/notes"
                className='px-10 py-3.5 rounded-xl inline-flex items-center gap-3 bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/10 text-white font-semibold text-lg shadow-[0_25px_60px_rgba(0,0,0,0.7)] cursor-pointer hover:bg-black transition-all duration-200'
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          whileHover={{
            y: -12,
            scale: 1.02,
          }}
          className="transform-gpu"
        >
          <div className='overflow-hidden'>
            <img src={img} alt="img" />
          </div>
        </motion.div>
      </section>

      {/* Bottom Section */}
      <section className='max-w-6xl mx-auto px-8 py-32 grid grid-cols-1 md:grid-cols-4 gap-10'>
        <Feature icon="📚" title="Smart Study Guides" des="Comprehensive, exam-focused summaries with quick review notes." />
        <Feature icon="💼" title="Project Briefs" des="Structured outlines and documentation tailored for assignments." />
        <Feature icon="📊" title="Visual Flowcharts" des="AI-generated conceptual diagrams to make complex topics easy." />
        <Feature icon="⬇️" title="Instant PDF Export" des="Export clean, print-ready documents in a single click." />
      </section>

      <Footer />
    </div>
  )
}

function Feature({ icon, title, des }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className='relative rounded-2xl p-6 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)] text-white'
    >
      <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none' />

      <div className='relative z-10'>
        <div className="text-4xl mb-3 text-sky-400">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{des}</p>
      </div>
    </motion.div>
  )
}

export default Home