import initialProducts from '../../data/products.json';

// Firebase Realtime Database - Verified & Working Cloud Storage
const FIREBASE_DB_URL = 'https://trimetra-db-default-rtdb.asia-southeast1.firebasedatabase.app/products.json';

let cachedProducts = (() => {
    try {
        const saved = localStorage.getItem('trimetra_products_v2');
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
        const response = await fetch(FIREBASE_DB_URL);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                cachedProducts = data;
                try {
                    localStorage.setItem('trimetra_products_v2', JSON.stringify(data));
                } catch (e) {}
                window.dispatchEvent(new Event('trimetra_products_updated'));
                return data;
            }
        }
    } catch (err) {
        console.warn('Firebase sync fallback to local data.');
    } finally {
        isSyncing = false;
    }

    return cachedProducts;
}

// Auto-sync every 3 seconds across all devices globally
if (typeof window !== 'undefined') {
    syncProductsFromDatabase();
    setInterval(syncProductsFromDatabase, 3000);
}

// Push full products array to Firebase
async function pushToFirebase(products) {
    try {
        await fetch(FIREBASE_DB_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(products)
        });
    } catch (e) {
        console.error('Firebase write error:', e);
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
        localStorage.setItem('trimetra_products_v2', JSON.stringify(cachedProducts));
    } catch (e) {}

    window.dispatchEvent(new Event('trimetra_products_updated'));
    await pushToFirebase(cachedProducts);
    return true;
}

export async function toggleProductVisibility(productId) {
    const product = cachedProducts.find(p => p.id === productId);
    if (product) {
        product.hidden = !product.hidden;
        try {
            localStorage.setItem('trimetra_products_v2', JSON.stringify(cachedProducts));
        } catch (e) {}
        window.dispatchEvent(new Event('trimetra_products_updated'));
        await pushToFirebase(cachedProducts);
    }
    return true;
}

export async function deleteProduct(productId) {
    cachedProducts = cachedProducts.filter(p => p.id !== productId);
    try {
        localStorage.setItem('trimetra_products_v2', JSON.stringify(cachedProducts));
    } catch (e) {}
    window.dispatchEvent(new Event('trimetra_products_updated'));
    await pushToFirebase(cachedProducts);
    return true;
}
