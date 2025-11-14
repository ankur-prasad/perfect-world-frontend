"use client"
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.01, 0.05, 0.95] as any,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] as any },
  },
}

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95] as any },
  },
}

const socialVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 10,
    },
  },
}

const backgroundVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 2,
      ease: [0.6, 0.01, 0.05, 0.95] as any,
    },
  },
}

export default function Footer() {
  return (
    <div className="relative h-[70vh]" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className="relative h-[calc(100vh+70vh)] -top-[100vh]">
        <div className="h-[70vh] sticky top-[calc(100vh-70vh)]">
          <motion.footer
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-gradient-to-br from-black via-black/95 to-black/90 py-6 md:py-12 px-4 md:px-12 h-full w-full flex flex-col justify-between relative overflow-hidden"
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />

            <motion.div
              variants={backgroundVariants}
              className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.div
              variants={backgroundVariants}
              className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            />

            {/* Navigation Section */}
            <motion.div variants={containerVariants} className="relative z-10">
              <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 lg:gap-20">
                  {/* Brand */}
                  <motion.div variants={itemVariants} className="flex flex-col gap-2">
                    <motion.h3
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mb-2 uppercase text-gray-400 text-xs font-semibold tracking-wider border-b border-white/10 pb-1 hover:text-white transition-colors duration-300"
                    >
                      About
                    </motion.h3>
                    <motion.p variants={linkVariants} className="text-gray-400 text-xs md:text-sm mb-2">
                      Together. Not Alone. More than a slogan, it's a Promise for Change and Improvement.
                    </motion.p>
                    <motion.div variants={linkVariants} className="text-gray-400 text-xs space-y-1">
                      <p>Nicholas Freitag</p>
                      <motion.a
                        href="mailto:info@perfectworld.global"
                        whileHover={{
                          x: 8,
                          transition: { type: "spring", stiffness: 300, damping: 20 },
                        }}
                        className="block hover:text-white transition-colors duration-300 group relative"
                      >
                        <span className="relative">
                          info@perfectworld.global
                          <motion.span
                            className="absolute bottom-0 left-0 h-0.5 bg-white"
                            initial={{ width: 0 }}
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </span>
                      </motion.a>
                      <p>+49 15129109696</p>
                      <p>Am Hochwald 5</p>
                      <p>82319 Starnberg, Germany</p>
                    </motion.div>
                  </motion.div>

                  {/* Quick Links */}
                  <motion.div variants={itemVariants} className="flex flex-col gap-2">
                    <motion.h3
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="mb-2 uppercase text-gray-400 text-xs font-semibold tracking-wider border-b border-white/10 pb-1 hover:text-white transition-colors duration-300"
                    >
                      Quick Links
                    </motion.h3>
                    <motion.div variants={linkVariants}>
                      <Link
                        to="/about"
                        className="block text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm mb-2 group relative"
                      >
                        <motion.span
                          whileHover={{
                            x: 8,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className="relative inline-block"
                        >
                          About Us
                          <motion.span
                            className="absolute bottom-0 left-0 h-0.5 bg-white"
                            initial={{ width: 0 }}
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.span>
                      </Link>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                      <Link
                        to="/transparency"
                        className="block text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm mb-2"
                      >
                        <motion.span
                          whileHover={{
                            x: 8,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className="relative inline-block"
                        >
                          Transparency
                        </motion.span>
                      </Link>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                      <Link
                        to="/shop"
                        className="block text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm mb-2"
                      >
                        <motion.span
                          whileHover={{
                            x: 8,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className="relative inline-block"
                        >
                          Shop
                        </motion.span>
                      </Link>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                      <a
                        href="https://www.perfectworld.global/pages/contact"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm mb-2"
                      >
                        <motion.span
                          whileHover={{
                            x: 8,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className="relative inline-block"
                        >
                          Contact
                        </motion.span>
                      </a>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                      <a
                        href="https://www.perfectworld.global/pages/faq"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm"
                      >
                        <motion.span
                          whileHover={{
                            x: 8,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className="relative inline-block"
                        >
                          FAQ
                        </motion.span>
                      </a>
                    </motion.div>
                  </motion.div>

                  {/* Support */}
                  <motion.div variants={itemVariants} className="flex flex-col gap-2">
                    <motion.h3
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mb-2 uppercase text-gray-400 text-xs font-semibold tracking-wider border-b border-white/10 pb-1 hover:text-white transition-colors duration-300"
                    >
                      Support
                    </motion.h3>
                    <motion.div variants={linkVariants}>
                      <a
                        href="https://www.perfectworld.global/policies/privacy-policy"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm mb-2"
                      >
                        <motion.span
                          whileHover={{
                            x: 8,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className="relative inline-block"
                        >
                          Privacy Policy
                        </motion.span>
                      </a>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                      <a
                        href="https://www.perfectworld.global/policies/refund-policy"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm mb-2"
                      >
                        <motion.span
                          whileHover={{
                            x: 8,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className="relative inline-block"
                        >
                          Refund Policy
                        </motion.span>
                      </a>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                      <a
                        href="https://www.perfectworld.global/policies/terms-of-service"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm mb-2"
                      >
                        <motion.span
                          whileHover={{
                            x: 8,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className="relative inline-block"
                        >
                          Terms of Service
                        </motion.span>
                      </a>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                      <a
                        href="https://www.perfectworld.global/pages/legal-notice"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm mb-2"
                      >
                        <motion.span
                          whileHover={{
                            x: 8,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className="relative inline-block"
                        >
                          Legal Notice
                        </motion.span>
                      </a>
                    </motion.div>
                    <motion.div variants={linkVariants}>
                      <a
                        href="https://www.perfectworld.global/policies/shipping-policy"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm"
                      >
                        <motion.span
                          whileHover={{
                            x: 8,
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          className="relative inline-block"
                        >
                          Shipping Policy
                        </motion.span>
                      </a>
                    </motion.div>
                  </motion.div>

                  {/* Newsletter */}
                  <motion.div variants={itemVariants} className="flex flex-col gap-2">
                    <motion.h3
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="mb-2 uppercase text-gray-400 text-xs font-semibold tracking-wider border-b border-white/10 pb-1 hover:text-white transition-colors duration-300"
                    >
                      Stay Connected
                    </motion.h3>
                    <motion.form variants={linkVariants} className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs placeholder-gray-400 focus:outline-none focus:border-white/40"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Subscribe
                      </motion.button>
                    </motion.form>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Footer Bottom Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-4 md:gap-6 mt-6"
            >
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                  className="text-[12vw] md:text-[10vw] lg:text-[8vw] xl:text-[6vw] leading-[0.8] font-serif bg-gradient-to-r from-white via-gray-400 to-white/60 bg-clip-text text-transparent cursor-default"
                >
                  PERFECT WORLD
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="flex items-center gap-3 md:gap-4 mt-3 md:mt-4"
                >
                  <motion.div
                    className="w-8 md:w-12 h-0.5 bg-gradient-to-r from-white to-gray-400"
                    animate={{
                      scaleX: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    className="text-gray-400 text-xs md:text-sm font-sans hover:text-white transition-colors duration-300"
                  >
                    Together. Not Alone.
                  </motion.p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="text-left md:text-right"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                  className="text-gray-400 text-xs md:text-sm mb-2 md:mb-3 hover:text-white transition-colors duration-300"
                >
                  © 2025 Perfect World. All rights reserved.
                </motion.p>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 2, staggerChildren: 0.1 }}
                  className="flex gap-2 md:gap-3"
                >
                  <motion.a
                    variants={socialVariants}
                    href="https://www.instagram.com/perfectworld.global"
                    whileHover={{
                      scale: 1.2,
                      rotate: 12,
                      transition: { type: "spring", stiffness: 300, damping: 15 },
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-white hover:to-gray-400 flex items-center justify-center transition-colors duration-300 group"
                    aria-label="Instagram"
                  >
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    variants={socialVariants}
                    href="https://www.facebook.com/perfectworld.global"
                    whileHover={{
                      scale: 1.2,
                      rotate: 12,
                      transition: { type: "spring", stiffness: 300, damping: 15 },
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-white hover:to-gray-400 flex items-center justify-center transition-colors duration-300 group"
                    aria-label="Facebook"
                  >
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.01 3.66 9.17 8.44 9.96v-7.04H7.9v-2.92h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.22.2 2.22.2v2.44h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.92h-2.3v7.04C18.34 21.24 22 17.08 22 12.07z" />
                    </svg>
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.footer>
        </div>
      </div>
    </div>
  )
}
