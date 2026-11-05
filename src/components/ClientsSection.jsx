import { useEffect, useState } from 'react'
import FoldText from './FoldText'
import FlexCarousel from './FlexCarousel'
import clientPhotos from 'virtual:client-items'
import './ClientsSection.css'

const placeholderArtwork = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#25232b"/><stop offset="1" stop-color="#111014"/></linearGradient></defs><rect width="720" height="480" fill="url(#g)"/><circle cx="360" cy="220" r="142" fill="none" stroke="#c9ff37" stroke-opacity=".18" stroke-width="2"/><circle cx="360" cy="220" r="105" fill="none" stroke="#c9ff37" stroke-opacity=".12"/><path d="M0 395 720 84M-20 470 690-15" stroke="#fff" stroke-opacity=".04" stroke-width="2"/></svg>'
)}`
const placeholderClients = [0, 1, 2].map((index) => ({
  src: placeholderArtwork,
  alt: '',
  title: '',
  subtitle: '',
  info: '',
  placeholder: true,
  id: `client-placeholder-${index}`
}))
const demoTestimonials = [
  {
    quote: 'The plan feels clear and achievable. I’m moving better and showing up consistently.',
    client: 'Aarav S.'
  },
  {
    quote: 'Sessions are focused, supportive, and easy to fit into my week.',
    client: 'Nisha R.'
  },
  {
    quote: 'I feel stronger, more confident, and accountable between sessions.',
    client: 'Kabir M.'
  },
  {
    quote: 'Small progress every week has made training feel sustainable.',
    client: 'Riya P.'
  }
]

function ClientsSection() {
  const [selectedClient, setSelectedClient] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const galleryItems = clientPhotos.length > 0 ? clientPhotos : placeholderClients

  useEffect(() => {
    const media = window.matchMedia('(max-width: 600px)')
    const updateMobile = () => setIsMobile(media.matches)
    updateMobile()
    media.addEventListener('change', updateMobile)
    return () => media.removeEventListener('change', updateMobile)
  }, [])

  const selectClient = (index, item) => {
    if (item && !item.placeholder) setSelectedClient(item)
  }

  useEffect(() => {
    if (!selectedClient) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedClient(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedClient])

  return (
    <section className="clients-section" id="clients" aria-labelledby="clients-title">
      <div className="clients-content">
        <h2 className="clients-title" id="clients-title">
          <FoldText
            text="Clients"
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
      </div>

      <div className="clients-carousel">
        <FlexCarousel
          items={galleryItems}
          preset="liquid"
          intro={isMobile ? 'fade' : 'rise'}
          cardHeight={isMobile ? 0.58 : 0.5}
          gap={isMobile ? 8 : 12}
          squeeze={0.2}
          focusOnClick={false}
          captions={false}
          onSelect={selectClient}
        />
      </div>

      <section className="testimonials" aria-label="Demo client testimonials">
        <h3 className="testimonials-heading">WHAT MY CLIENTS SAY</h3>
        <div className="testimonials-window">
          <div className="testimonials-track">
              {[0, 1, 2].map((copy) => (
              <div className="testimonials-group" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
                {demoTestimonials.map((testimonial) => (
                  <article className="testimonial-card" key={`${copy}-${testimonial.client}`}>
                    <p>“{testimonial.quote}”</p>
                    <div className="testimonial-rating">
                      <span className="testimonial-name">{testimonial.client}</span>
                      <span className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</span>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedClient && (
        <div
          className="client-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedClient(null)
          }}
        >
          <section className="client-modal" role="dialog" aria-modal="true" aria-labelledby="client-modal-title">
            <button className="client-modal-close" type="button" onClick={() => setSelectedClient(null)} aria-label="Close client details">
              ×
            </button>
            <img
              className="client-modal-image"
              src={selectedClient.src}
              alt={selectedClient.alt || selectedClient.title || 'Client photo preview'}
            />
            <div className="client-modal-info">
              <span className="client-details-label">CLIENT PROFILE</span>
              <h3 id="client-modal-title">{selectedClient.title || selectedClient.name}</h3>
              {selectedClient.subtitle && <p className="client-subtitle">{selectedClient.subtitle}</p>}
              <p>{selectedClient.info || 'Add client details in clients.json to complete this profile.'}</p>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default ClientsSection
