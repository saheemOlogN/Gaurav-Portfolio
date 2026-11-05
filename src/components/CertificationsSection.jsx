import { useLayoutEffect, useRef, useState } from 'react'
import FoldText from './FoldText'
import './CertificationsSection.css'

const certificates = [
  { title: 'Diploma in Personal Training', id: '307304' },
  { title: 'Practical Certificate', id: '307304' },
  { title: 'First Aid & C.P.R.' },
  { title: 'Nutrition', id: '307304' },
  { title: 'Supplement Certificate', id: '307304' },
  { title: 'Special Population', id: '307304' },
  { title: 'Female Fitness Trainer', id: '307304' },
  { title: 'Sport’s Injury and Rehabilitation', id: '307304' },
  { title: 'Personality Development', id: '307304' },
  { title: 'Gym Management', id: '307304' },
  { title: 'Functional Training' }
]

function CertificationsSection() {
  const [slideIndex, setSlideIndex] = useState(certificates.length)
  const [stepWidth, setStepWidth] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const measureStep = () => {
      const card = track.querySelector('.certification-card')
      if (!card) return
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0
      setStepWidth(card.getBoundingClientRect().width + gap)
    }

    measureStep()
    const observer = new ResizeObserver(measureStep)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  const move = (direction) => {
    if (isAnimating) return
    setIsAnimating(true)
    setSlideIndex((index) => index + direction)
  }

  const finishSlide = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return
    if (slideIndex >= certificates.length * 2) {
      setSlideIndex(certificates.length)
    } else if (slideIndex < certificates.length) {
      setSlideIndex(certificates.length * 2 - 1)
    }
    setIsAnimating(false)
  }

  return (
    <section className="certifications-section" id="certifications" aria-labelledby="certifications-title">
      <div className="certifications-content">
        <h2 className="certifications-title" id="certifications-title">
          <FoldText
            text="Certifications"
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
            fontSize="clamp(3rem, 7vw, 5rem)"
            fontWeight={800}
            color="#ffffff"
          />
        </h2>
        <p className="certifications-intro">Training and education that shape my coaching approach.</p>

        <div className="certification-carousel" aria-label="Certifications carousel">
          <button className="certification-arrow" type="button" onClick={() => move(-1)} disabled={isAnimating} aria-label="Previous certificates">
            <span aria-hidden="true">←</span>
          </button>
          <div className="certification-viewport" aria-label="Certificates">
            <div
              className={`certification-track${isAnimating ? ' is-animating' : ''}`}
              ref={trackRef}
              onTransitionEnd={finishSlide}
              style={{ transform: `translate3d(-${slideIndex * stepWidth}px, 0, 0)` }}
            >
              {[0, 1, 2].map((copy) => certificates.map((certificate) => (
                <article
                  className="certification-card"
                  key={`${copy}-${certificate.title}`}
                  aria-hidden={copy !== 1 ? 'true' : undefined}
                >
                  <h3>{certificate.title}</h3>
                  {certificate.id && <span className="certification-id">ID · {certificate.id}</span>}
                </article>
              )))}
            </div>
          </div>
          <button className="certification-arrow" type="button" onClick={() => move(1)} disabled={isAnimating} aria-label="Next certificates">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default CertificationsSection
