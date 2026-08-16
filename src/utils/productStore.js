import initialProducts from '../../data/products.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
        ? '/api/products' 
        : 'http://localhost:5001/api/products');

let cachedProducts = Array.isArray(initialProducts) ? initialProducts : [];
let isFetching = false;

export function getProducts() {
    return cachedProducts && cachedProducts.length > 0 ? cachedProducts : initialProducts;
}

export async function syncProductsFromDatabase() {
    try {
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                cachedProducts = data;
                window.dispatchEvent(new Event('trimetra_products_updated'));
                return data;
            }
        }
    } catch (err) {
        console.warn('Backend server not connected, using fallback products data.');
    }
    return cachedProducts;
}

// Auto sync every 3 seconds for instant real-time updates across all clients
if (typeof window !== 'undefined') {
    syncProductsFromDatabase();
    setInterval(syncProductsFromDatabase, 3000);
}

export async function addOrUpdateProduct(productData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            await syncProductsFromDatabase();
            return true;
        }
    } catch (err) {
        console.error('Failed to post to backend server:', err);
    }
    return false;
}

export async function toggleProductVisibility(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${productId}/toggle-visibility`, {
            method: 'PUT'
        });

        if (response.ok) {
            await syncProductsFromDatabase();
            return true;
        }
    } catch (err) {
        console.error('Failed to update visibility in backend:', err);
    }
    return false;
}

export async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await syncProductsFromDatabase();
            return true;
        }
    } catch (err) {
        console.error('Failed to delete product from backend:', err);
    }
    return false;
}
