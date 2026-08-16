import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Redis } from '@upstash/redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Connect to Upstash Redis if Env vars exist
let redis = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN
    });
} else if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    });
}

const ORIGINAL_DATA_FILE = path.join(process.cwd(), 'data/products.json');

// Helper to read initial JSON file
const getInitialProducts = () => {
    try {
        if (fs.existsSync(ORIGINAL_DATA_FILE)) {
            const data = fs.readFileSync(ORIGINAL_DATA_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Error reading initial products file:', e);
    }
    return [];
};

// Helper to read DB from Redis or Fallback File
const readProductsDB = async () => {
    if (redis) {
        try {
            const data = await redis.get('trimetra_products_db');
            if (data) {
                return typeof data === 'string' ? JSON.parse(data) : data;
            }
            // Seed Redis with initial products file if first run
            const initial = getInitialProducts();
            await redis.set('trimetra_products_db', JSON.stringify(initial));
            return initial;
        } catch (e) {
            console.error('Upstash Redis read error:', e);
        }
    }
    return getInitialProducts();
};

// Helper to write DB to Redis or local memory
const writeProductsDB = async (products) => {
    if (redis) {
        try {
            await redis.set('trimetra_products_db', JSON.stringify(products));
            return true;
        } catch (e) {
            console.error('Upstash Redis write error:', e);
            return false;
        }
    }
    return true;
};

// GET /api/products
app.get('/api/products', async (req, res) => {
    const products = await readProductsDB();
    res.json(products);
});

// POST /api/products
app.post('/api/products', async (req, res) => {
    const productData = req.body;
    if (!productData || !productData.id || !productData.name) {
        return res.status(400).json({ error: 'Product ID and Title are required.' });
    }

    const products = await readProductsDB();
    const existingIdx = products.findIndex(p => p.id === productData.id);

    if (existingIdx >= 0) {
        products[existingIdx] = {
            ...products[existingIdx],
            ...productData
        };
    } else {
        const newProduct = {
            id: productData.id,
            hidden: false,
            featured: false,
            collection: ['necklaces'],
            materials: ['925 Sterling Silver', 'Gold Polish'],
            images: [],
            ...productData
        };
        products.unshift(newProduct);
    }

    if (await writeProductsDB(products)) {
        res.json({ success: true, message: 'Saved successfully', product: productData });
    } else {
        res.status(500).json({ error: 'Failed to write data' });
    }
});

// PUT /api/products/:id/toggle-visibility
app.put('/api/products/:id/toggle-visibility', async (req, res) => {
    const { id } = req.params;
    const products = await readProductsDB();
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    product.hidden = !product.hidden;

    if (await writeProductsDB(products)) {
        res.json({ success: true, hidden: product.hidden });
    } else {
        res.status(500).json({ error: 'Failed to update' });
    }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    let products = await readProductsDB();
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length === initialLength) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (await writeProductsDB(products)) {
        res.json({ success: true, message: 'Product deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

export default app;

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`⚡ Trimetra Serverless Backend running on http://localhost:${PORT}`);
    });
}
