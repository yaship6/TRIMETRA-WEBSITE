import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { whatsappLink } from '../utils/assets.js';

export default function Contact({ contact }) {
    const [submitted, setSubmitted] = useState(false);
    const [activeLocationIndex, setActiveLocationIndex] = useState(0);
    useScrollReveal();

    const locations = contact.location?.locations || [
        {
            id: 'bandra',
            name: 'Office Address',
            tagline: 'Waterfield Road Pinpoint',
            address: '50, Waterfield Road, behind Metro Sweets, Bandra West, Mumbai, Maharashtra 400050',
            coordinates: '19.0579965° N, 72.8331455° E',
            mapEmbedUrl: 'https://maps.google.com/maps?q=19.0579965,72.8331455&t=&z=16&ie=UTF8&iwloc=&output=embed',
            mapUrl: 'https://www.google.com/maps/place/50,+Waterfield+Road,+behind+Metro+Sweets,+Bandra+West,+Mumbai,+Maharashtra+400050/@19.0579965,72.8331455,17z/'
        },
        {
            id: 'zaveri',
            name: 'Registered Address',
            tagline: 'Shaikh Memon Street Pinpoint',
            address: 'Shop No. 3, 2nd Floor, Calian House, Shaikh Memon Street, Above Mumbadevi Jalebiwala, Zaveri Bazaar, Mumbai - 400002',
            coordinates: '18°57\'06.3"N 72°49\'50.5"E',
            mapEmbedUrl: 'https://maps.google.com/maps?q=18.95175,72.830694&t=&z=17&ie=UTF8&iwloc=&output=embed',
            mapUrl: 'https://www.google.com/maps/search/?api=1&query=18.95175,72.830694'
        }
    ];

    const activeLoc = locations[activeLocationIndex] || locations[0];

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const name = form.elements['form-name'].value;
        const email = form.elements['form-email'].value;
        const phone = form.elements['form-phone'].value || 'N/A';
        const interest = form.elements['form-interest'].value || 'N/A';
        const message = form.elements['form-message'].value || 'N/A';

        const formattedText = `Hello Trimetra, I would like to gain more info.

*Details:*
- *Name:* ${name}
- *Email:* ${email}
- *Phone:* ${phone}
- *Collection Interest:* ${interest}
- *Special Notes/Booking Date:* ${message}`;

        const url = whatsappLink(contact.whatsapp.number, formattedText);
        window.open(url, '_blank');

        form.reset();
        setSubmitted(true);
        window.setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="contact-page-global-wrapper">
            <div className="contact-page-wrapper fade-in-section">
                <div className="contact-hero-animated reveal-on-scroll">
                    <SectionHeader eyebrow="Private Concierge" title="Connect With Us" />
                </div>

                <div className="contact-grid">
                    <div className="contact-info-panel reveal-on-scroll reveal-slide-left">
                        <div className="contact-intro">
                            <h2>Dedicated Assistance</h2>
                            <p>Our client advisors are available to guide you through bespoke customisations, collection queries, and private showroom visits. Please reach out via your preferred method.</p>
                        </div>

                        <div className="contact-methods">
                            <div className="contact-method-item reveal-on-scroll" style={{ '--reveal-delay': '120ms' }}>
                                <div className="contact-method-icon"><i className="fas fa-phone-alt fa-flip-horizontal" style={{ transform: 'scaleX(-1)' }} /></div>
                                <div className="contact-method-details">
                                    <h4>Call or WhatsApp</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                                        <a href={whatsappLink(contact.whatsapp.number, contact.whatsapp.message)} target="_blank" rel="noopener noreferrer">
                                            {contact.whatsapp.display}
                                        </a>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', marginTop: 4, color: 'var(--text-muted)' }}>Instant advice & queries</p>
                                </div>
                            </div>

                            <div className="contact-method-item reveal-on-scroll" style={{ '--reveal-delay': '220ms' }}>
                                <div className="contact-method-icon"><i className="fab fa-instagram" /></div>
                                <div className="contact-method-details">
                                    <h4>Instagram</h4>
                                    <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer">{contact.instagram.handle}</a>
                                    <p style={{ fontSize: '0.8rem', marginTop: 4, color: 'var(--text-muted)' }}>Daily showcases & features</p>
                                </div>
                            </div>

                            <div className="contact-method-item reveal-on-scroll" style={{ '--reveal-delay': '320ms' }}>
                                <div className="contact-method-icon"><i className="far fa-envelope" /></div>
                                <div className="contact-method-details">
                                    <h4>Email Enquiries</h4>
                                    <a href={`mailto:${contact.email.address}`}>{contact.email.address}</a>
                                    <p style={{ fontSize: '0.8rem', marginTop: 4, color: 'var(--text-muted)' }}>Corporate & custom orders</p>
                                </div>
                            </div>

                            <div className="contact-method-item reveal-on-scroll" style={{ '--reveal-delay': '420ms' }}>
                                <div className="contact-method-icon"><i className="fas fa-map-marker-alt" /></div>
                                <div className="contact-method-details">
                                    <h4>Office Address</h4>
                                    <p>{contact.location.address}</p>
                                    <p className="contact-hours-text" style={{ fontSize: '0.85rem', marginTop: 6 }}>{contact.location.hours}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-panel reveal-on-scroll reveal-slide-right" style={{ '--reveal-delay': '180ms' }}>
                        <h3>Request an Appointment</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="form-name">First & Last Name</label>
                                    <input type="text" id="form-name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="form-email">Email Address</label>
                                    <input type="email" id="form-email" required />
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="form-phone">Phone Number</label>
                                    <input type="tel" id="form-phone" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="form-interest">Collection Interest</label>
                                    <input type="text" id="form-interest" />
                                </div>
                            </div>
                            <div className="form-group full-width" style={{ marginBottom: 25 }}>
                                <label htmlFor="form-message">Special Notes / Desired Booking Date</label>
                                <textarea id="form-message" rows="5" />
                            </div>

                            <button type="submit" className="gold-btn form-submit-btn">Send Request</button>
                            <div className={`form-status-msg success${submitted ? ' is-visible' : ''}`}>
                                Request received successfully. Our concierge team will reach out to you shortly.
                            </div>
                        </form>
                    </div>
                </div>

                <section className="map-section reveal-on-scroll">
                    <div className="map-location-selector-header" style={{ marginBottom: '15px' }}>
                        <div className="map-directions-bar">
                            <a
                                href={activeLoc.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="map-directions-btn"
                            >
                                <i className="fas fa-directions"></i> Get Directions on Google Maps
                            </a>
                        </div>

                        {/* Location Tabs */}
                        <div className="map-location-tabs">
                            {locations.map((loc, idx) => (
                                <button
                                    key={loc.id || idx}
                                    onClick={() => setActiveLocationIndex(idx)}
                                    type="button"
                                    className={`map-tab-btn ${activeLocationIndex === idx ? 'active' : ''}`}
                                >
                                    <i className="fas fa-map-pin"></i>
                                    <span>{loc.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Active Location Info Card */}
                        <div className="active-location-card">
                            <div className="active-location-inner">
                                <div>
                                    <strong className="active-loc-title">{activeLoc.name}</strong>
                                    <p className="active-loc-address">{activeLoc.address}</p>
                                </div>
                                {activeLoc.coordinates && (
                                    <span className="active-loc-coords">
                                        <i className="fas fa-crosshairs"></i> {activeLoc.coordinates}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="map-container" style={{ position: 'relative' }}>
                        <iframe
                            src={activeLoc.mapEmbedUrl}
                            allowFullScreen
                            loading="lazy"
                            title={`${activeLoc.name} Google Map`}
                            referrerPolicy="no-referrer-when-downgrade"
                            style={{ pointerEvents: 'auto' }}
                        />
                        <a
                            href={activeLoc.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="map-top-corner-link"
                            title={`Open ${activeLoc.name} on Google Maps`}
                        >
                            <i className="fas fa-external-link-alt"></i> Open in Google Maps
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}