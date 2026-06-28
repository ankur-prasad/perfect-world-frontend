import { useState } from 'react'
import { motion } from 'framer-motion'
import Footer from '../components/Layout/Footer'
import Navigation from '../components/Layout/Navigation'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', comment: '' })

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Message from ${form.name || 'website visitor'}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.comment}`
    )
    window.location.href = `mailto:info@perfectworld.global?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <Navigation />

      <main className="pt-40 md:pt-48 pb-32" style={{ paddingLeft: '32px', paddingRight: '32px' }}>
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-16 text-center">
              Contact Us
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5 mb-16">
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange('name')}
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400 h-12"
                />
                <Input
                  type="email"
                  placeholder="Email *"
                  required
                  value={form.email}
                  onChange={handleChange('email')}
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400 h-12"
                />
              </div>
              <Input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange('phone')}
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 h-12"
              />
              <textarea
                placeholder="Comment"
                rows={6}
                value={form.comment}
                onChange={handleChange('comment')}
                className="w-full rounded-md bg-white/5 border border-white/20 text-white placeholder-gray-400 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              />
              <Button
                type="submit"
                className="w-full md:w-auto px-10 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
              >
                Send
              </Button>
            </form>

            <div className="text-center text-gray-400 space-y-1.5">
              <p>Perfect World</p>
              <p>Nicholas Freitag</p>
              <a href="mailto:info@perfectworld.global" className="block hover:text-white transition-colors">
                info@perfectworld.global
              </a>
              <p>+49 15129109696</p>
              <p>Am Hochwald 5</p>
              <p>82319 Starnberg, Germany</p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
