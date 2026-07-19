import { useEffect, useMemo, useState } from 'react';
import { imageUrl } from '../utils/assets.js';

function ProductPortrait({ product }) {
    const [isRecentlyViewed, setIsRecentlyViewed] = useState(false);
    const materials = product.materials.slice(0, 2).join(' / ');

    useEffect(() => {
        try {
            const saved = localStorage.getItem('trimetra_recently_viewed');
            const ids = saved ? JSON.parse(saved) : [];
            setIsRecentlyViewed(ids.includes(product.id));
        } catch (e) {
            setIsRecentlyViewed(false);
        }
    }, [product.id]);

    return (
        <a href={`#/product/${product.id}`} className="collection-product-portrait">
            <figure className="collection-product-frame">
                {isRecentlyViewed && (
                    <span className="collection-recently-viewed-tag">
                        <i className="far fa-clock" /> Recently Viewed
                    </span>
                )}
                <img
                    src={imageUrl(product.images[0])}
                    alt={product.name}
                    loading="lazy"
                    style={{ objectPosition: product.objectPosition || 'center' }}
                />
            </figure>
            <div className="collection-product-caption">
                <h3>{product.name}</h3>
                <strong>
                    View Piece <i className="fas fa-arrow-right" />
                </strong>
            </div>
        </a>
    );
}

export default function Collections({ products, content, initialFilter }) {
    const [currentFilter, setCurrentFilter] = useState(initialFilter || 'all');

    useEffect(() => {
        setCurrentFilter(initialFilter || 'all');
    }, [initialFilter]);

    const meta = content.collectionMetadata[currentFilter] || content.collectionMetadata.all;

    const filteredProducts = useMemo(() => {
        if (currentFilter === 'all') return products;
        return products.filter((product) => {
            if (Array.isArray(product.collection)) {
                return product.collection.includes(currentFilter);
            }
            return product.collection === currentFilter;
        });
    }, [currentFilter, products]);

    return (
        <div className="collections-page-global-wrapper">
            <div className="collections-page-wrapper fade-in-section">
                <div
                    className="collection-hero-banner"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, rgba(55, 2, 30, 0.8) 60%, rgba(10, 0, 5, 0.95) 100%), url('${imageUrl(meta.image)}')`,
                        backgroundPosition: meta.backgroundPosition || 'center'
                    }}
                >
                    <div className="collection-banner-content fade-in-text">
                        <h1 className="collection-banner-title" style={{ margin: 0 }}>{meta.title}</h1>
                    </div>
                </div>



                <div className="collection-product-display reveal-on-scroll">
                    {filteredProducts.length === 0 ? (
                        <div className="empty-catalog">
                            <i className="far fa-gem" />
                            <h3>No jewelry pieces found</h3>
                            <p>We are currently updating our collection.</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <ProductPortrait key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
