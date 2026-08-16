import initialProducts from '../../data/products.json';

// High-Speed Reliable Cloud Store Engine (kvdb.io / MyJSON free public storage)
const STORAGE_KEY = 'trimetra_custom_products_store';
const KVDB_BUCKET_URL = 'https://kvdb.io/4y9y2w4x8J889WzZ/trimetra_products';

let cachedProducts = (() => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}
    return Array.isArray(initialProducts) ? initialProducts : [];
})();

let isSyncing = false;

export function getProducts() {
    return cachedProducts;
}

export async function syncProductsFromDatabase() {
    if (isSyncing) return cachedProducts;
    isSyncing = true;

    try {
        const response = await fetch(KVDB_BUCKET_URL);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                cachedProducts = data;
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                } catch (e) {}
                window.dispatchEvent(new Event('trimetra_products_updated'));
                return data;
            }
        }
    } catch (err) {
        // Fallback to local storage
    } finally {
        isSyncing = false;
    }

    return cachedProducts;
}

// Auto sync every 3 seconds across all devices globally
if (typeof window !== 'undefined') {
    syncProductsFromDatabase();
    setInterval(syncProductsFromDatabase, 3000);
}

// Helper to push to cloud DB
async function pushToCloudStorage(products) {
    try {
        await fetch(KVDB_BUCKET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(products)
        });
    } catch (e) {
        console.error('Cloud DB Sync push error:', e);
    }
}

export async function addOrUpdateProduct(productData) {
    const existingIdx = cachedProducts.findIndex(p => p.id === productData.id);
    if (existingIdx >= 0) {
        cachedProducts[existingIdx] = { ...cachedProducts[existingIdx], ...productData };
    } else {
        cachedProducts.unshift(productData);
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedProducts));
    } catch (e) {}

    window.dispatchEvent(new Event('trimetra_products_updated'));
    await pushToCloudStorage(cachedProducts);
    return true;
}

export async function toggleProductVisibility(productId) {
    const product = cachedProducts.find(p => p.id === productId);
    if (product) {
        product.hidden = !product.hidden;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedProducts));
        } catch (e) {}
        window.dispatchEvent(new Event('trimetra_products_updated'));
        await pushToCloudStorage(cachedProducts);
    }
    return true;
}

export async function deleteProduct(productId) {
    cachedProducts = cachedProducts.filter(p => p.id !== productId);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedProducts));
    } catch (e) {}
    window.dispatchEvent(new Event('trimetra_products_updated'));
    await pushToCloudStorage(cachedProducts);
    return true;
}
