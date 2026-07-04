import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { whatsappLink } from '../utils/assets.js';

export default function Contact({ contact }) {
    const [submitted, setSubmitted] = useState(false);
    useScrollReveal();

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
                                <div className="contact-method-icon"><i className="fas fa-phone-alt" /></div>
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
                    <div className="map-container">
                        <iframe src={contact.location.mapEmbedUrl} allowFullScreen loading="lazy" title="Trimetra showroom map" />
                    </div>
                </section>
            </div>
        </div>
    );
}