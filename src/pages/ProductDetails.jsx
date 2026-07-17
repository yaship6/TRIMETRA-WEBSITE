import { useState, useEffect, useRef } from 'react';
import ErrorPage from './ErrorPage.jsx';
import { imageUrl, whatsappLink } from '../utils/assets.js';
import ProductCard from '../components/ProductCard.jsx';

function AccordionItem({ title, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef(null);

    return (
        <div className={`pd-accordion-item ${isOpen ? 'open' : ''}`}>
            <button className="pd-accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <span className="pd-accordion-icon">{isOpen ? '−' : '+'}</span>
            </button>
            <div
                className="pd-accordion-body"
                ref={contentRef}
                style={{ maxHeight: isOpen ? (contentRef.current?.scrollHeight || 500) + 'px' : '0px' }}
            >
                <div className="pd-accordion-content">{children}</div>
            </div>
        </div>
    );
}

export default function ProductDetails({ products, content, productId, addToRecentlyViewed }) {
    const product = products.find((item) => item.id === productId);
    const recommendedProducts = products
        .filter((item) => item.collection === product?.collection && item.id !== product?.id)
        .slice(0, 3);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const touchStartX = useRef(null);
    const lightboxTouchStartX = useRef(null);

    useEffect(() => {
        if (product && addToRecentlyViewed) {
            addToRecentlyViewed(product.id);
        }
    }, [product, addToRecentlyViewed]);

    useEffect(() => {
        if (!isLightboxOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsLightboxOpen(false);
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, product]);

    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isLightboxOpen]);

    if (!product) {
        return <ErrorPage message="Product details could not be found. Check if the code is correct." />;
    }

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                setSelectedImage((prev) => (prev + 1) % product.images.length);
            } else {
                setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
            }
        }
        touchStartX.current = null;
    };

    const handleLightboxTouchStart = (e) => {
        lightboxTouchStartX.current = e.touches[0].clientX;
    };

    const handleLightboxTouchEnd = (e) => {
        if (lightboxTouchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = lightboxTouchStartX.current - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
        lightboxTouchStartX.current = null;
    };

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const message = `Hi Trimetra, I'm interested in the "${product.name}".\n\n`
        + `Reference: ${product.id}\n`
        + `Composition: ${product.materials.join(', ')}\n\n`
        + 'Please advise on its availability and how I may purchase this piece. Thank you!';

    return (
        <div className="product-details-page-wrapper">
            <div className="product-details-container fade-in-section">
                <a href={`#/collections?filter=${product.collection}`} className="back-link">
                    <i className="fas fa-arrow-left" /> Back to {product.collection}
                </a>

                <div className="product-details-grid">
                    <div className="product-gallery">
                        <div
                            className="main-image-viewport"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        className="carousel-arrow prev-arrow"
                                        onClick={prevImage}
                                        aria-label="Previous image"
                                    >
                                        <i className="fas fa-chevron-left" />
                                    </button>
                                    <button
                                        type="button"
                                        className="carousel-arrow next-arrow"
                                        onClick={nextImage}
                                        aria-label="Next image"
                                    >
                                        <i className="fas fa-chevron-right" />
                                    </button>
                                </>
                            )}
                            <img
                                src={imageUrl(product.images[selectedImage])}
                                alt={product.name}
                                id="main-product-image"
                                className="zoomable-image"
                                style={{ objectPosition: product.objectPosition || 'center' }}
                                onClick={() => setIsLightboxOpen(true)}
                            />
                            {product.images.length > 1 && (
                                <div className="carousel-indicators">
                                    {product.images.map((_, index) => (
                                        <span
                                            key={index}
                                            className={`indicator-dot${selectedImage === index ? ' active' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="gallery-thumbnails">
                            {product.images.map((img, index) => (
                                <button
                                    type="button"
                                    className={`gallery-thumbnail${selectedImage === index ? ' active' : ''}`}
                                    key={img}
                                    onClick={() => setSelectedImage(index)}
                                    aria-label={`Show ${product.name} image ${index + 1}`}
                                >
                                    <img src={imageUrl(img)} alt={`${product.name} detail view ${index + 1}`} loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="product-info-panel">
                        <div className="product-meta-header">
                            <span className="product-detail-collection">{product.collection}</span>
                            <h1 className="product-detail-title">{product.name}</h1>
                            <span className="product-detail-id">REF: {product.id}</span>

                            <div className="product-spec-pointers">
                                <span className="spec-pointer-tag">✦ 925 Sterling Silver</span>
                                <span className="spec-pointer-tag">✦ Stone : </span>
                                <span className="spec-pointer-tag">✦ Polish </span>
                            </div>
                        </div>

                        <div className="product-accordions">
                            <AccordionItem title="Description" defaultOpen>
                                <p>{product.description}</p>
                            </AccordionItem>
                            <AccordionItem title="Jewellery Care">
                                <p>To preserve the brilliant finish of your rhodium-plated silver jewellery, avoid contact with water, perfumes, lotions, and harsh chemicals. We recommend storing each piece individually in a cool, dry place, preferably in a zip-lock pouch or the provided luxury box.</p>
                            </AccordionItem>
                        </div>

                        <div className="product-actions">
                            <a href={whatsappLink(content.contact.whatsapp.number, message)} target="_blank" rel="noopener noreferrer" className="whatsapp-enquiry-btn">
                                <i className="fab fa-whatsapp" /> Enquire on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {recommendedProducts.length > 0 && (
                <section className="recommendations-section fade-in-section">
                    <h2 className="recommendations-section-title">You May Also Like</h2>
                    <div className="recommendations-grid">
                        {recommendedProducts.map((recProduct) => (
                            <ProductCard key={recProduct.id} product={recProduct} />
                        ))}
                    </div>
                </section>
            )}
            {isLightboxOpen && (
                <div
                    className="product-lightbox"
                    onClick={(e) => {
                        if (e.target.classList.contains('product-lightbox') || e.target.classList.contains('lightbox-close-btn') || e.target.classList.contains('lightbox-content-wrapper')) {
                            setIsLightboxOpen(false);
                        }
                    }}
                >
                    <button
                        type="button"
                        className="lightbox-close-btn"
                        onClick={() => setIsLightboxOpen(false)}
                        aria-label="Close fullscreen view"
                    >
                        &times;
                    </button>
                    {product.images.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="lightbox-arrow prev-arrow"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                aria-label="Previous image"
                            >
                                <i className="fas fa-chevron-left" />
                            </button>
                            <button
                                type="button"
                                className="lightbox-arrow next-arrow"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                aria-label="Next image"
                            >
                                <i className="fas fa-chevron-right" />
                            </button>
                        </>
                    )}
                    <div 
                        className="lightbox-content-wrapper"
                        onTouchStart={handleLightboxTouchStart}
                        onTouchEnd={handleLightboxTouchEnd}
                    >
                        <img
                            src={imageUrl(product.images[selectedImage])}
                            alt={product.name}
                            className="lightbox-image"
                            style={{ objectPosition: product.objectPosition || 'center' }}
                        />
                        {product.images.length > 1 && (
                            <div className="lightbox-counter">
                                {selectedImage + 1} / {product.images.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
