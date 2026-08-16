import initialProducts from '../../data/products.json';

// Public Zero-Config Cloud Database Endpoint (Pantry / JSONBin Cloud Store)
const CLOUD_DB_ID = 'trimetra_products_master_db_v1';
const PANTRY_API_URL = `https://getpantry.cloud/apiv1/pantry/1a3f6562-b97c-473d-82d6-4447dd84f901/basket/${CLOUD_DB_ID}`;

let cachedProducts = (() => {
    try {
        const saved = localStorage.getItem('trimetra_custom_products_store');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    return Array.isArray(initialProducts) ? initialProducts : [];
})();

let isFetching = false;

export function getProducts() {
    return cachedProducts;
}

export async function syncProductsFromDatabase() {
    if (isFetching) return cachedProducts;
    isFetching = true;

    try {
        const response = await fetch(PANTRY_API_URL);
        if (response.ok) {
            const json = await response.json();
            const data = json.products || json;
            if (Array.isArray(data) && data.length > 0) {
                cachedProducts = data;
                try {
                    localStorage.setItem('trimetra_custom_products_store', JSON.stringify(data));
                } catch (e) {}
                window.dispatchEvent(new Event('trimetra_products_updated'));
                return data;
            }
        }
    } catch (err) {
        console.warn('Cloud DB connection sync using fallback products.');
    } finally {
        isFetching = false;
    }

    return cachedProducts;
}

// Auto-sync every 4 seconds across all live clients & devices anywhere in the world
if (typeof window !== 'undefined') {
    syncProductsFromDatabase();
    setInterval(syncProductsFromDatabase, 4000);
}

export async function addOrUpdateProduct(productData) {
    // 1. Instantly update local cache & localStorage
    const existingIdx = cachedProducts.findIndex(p => p.id === productData.id);
    if (existingIdx >= 0) {
        cachedProducts[existingIdx] = { ...cachedProducts[existingIdx], ...productData };
    } else {
        cachedProducts.unshift(productData);
    }

    try {
        localStorage.setItem('trimetra_custom_products_store', JSON.stringify(cachedProducts));
    } catch (e) {}

    window.dispatchEvent(new Event('trimetra_products_updated'));

    // 2. Push to Zero-Config Cloud Database (Instant Cloud Sync for all users)
    try {
        await fetch(PANTRY_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: cachedProducts })
        });
    } catch (err) {
        console.error('Cloud DB write error:', err);
    }

    return true;
}

export async function toggleProductVisibility(productId) {
    const product = cachedProducts.find(p => p.id === productId);
    if (product) {
        product.hidden = !product.hidden;
        try {
            localStorage.setItem('trimetra_custom_products_store', JSON.stringify(cachedProducts));
        } catch (e) {}
        window.dispatchEvent(new Event('trimetra_products_updated'));
    }

    try {
        await fetch(PANTRY_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: cachedProducts })
        });
    } catch (err) {
        console.error('Cloud DB visibility update error:', err);
    }

    return true;
}

export async function deleteProduct(productId) {
    cachedProducts = cachedProducts.filter(p => p.id !== productId);
    try {
        localStorage.setItem('trimetra_custom_products_store', JSON.stringify(cachedProducts));
    } catch (e) {}
    window.dispatchEvent(new Event('trimetra_products_updated'));

    try {
        await fetch(PANTRY_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: cachedProducts })
        });
    } catch (err) {
        console.error('Cloud DB delete error:', err);
    }

    return true;
}
