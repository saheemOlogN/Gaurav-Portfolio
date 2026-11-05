import { useEffect, useState } from 'react'
import PatternWaves from '../components/PatternWaves'
import GlassSurface from '../components/GlassSurface'
import AboutSection from '../components/AboutSection'
import ClientsSection from '../components/ClientsSection'
import CertificationsSection from '../components/CertificationsSection'
import ContactSection from '../components/ContactSection'
import './HomePage.css'

const roles = ['Better movement', 'Strength training', 'Lasting progress']

function Typewriter() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const currentRole = roles[roleIndex]
    const finishedTyping = !deleting && text === currentRole
    const finishedDeleting = deleting && text.length === 0
    const delay = finishedTyping ? 1400 : deleting ? 48 : 92
    const timer = window.setTimeout(() => {
      if (finishedTyping) {
        setDeleting(true)
      } else if (finishedDeleting) {
        setDeleting(false)
        setRoleIndex((index) => (index + 1) % roles.length)
      } else {
        setText((value) => deleting ? value.slice(0, -1) : currentRole.slice(0, value.length + 1))
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [deleting, roleIndex, text])

  return <span className="typed-role">{text}<span className="typing-caret" aria-hidden="true" /></span>
}

function App() {
  const [contactOpen, setContactOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!contactOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setContactOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [contactOpen])

  useEffect(() => {
    if (!menuOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const sendWhatsAppMessage = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = form.get('name')?.toString().trim()
    const phone = form.get('phone')?.toString().trim()
    const training = form.get('training')?.toString()
    const schedule = form.get('schedule')?.toString()
    const message = form.get('message')?.toString().trim()
    const lines = [
      `Hi Gaurav, I’m ${name}.`,
      `I’m interested in: ${training}.`,
      `Preferred option: ${schedule}.`,
      phone ? `My phone number: ${phone}.` : '',
      message ? `A little more about my goals: ${message}` : ''
    ].filter(Boolean)
    const whatsappUrl = `https://wa.me/917249046613?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setContactOpen(false)
  }

  return (
    <>
      <div className="wave-background" aria-hidden="true">
        <PatternWaves
          preset="silk"
          color="#9994a0"
          backgroundColor="#111014"
          fade="edges"
          interactive
          cursorSize={72}
          cursorStrength={0.12}
          pattern="dot"
          wave="silk"
          spacing={9}
          markSize={0.95}
          depth={0.34}
          light={0}
          shine={0.22}
          contrast={0.84}
          speed={0.1}
          scale={1}
          direction={20}
          opacity={0.34}
          fadeSize={0.5}
          characters=".:-=+*#%@"
          intro
          paused={false}
        />
      </div>

      <GlassSurface
        className="nav-glass"
        width="min(100% - 48px, 1280px)"
        height={76}
        borderRadius={38}
        distortionScale={-180}
        displace={0.5}
        backgroundOpacity={0.1}
      >
        <nav className="glass-nav" aria-label="Main navigation">
          <a className="nav-brand" href="#home" aria-label="Gaurav home">GAURAV<span>.</span></a>
          <div className={`nav-links${menuOpen ? ' is-open' : ''}`} id="site-navigation">
            <a href="#about-me" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#clients" onClick={() => setMenuOpen(false)}>Clients</a>
            <a href="#journey" onClick={() => setMenuOpen(false)}>Journey</a>
            <a href="#certifications" onClick={() => setMenuOpen(false)}>Certifications</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
          <div className="nav-actions">
            <button
              className={`nav-menu-toggle${menuOpen ? ' is-open' : ''}`}
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="site-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
            <button className="contact-button" type="button" onClick={() => { setMenuOpen(false); setContactOpen(true) }}>Let’s talk</button>
          </div>
        </nav>
      </GlassSurface>

    <main className="home" id="home">
      <section className="intro" id="about" aria-label="Introduction">
        <div className="intro-copy">
          <p className="eyebrow">I AM</p>
          <h1>GAURAV<span className="name-dot">.</span></h1>
          <div className="role-line"><span className="provide-label">I provide</span><Typewriter /></div>
          <p className="intro-note" id="journey">Training for people who want to feel stronger, move well, and stay consistent. We’ll keep it simple, practical, and built around your actual life.</p>
          <div className="hero-actions">
            <button className="hero-cta" type="button" onClick={() => setContactOpen(true)}>Start training <span aria-hidden="true">→</span></button>
            <a className="about-link" href="#about-me">About me</a>
          </div>
        </div>

        <div className="portrait" aria-label="Profile photo">
          <img
            src="/photos/profile.jpg"
            alt="Gaurav’s profile photo"
          />
        </div>
      </section>
    </main>
    <AboutSection />
    <ClientsSection />
    <CertificationsSection />
    <ContactSection onContactClick={() => setContactOpen(true)} />

    {contactOpen && (
      <div className="contact-dialog-backdrop" onMouseDown={(event) => {
        if (event.target === event.currentTarget) setContactOpen(false)
      }}>
        <section className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title">
          <button className="contact-dialog-close" type="button" onClick={() => setContactOpen(false)} aria-label="Close contact form">×</button>
          <p className="contact-dialog-eyebrow">LET’S GET STARTED</p>
          <h2 id="contact-dialog-title">Tell me what you’re looking for.</h2>
          <form className="contact-form" onSubmit={sendWhatsAppMessage}>
            <label>
              Your name
              <input name="name" type="text" autoComplete="name" placeholder="Name" required />
            </label>
            <label>
              Phone number (optional)
              <input name="phone" type="tel" autoComplete="tel" placeholder="Your number" />
            </label>
            <label>
              Training interest
              <select name="training" defaultValue="" required>
                <option value="" disabled>Select an option</option>
                <option>Full-time gym role</option>
                <option>Part-time gym role</option>
                <option>Personal training</option>
                <option>Online coaching</option>
                <option>Other fitness support</option>
              </select>
            </label>
            <label>
              Preferred schedule
              <select name="schedule" defaultValue="Flexible">
                <option>Flexible</option>
                <option>Weekday mornings</option>
                <option>Weekday evenings</option>
                <option>Weekends</option>
              </select>
            </label>
            <label className="contact-form-message">
              Your goals (optional)
              <textarea name="message" rows="3" placeholder="Tell me a little about what you want to achieve" />
            </label>
            <button className="contact-form-submit" type="submit">Send message on WhatsApp <span aria-hidden="true">→</span></button>
          </form>
        </section>
      </div>
    )}
    </>
  )
}

export default App
