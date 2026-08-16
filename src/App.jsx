import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { initScrollReveal } from './utils/scrollReveal.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx';
import Home from './pages/Home.jsx';
import Collections from './pages/Collections.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import JewelleryCare from './pages/JewelleryCare.jsx';
import Admin from './pages/Admin.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import ComingSoon from './components/ComingSoon.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import { getProducts } from './utils/productStore.js';
import content from '../data/content.json';

function getPage(route, products, addToRecentlyViewed) {
    const { path, query } = route;

    if (path === '/' || path === '/home') {
        return <Home products={products} content={content} />;
    }

    if (path === '/admin') {
        return <Admin />;
    }

    if (path === '/collections') {
        return <Collections products={products} content={content} initialFilter={query.filter || 'all'} />;
    }

    if (path.startsWith('/product/')) {
        return (
            <ProductDetails
                products={products}
                content={content}
                productId={path.replace('/product/', '')}
                addToRecentlyViewed={addToRecentlyViewed}
            />
        );
    }

    if (path === '/about') {
        return <About content={content} />;
    }

    if (path === '/contact') {
        return <Contact contact={content.contact} />;
    }

    if (path === '/jewellery-care') {
        return <JewelleryCare />;
    }

    return <ErrorPage message="We couldn't find the page you are looking for. Navigate back to Trimetra." />;
}

export default function App() {
    const route = useHashRoute();
    const lenisRef = useRef(null);

    const [products, setProducts] = useState(getProducts());

    useEffect(() => {
        const handleProductsUpdate = () => setProducts(getProducts());
        window.addEventListener('trimetra_products_updated', handleProductsUpdate);
        return () => window.removeEventListener('trimetra_products_updated', handleProductsUpdate);
    }, []);

    const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
        try {
            const saved = localStorage.getItem('trimetra_recently_viewed');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });


    const addToRecentlyViewed = (id) => {
        setRecentlyViewedIds((prev) => {
            const filtered = prev.filter((item) => item !== id);
            const updated = [id, ...filtered].slice(0, 8); // Keep up to 8 products
            localStorage.setItem('trimetra_recently_viewed', JSON.stringify(updated));
            return updated;
        });
    };

    const clearRecentlyViewed = () => {
        setRecentlyViewedIds([]);
        localStorage.removeItem('trimetra_recently_viewed');
    };

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: true,
            syncTouch: true,
            touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [route.path]);

    // Re-init scroll reveal on every route change
    useEffect(() => {
        const timer = setTimeout(() => {
            initScrollReveal();
        }, 100); // Small delay to ensure DOM is rendered
        return () => clearTimeout(timer);
    }, [route.path]);

    return (
        <>
            <Header currentPath={route.path} />
            <main id="app-root">{getPage(route, products, addToRecentlyViewed)}</main>
            <FloatingWhatsApp contact={content.contact} />
            <Footer content={content} />
        </>
    );
}
