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

export default function Header({ currentPath }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [shrink, setShrink] = useState(false);

    // Live rates state — Gold (per gram) and Silver (per gram)
    const [rates, setRates] = useState({
        silver: 220.00,
        gold24k: 14400.00
    });

    useEffect(() => {
        setMenuOpen(false);
    }, [currentPath]);

    useEffect(() => {
        const updateHeader = () => setShrink(window.scrollY > 50);
        updateHeader();
        window.addEventListener('scroll', updateHeader);

        // Fetch live gold & silver prices from reliable APIs
        const fetchLiveRates = async () => {
            let fetchedGold24k = null;
            let fetchedSilver = null;

            // Indian Market conversion factors (includes ~11.5% import/custom duty, 3% GST, and local market premium)
            const GOLD_DOMESTIC_FACTOR = 1.15;
            const SILVER_DOMESTIC_FACTOR = 1.22;

            // Primary Strategy: Gold-API INR directly
            try {
                const [resG, resS] = await Promise.all([
                    fetch('https://api.gold-api.com/price/XAU/INR'),
                    fetch('https://api.gold-api.com/price/XAG/INR')
                ]);

                if (resG.ok && resS.ok) {
                    const dataG = await resG.json();
                    const dataS = await resS.json();

                    if (dataG?.price && dataS?.price) {
                        fetchedGold24k = +((dataG.price / 31.1034768) * GOLD_DOMESTIC_FACTOR).toFixed(2);
                        fetchedSilver = +((dataS.price / 31.1034768) * SILVER_DOMESTIC_FACTOR).toFixed(2);
                    }
                }
            } catch (err) {
                console.warn('Gold-API INR primary fetch failed:', err.message);
            }

            // Fallback Strategy 1: Gold-API USD and exchange rate conversion
            if (!fetchedGold24k || !fetchedSilver) {
                try {
                    const [resG, resS, resFx] = await Promise.all([
                        fetch('https://api.gold-api.com/price/XAU'),
                        fetch('https://api.gold-api.com/price/XAG'),
                        fetch('https://open.er-api.com/v6/latest/USD')
                    ]);

                    if (resG.ok && resS.ok && resFx.ok) {
                        const dataG = await resG.json();
                        const dataS = await resS.json();
                        const dataFx = await resFx.json();
                        const inrRate = dataFx?.rates?.INR;

                        if (dataG?.price && dataS?.price && inrRate) {
                            fetchedGold24k = +(((dataG.price * inrRate) / 31.1034768) * GOLD_DOMESTIC_FACTOR).toFixed(2);
                            fetchedSilver = +(((dataS.price * inrRate) / 31.1034768) * SILVER_DOMESTIC_FACTOR).toFixed(2);
                        }
                    }
                } catch (err) {
                    console.warn('Gold-API USD fallback failed:', err.message);
                }
            }

            // Fallback Strategy 2: CoinGecko PAXG (Real 1:1 fine gold vault price in INR) + Gold-API Silver
            if (!fetchedGold24k || !fetchedSilver) {
                try {
                    const [resCG, resFx, resSilver] = await Promise.all([
                        fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=inr'),
                        fetch('https://open.er-api.com/v6/latest/USD'),
                        fetch('https://api.gold-api.com/price/XAG')
                    ]);

                    if (resCG.ok && resFx.ok && resSilver.ok) {
                        const dataCG = await resCG.json();
                        const dataFx = await resFx.json();
                        const dataSilver = await resSilver.json();

                        const paxGoldInr = dataCG?.['pax-gold']?.inr;
                        const usdInr = dataFx?.rates?.INR;
                        const silverUsd = dataSilver?.price;

                        if (paxGoldInr && usdInr && silverUsd) {
                            fetchedGold24k = +((paxGoldInr / 31.1034768) * GOLD_DOMESTIC_FACTOR).toFixed(2);
                            fetchedSilver = +(((silverUsd * usdInr) / 31.1034768) * SILVER_DOMESTIC_FACTOR).toFixed(2);
                        }
                    }
                } catch (err) {
                    console.warn('CoinGecko fallback failed:', err.message);
                }
            }

            if (fetchedGold24k && fetchedSilver) {
                setRates({
                    gold24k: fetchedGold24k,
                    silver: fetchedSilver
                });
            }
        };

        fetchLiveRates();
        const interval = setInterval(fetchLiveRates, 300000); // Automatically refresh every 5 minutes

        return () => {
            window.removeEventListener('scroll', updateHeader);
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <div className="live-rates-bar" role="region" aria-label="Live precious metal market rates">
                <span className="live-rates-content">
                    <span className="live-pulse">🟢</span> Live Rate (per g) &nbsp;|&nbsp;
                    Silver: <strong>₹{rates.silver.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    &nbsp;|&nbsp; Gold: <strong>₹{rates.gold24k.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </span>
            </div>

            <header className={`luxury-header${shrink ? ' shrink' : ''}`}>
                <div className="header-container">
                    <div className="logo-container">
                        <a href="#/home" className="brand-logo">
                            <img src={imageUrl('assets/images/logo.webp')} alt="TRIMETRA logo" className="site-logo" />
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
