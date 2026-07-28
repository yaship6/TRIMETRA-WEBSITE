import { useEffect } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { imageUrl } from '../utils/assets.js';

const icons = ['fa-handshake', 'fa-certificate', 'fa-infinity', 'fa-gem', 'fa-heart', 'fa-seedling'];

export default function About({ content }) {
    const { vision, founderStory, whyChooseUs } = content;
    useScrollReveal();

    useEffect(() => {
        const handleHashScroll = () => {
            const hashParts = window.location.hash.split('#');
            const anchorId = hashParts[2];
            if (anchorId) {
                const element = document.getElementById(anchorId);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }
        };

        handleHashScroll();
        window.addEventListener('hashchange', handleHashScroll);
        return () => window.removeEventListener('hashchange', handleHashScroll);
    }, []);

    return (
        <div className="about-page-wrapper fade-in-section">
            <div className="about-hero-section about-hero-animated reveal-on-scroll">
                <span className="section-subtitle">Since Day One</span>
                <h1 className="section-title">The Spirit of Trimetra</h1>
            </div>

            <section className="about-intro-grid white-story-box reveal-on-scroll">
                <div className="about-intro-text reveal-on-scroll reveal-slide-left" style={{ '--reveal-delay': '120ms' }}>
                    <h2>{founderStory.title}</h2>
                    {founderStory.paragraphs.map((paragraph, index) => (
                        <p className="text-reveal-line" style={{ '--reveal-delay': `${220 + index * 120}ms` }} key={paragraph}>{paragraph}</p>
                    ))}
                </div>
                <div className="brand-story-img image-lift reveal-on-scroll reveal-slide-right" style={{ '--reveal-delay': '220ms' }}>
                    <img src={imageUrl('assets/images/logo@4x.webp')} alt="Trimetra Logo" loading="lazy" />
                </div>
            </section>

            <section className="why-choose-section reveal-on-scroll" id="why-choose-us">
                <div className="reveal-on-scroll">
                    <SectionHeader eyebrow="Responsible Luxury" title={whyChooseUs.title} />
                </div>

                <div className="why-choose-grid">
                    {whyChooseUs.items.map((item, index) => (
                        <div className="why-card" key={item.title}>
                            <div className="why-card-icon">
                                <i className={`fas ${icons[index] || 'fa-certificate'}`} />
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="vision-section reveal-on-scroll" id="vision">
                <div className="vision-card">
                    <h2 className="vision-title">
                        <span className="vision-icon"><i className="far fa-eye" /></span>
                        {vision.title}
                    </h2>
                    {vision.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
            </section>
        </div>
    );
}
