import { useEffect, useMemo, useState } from 'react';
import { imageUrl } from '../utils/assets.js';
import ProductCard from '../components/ProductCard.jsx';

export default function Collections({ products, content, initialFilter }) {
    const [currentFilter, setCurrentFilter] = useState(initialFilter || 'all');

    useEffect(() => {
        setCurrentFilter(initialFilter || 'all');
    }, [initialFilter]);

    const meta = content.collectionMetadata[currentFilter] || content.collectionMetadata.all;

    const filteredProducts = useMemo(() => {
        if (!currentFilter || currentFilter === 'all') return products;
        return products.filter((product) => {
            if (currentFilter === 'everyday-elegance') {
                return (
                    product.everydayElegance ||
                    (Array.isArray(product.collection)
                        ? product.collection.includes('everyday-elegance')
                        : product.collection === 'everyday-elegance') ||
                    product.featured
                );
            }
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

                {filteredProducts.length === 0 ? (
                    <div className="empty-catalog">
                        <i className="far fa-gem" />
                        <h3>No Jewellery pieces found</h3>
                        <p>We are currently updating our collection.</p>
                    </div>
                ) : (
                    <div className="product-catalog-grid">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
