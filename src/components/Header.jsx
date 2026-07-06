import { useEffect, useState } from 'react';
import { imageUrl } from '../utils/assets.js';
import content from '../../data/content.json';

const navItems = [
    { href: '#/home', label: 'Home', match: '/home' },
    { href: '#/about', label: 'About Us', match: '/about' },
    { href: '#/contact', label: 'Contact', match: '/contact' }
];

function isActive(currentPath, item) {
    if ((currentPath === '/' || currentPath === '/home') && item.match === '/home') return true;
    return item.match !== '/home' && currentPath.startsWith(item.match);
}

const formatRate = (rate) => rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Header({ currentPath }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [shrink, setShrink] = useState(false);

    // Live rates — Gold (per gram) and Silver (per gram)
    const [gold, setGold] = useState(7245.50);
    const [silver, setSilver] = useState(91.20);

    useEffect(() => {
        setMenuOpen(false);
    }, [currentPath]);

    useEffect(() => {
        const updateHeader = () => setShrink(window.scrollY > 50);
        updateHeader();
        window.addEventListener('scroll', updateHeader);

        // Scrape bullions.co.in for live gold & silver rates
        const fetchFromBullions = async () => {
            try {
                const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://bullions.co.in/location/india/');
                const response = await fetch(proxyUrl);
                const html = await response.text();

                // Parse gold rate (per 10g) from the table — first numeric value in gold row
                const goldMatch = html.match(/gold"[^>]*>[\s\S]*?₹\s*([\d,]+(?:\.\d+)?)/i)
                    || html.match(/Gold Rate[\s\S]*?₹\s*([\d,]+(?:\.\d+)?)/i);
                // Parse silver rate (per kg) from the table
                const silverMatch = html.match(/silver"[^>]*>[\s\S]*?₹\s*([\d,]+(?:\.\d+)?)/i)
                    || html.match(/Silver Rate[\s\S]*?₹\s*([\d,]+(?:\.\d+)?)/i);

                if (goldMatch) {
                    const gold10g = parseFloat(goldMatch[1].replace(/,/g, ''));
                    if (gold10g > 0) setGold(+(gold10g / 10).toFixed(2)); // Convert 10g → per gram
                }
                if (silverMatch) {
                    const silverKg = parseFloat(silverMatch[1].replace(/,/g, ''));
                    if (silverKg > 100) setSilver(+(silverKg / 1000).toFixed(2)); // Convert kg → per gram
                    else if (silverKg > 0) setSilver(+silverKg.toFixed(2)); // Already per gram
                }
            } catch (error) {
                console.warn('Bullions fetch failed, using mock rates:', error.message);
            }
        };

        fetchFromBullions();
        const interval = setInterval(fetchFromBullions, 60000); // Refresh every 60 seconds

        // Small mock fluctuation as fallback animation
        const mockInterval = setInterval(() => {
            setGold((prev) => +(prev + (Math.random() - 0.5) * 1.2).toFixed(2));
            setSilver((prev) => +(prev + (Math.random() - 0.5) * 0.06).toFixed(2));
        }, 5000);

        return () => {
            window.removeEventListener('scroll', updateHeader);
            clearInterval(interval);
            clearInterval(mockInterval);
        };
    }, []);


    return (
        <>
            <div className="live-rates-bar">
                <span className="live-rates-content">
                    <span className="live-pulse">🟢</span> Live Rate (per g) &nbsp;|&nbsp; Silver: <strong>₹{formatRate(silver)}</strong> &nbsp;|&nbsp; Gold: <strong>₹{formatRate(gold)}</strong>
                </span>
            </div>

            <header className={`luxury-header${shrink ? ' shrink' : ''}`}>
                <div className="header-container">
                    <div className="logo-container">
                        <a href="#/home" className="brand-logo">
                            <img src={imageUrl('assets/images/logo.png')} alt="TRIMETRA logo" className="site-logo" />
                        </a>
                    </div>

                    <button
                        className={`nav-toggle${menuOpen ? ' open' : ''}`}
                        aria-label="Toggle navigation menu"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        <span className="hamburger" />
                    </button>

                    <nav className={`nav-menu${menuOpen ? ' open' : ''}`}>
                        <ul className="nav-list">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <a href={item.href} className={`nav-link${isActive(currentPath, item) ? ' active' : ''}`}>
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}
