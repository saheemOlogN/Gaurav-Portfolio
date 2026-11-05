import { useEffect, useState } from 'react'
import FoldText from './FoldText'
import CircularCarousel from './CircularCarousel'
import carouselPhotos from 'virtual:carousel-items'
import './AboutSection.css'

const placeholderArtwork = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#26232c"/><stop offset="1" stop-color="#141318"/></linearGradient></defs><rect width="220" height="220" fill="url(#g)"/><circle cx="110" cy="110" r="68" fill="none" stroke="#c9ff37" stroke-opacity=".16"/><circle cx="110" cy="110" r="48" fill="none" stroke="#c9ff37" stroke-opacity=".1"/><path d="M0 170 220 45M-15 210 210-15" stroke="#fff" stroke-opacity=".035"/></svg>'
)}`
const placeholderItems = [0, 1, 2].map((index) => ({
  src: placeholderArtwork,
  alt: '',
  title: '',
  subtitle: '',
  id: `placeholder-${index}`
}))

function AboutSection() {
  const galleryItems = carouselPhotos.length > 0 ? carouselPhotos : placeholderItems
  const [cardWidth, setCardWidth] = useState(500)

  useEffect(() => {
    const updateCardWidth = () => {
      setCardWidth(window.innerWidth < 600 ? Math.max(260, window.innerWidth - 40) : 500)
    }

    updateCardWidth()
    window.addEventListener('resize', updateCardWidth)
    return () => window.removeEventListener('resize', updateCardWidth)
  }, [])

  return (
    <section className="about-section" id="about-me" aria-labelledby="about-title">
      <div className="about-content">
        <h2 className="about-title" id="about-title">
          <FoldText
            text="About Me"
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

        <p className="about-copy">
          Motivated and dedicated <strong>Personal Trainer</strong> with a passion for health, fitness, and helping
          individuals achieve their fitness goals. Experienced in working with multiple clients at{' '}
          <strong>Fenix Gym and Refit Gym</strong>, providing <strong>personalized workout guidance</strong>,{' '}
          <strong>fitness support</strong>, and <strong>motivation</strong>. Possesses strong interpersonal skills and
          foundational knowledge of <strong>exercise science</strong>, <strong>strength training</strong>, and{' '}
          <strong>nutrition</strong>, with a commitment to promoting <strong>healthy lifestyles</strong> and{' '}
          <strong>sustainable fitness habits</strong>.
        </p>

        <div className="about-gallery" aria-label="Training photo gallery">
          <CircularCarousel
            items={galleryItems}
            preset="cylinder"
            intro="rise"
            cardWidth={cardWidth}
            aspectRatio={1.4}
            speed={14}
            captions={false}
          />
        </div>
        <h3 className="gallery-title">My Physique Gallery</h3>
        {carouselPhotos.length === 0 && (
          <p className="gallery-empty-note">Add photos to <code>public/photos/carousel</code> to fill the gallery.</p>
        )}
      </div>
    </section>
  )
}

export default AboutSection
