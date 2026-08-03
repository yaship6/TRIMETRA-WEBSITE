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

    const images = Array.from(new Set(product.images || []));
    const hasHoverImage = images[1] && !disableHover;
    const isCoin = Array.isArray(product.collection)
        ? product.collection.includes('coins')
        : product.collection === 'coins' || (product.id && product.id.includes('COIN'));

    return (
        <div className={`product-card fade-in-section ${isCoin ? 'coin-card' : ''}`}>
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
                </div>
                <div className="product-card-info">
                    <h3 className="product-card-title">{product.name}</h3>
                    <span className="product-card-view-btn">
                        VIEW PIECE <i className="fas fa-arrow-right" />
                    </span>
                </div>
            </a>
        </div>
    );
}
