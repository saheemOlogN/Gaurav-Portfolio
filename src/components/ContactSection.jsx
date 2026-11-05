import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import FoldText from './FoldText'
import './ContactSection.css'

const Lanyard = lazy(() => import('./Lanyard'))

function ContactSection({ onContactClick }) {
  const sectionRef = useRef(null)
  const [loadLanyard, setLoadLanyard] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadLanyard(true)
        observer.disconnect()
      }
    }, { rootMargin: '200px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-section-title" ref={sectionRef}>
      <div className="contact-lanyard-frame" aria-label="Interactive identification badge">
        {loadLanyard && (
          <Suspense fallback={<div className="contact-lanyard-loading" aria-hidden="true" />}>
            <Lanyard
              frontImage="/photos/id/id.png"
              backImage="/photos/id/id.png"
              orientation="portrait"
              size={0.72}
              anchor="right"
              strapLength={0.52}
              strapColor="#232327"
              breeze={0.08}
              damping={0.72}
              interactive
              intro
            />
          </Suspense>
        )}
      </div>

      <div className="contact-section-content">
        <h2 className="contact-section-title" id="contact-section-title">
          <FoldText
            text="Contact"
            foldStyle="paper"
            splitBy="char"
            hinge="top"
            trigger="scroll"
            foldAngle={72}
            duration={1.05}
            stagger={0.028}
            staggerFrom="start"
            ease="power2.out"
            perspective={700}
            creaseShading={0.55}
            fontSize="clamp(3.5rem, 8vw, 5rem)"
            fontWeight={800}
            color="#ffffff"
          />
        </h2>

        <div className="contact-section-layout">
          <div className="contact-section-copy">
            <h3>Ready to make a start?</h3>
            <p className="contact-section-description">
              Whether you’re looking for personal training, a gym role, or guidance with your fitness goals, send me a message and tell me what you have in mind.
            </p>
            <button className="contact-section-button" type="button" onClick={onContactClick}>
              Start a conversation <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
