import { useState, useEffect } from 'react';
import { imageUrl } from '../utils/assets.js';

export default function ProductCard({ product, featured = false, disableHover = false }) {
    const [isRecentlyViewed, setIsRecentlyViewed] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('trimetra_recently_viewed');
            if (saved) {
                const ids = JSON.parse(saved);
                setIsRecentlyViewed(ids.includes(product.id));
            }
        } catch (e) {
            // Ignore
        }
    }, [product.id]);

    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const images = Array.from(new Set(product.images || []));
    const hasHoverImage = images[1] && !disableHover;

    return (
        <div className="product-card fade-in-section">
            <a href={`#/product/${product.id}`} className="product-card-link-wrapper">
                <div className="product-card-img-wrap">
                    {featured && <div className="product-card-badge">Featured</div>}
                    {isRecentlyViewed && (
                        <div className="product-card-badge recently-viewed-badge">
                            <i className="far fa-clock" /> Recently Viewed
                        </div>
                    )}
                    <img
                        src={imageUrl(images[0])}
                        alt={product.name}
                        className={`product-card-img primary-image ${hasHoverImage ? 'has-hover' : ''}`}
                        loading="lazy"
                        style={{ objectPosition: product.objectPosition || 'center' }}
                    />
                    {hasHoverImage && (
                        <img
                            src={imageUrl(images[1])}
                            alt={`${product.name} alternate view`}
                            className="product-card-img hover-image"
                            loading="lazy"
                            style={{ objectPosition: product.objectPosition || 'center' }}
                        />
                    )}
                    
                    {/* Wishlist Heart Icon */}
                    <button 
                        className={`product-card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                        onClick={handleWishlistClick}
                        aria-label="Add to wishlist"
                    >
                        <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`} />
                    </button>
                </div>
                <div className="product-card-info">
                    <h3 className="product-card-title">{product.name}</h3>
                </div>
            </a>
        </div>
    );
}
