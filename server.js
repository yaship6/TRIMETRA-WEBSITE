import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const DATA_FILE = path.join(process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data'), 'products.json');
const ORIGINAL_DATA_FILE = path.join(process.cwd(), 'data/products.json');

// Helper to read DB
const readProductsDB = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
        if (fs.existsSync(ORIGINAL_DATA_FILE)) {
            const data = fs.readFileSync(ORIGINAL_DATA_FILE, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    } catch (err) {
        console.error('Error reading products DB:', err);
        return [];
    }
};

// Helper to write DB
const writeProductsDB = (products) => {
    try {
        const targetPath = process.env.VERCEL ? '/tmp/data/products.json' : DATA_FILE;
        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.writeFileSync(targetPath, JSON.stringify(products, null, 2), 'utf-8');
        return true;
    } catch (err) {
        console.error('Error writing to products DB:', err);
        return false;
    }
};

// GET /api/products
app.get('/api/products', (req, res) => {
    const products = readProductsDB();
    res.json(products);
});

// POST /api/products
app.post('/api/products', (req, res) => {
    const productData = req.body;
    if (!productData || !productData.id || !productData.name) {
        return res.status(400).json({ error: 'Product ID and Title are required.' });
    }

    const products = readProductsDB();
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

    if (writeProductsDB(products)) {
        res.json({ success: true, message: 'Saved successfully', product: productData });
    } else {
        res.status(500).json({ error: 'Failed to write data' });
    }
});

// PUT /api/products/:id/toggle-visibility
app.put('/api/products/:id/toggle-visibility', (req, res) => {
    const { id } = req.params;
    const products = readProductsDB();
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    product.hidden = !product.hidden;

    if (writeProductsDB(products)) {
        res.json({ success: true, hidden: product.hidden });
    } else {
        res.status(500).json({ error: 'Failed to update' });
    }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    let products = readProductsDB();
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length === initialLength) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (writeProductsDB(products)) {
        res.json({ success: true, message: 'Product deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

export default app;

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`⚡ Trimetra Backend Server running on http://localhost:${PORT}`);
    });
}
