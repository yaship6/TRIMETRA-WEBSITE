import { imageUrl, whatsappLink } from '../utils/assets.js';
import content from '../../data/content.json';

export default function ComingSoon() {
    const { contact } = content;

    return (
        <div className="coming-soon-wrapper">
            <div className="coming-soon-overlay"></div>
            <div className="coming-soon-content">
                <div className="coming-soon-brand animate-fade-in">
                    <img 
                        src={imageUrl('assets/images/Logo1.webp')} 
                        alt="TRIMETRA Logo" 
                        className="coming-soon-logo" 
                    />
                    <h1 className="coming-soon-title">TRIMETRA</h1>
                    <p className="coming-soon-subunit">A unit by Osiya Bullion</p>
                </div>

                <div className="coming-soon-divider animate-scale-up"></div>

                <div className="coming-soon-message animate-fade-in-delayed">
                    <p className="coming-soon-tagline">Exclusive Silver Jewellery</p>
                    <h2 className="coming-soon-heading">Something Beautiful is Crafting</h2>
                    <p className="coming-soon-desc">
                        Our digital boutique is undergoing a luxurious transformation. We are preparing an exquisite experience to showcase our fine handcrafted silver jewellery.
                    </p>
                </div>

                <div className="coming-soon-contacts animate-fade-in-delayed-more">
                    <p className="contact-prompt">In the meantime, feel free to reach out to us:</p>
                    <div className="coming-soon-links">
                        <a 
                            href={whatsappLink(contact.whatsapp.number, contact.whatsapp.message)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="coming-soon-btn whatsapp-btn"
                        >
                            <i className="fab fa-whatsapp"></i>
                            <span>Chat on WhatsApp</span>
                        </a>
                        <a 
                            href={contact.instagram.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="coming-soon-btn instagram-btn"
                        >
                            <i className="fab fa-instagram"></i>
                            <span>Follow Instagram</span>
                        </a>
                        <a 
                            href={`mailto:${contact.email.address}`} 
                            className="coming-soon-btn email-btn"
                        >
                            <i className="far fa-envelope"></i>
                            <span>Send Email</span>
                        </a>
                    </div>
                </div>

                <div className="coming-soon-footer animate-fade-in-delayed-more">
                    <p>&copy; {new Date().getFullYear()} Trimetra Luxury. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
