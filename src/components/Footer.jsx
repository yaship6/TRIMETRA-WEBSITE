import { imageUrl, whatsappLink } from '../utils/assets.js';

export default function Footer({ content }) {
    const { brand, contact } = content;

    return (
        <footer className="luxury-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <div className="footer-logo-group" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div className="footer-logo" style={{ display: 'inline-block' }}>
                            <img src={imageUrl('assets/images/Logo1.png')} alt="TRIMETRA logo" className="site-logo footer-site-logo" />
                        </div>
                        <p className="footer-subunit" style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.75rem',
                            color: 'var(--color-gold)',
                            fontWeight: '500',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            margin: '0',
                            opacity: '0.9',
                            lineHeight: '1.2'
                        }}>A unit by Osiya Bullion</p>
                    </div>
                    <div className="footer-addresses" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', marginTop: '15px' }}>
                        <p className="footer-address" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: '1.6', margin: '0', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <i className="fas fa-map-marker-alt" style={{ color: 'var(--color-gold)', marginTop: '4px', fontSize: '0.9rem' }} />
                            <span>
                                <strong>Registered Address:</strong><br />
                                Shop No. 3, 2nd Floor, Calian House,<br />
                                Shaikh Memon Street, Above Mumbadevi Jalebiwala,<br />
                                Zaveri Bazaar,<br /> Mumbai - 400002.
                            </span>
                        </p>
                        <p className="footer-address" style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: '1.6', margin: '0', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <i className="fas fa-map-marker-alt" style={{ color: 'var(--color-gold)', marginTop: '4px', fontSize: '0.9rem' }} />
                            <span>
                                <strong>Office Address:</strong><br />
                                03, Ground Floor, Zarine Building, 4th Road,<br />
                                Opp. Bhabha Hospital, Bandra West,<br />
                                Mumbai - 400050.
                            </span>
                        </p>
                    </div>
                    <div className="footer-insta-wrap" style={{ marginTop: '5px' }}>
                        <a href={contact.instagram.url} target="_blank" rel="noopener noreferrer" className="footer-insta-link">
                            <i className="fab fa-instagram" /> <span>{contact.instagram.handle}</span>
                        </a>
                    </div>
                    <div className="footer-socials">
                        <a href={whatsappLink(contact.whatsapp.number, contact.whatsapp.message)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                            <i className="fab fa-whatsapp" />
                        </a>
                        <a href={`mailto:${contact.email.address}`} aria-label="Email">
                            <i className="far fa-envelope" />
                        </a>
                    </div>
                </div>

                <div className="footer-links-col">
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#/jewellery-care">Jewellery Care</a></li>
                        <li><a href="#/contact">Contact Us</a></li>
                        <li><a href="#/contact">Store Location</a></li>
                    </ul>
                </div>

                <div className="footer-links-col">
                    <h3>About</h3>
                    <ul>
                        <li><a href="#/about">Our Story</a></li>
                        <li><a href="#/about#vision">Our Vision</a></li>
                        <li><a href="#/about#why-choose-us">Why Choose Us</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 Trimetra Luxury. All rights reserved. | Handcrafted Authenticity</p>
            </div>
        </footer>
    );
}
