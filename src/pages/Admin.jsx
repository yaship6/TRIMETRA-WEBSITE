import { useState, useEffect } from 'react';
import { getProducts, addOrUpdateProduct, toggleProductVisibility, deleteProduct } from '../utils/productStore.js';
import { imageUrl } from '../utils/assets.js';

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('trimetra_admin_auth') === 'true';
    });
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState(false);

    const [products, setProducts] = useState(getProducts());
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Toast Notification state
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 4000);
    };

    // Modal state for Add/Edit
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        collection: 'necklaces',
        description: '',
        materials: '',
        images: [''],
        hidden: false,
        featured: false
    });

    useEffect(() => {
        const handleUpdate = () => setProducts(getProducts());
        window.addEventListener('trimetra_products_updated', handleUpdate);
        return () => window.removeEventListener('trimetra_products_updated', handleUpdate);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (pinInput === '1991' || pinInput === '1234' || pinInput === 'admin' || pinInput === 'trimetra') {
            setIsAuthenticated(true);
            sessionStorage.setItem('trimetra_admin_auth', 'true');
            setPinError(false);
        } else {
            setPinError(true);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('trimetra_admin_auth');
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setFormData({
            id: `TRM-${Math.floor(1000 + Math.random() * 9000)}`,
            name: '',
            price: '₹',
            collection: 'necklaces',
            description: '',
            materials: '925 Sterling Silver, Gold Polish',
            images: [''],
            hidden: false,
            featured: false
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (prod) => {
        setEditingProduct(prod);
        setFormData({
            id: prod.id,
            name: prod.name || '',
            price: prod.price || 'Price on Request',
            collection: Array.isArray(prod.collection) ? prod.collection[0] : (prod.collection || 'necklaces'),
            description: prod.description || '',
            materials: Array.isArray(prod.materials) ? prod.materials.join(', ') : (prod.materials || ''),
            images: prod.images && prod.images.length > 0 ? [...prod.images] : [''],
            hidden: !!prod.hidden,
            featured: !!prod.featured
        });
        setShowModal(true);
    };

    const handleImageChange = (index, value) => {
        const updated = [...formData.images];
        updated[index] = value;
        setFormData({ ...formData, images: updated });
    };

    const handleFileUpload = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            handleImageChange(index, reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAddImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const handleRemoveImageField = (index) => {
        const updated = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updated.length ? updated : [''] });
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (!formData.name) return;

        const collectionArray = [formData.collection];
        const materialsArray = formData.materials.split(',').map(m => m.trim()).filter(Boolean);
        const validImages = formData.images.filter(img => img.trim() !== '');

        await addOrUpdateProduct({
            ...formData,
            collection: collectionArray,
            materials: materialsArray,
            images: validImages.length ? validImages : ['assets/images/logo.png']
        });

        setShowModal(false);
        showToast(editingProduct ? `✅ Product "${formData.name}" updated & saved successfully!` : `✨ New product "${formData.name}" added & published successfully!`);
    };

    const handleToggleVisibility = async (prod) => {
        await toggleProductVisibility(prod.id);
        showToast(prod.hidden ? `👁️ "${prod.name}" is now visible on public website!` : `🙈 "${prod.name}" is now hidden from public website.`);
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}" (${id})?`)) {
            await deleteProduct(id);
            showToast(`🗑️ Product "${name}" deleted successfully.`);
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                background: 'radial-gradient(circle at center, #1b0c16 0%, #080306 100%)'
            }}>
                <div style={{
                    background: 'rgba(20, 12, 17, 0.95)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '20px',
                    padding: '44px 36px',
                    maxWidth: '420px',
                    width: '100%',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.1)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        margin: '0 auto 16px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)',
                        border: '1px solid rgba(212,175,55,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                    }}>✨</div>
                    <h2 style={{ fontFamily: 'Cinzel, serif', color: '#D4AF37', marginBottom: '8px', fontSize: '1.75rem', letterSpacing: '1px' }}>
                        Trimetra Store Admin
                    </h2>
                    <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '28px' }}>
                        Enter Security Password to Access Product Management
                    </p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '10px',
                                border: pinError ? '1px solid #ff4d4d' : '1px solid rgba(212,175,55,0.3)',
                                background: '#0e070c',
                                color: '#fff',
                                fontSize: '1.2rem',
                                textAlign: 'center',
                                letterSpacing: '6px',
                                marginBottom: '16px',
                                outline: 'none',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                            }}
                            autoFocus
                        />
                        {pinError && (
                            <p style={{ color: '#ff4d4d', fontSize: '0.82rem', marginBottom: '14px', fontWeight: '500' }}>
                                Invalid Security Password (Default: 1991)
                            </p>
                        )}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                                color: '#000',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                letterSpacing: '1px',
                                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Unlock Product CMS
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const pCols = Array.isArray(p.collection) ? p.collection : [p.collection];
        const matchesCategory = categoryFilter === 'All' || pCols.includes(categoryFilter);

        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ minHeight: '90vh', background: '#080407', color: '#e0e0e0', padding: '160px 20px 80px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                {/* Floating Success Toast Banner */}
                {toastMessage && (
                    <div style={{
                        position: 'fixed',
                        top: '100px',
                        right: '24px',
                        zIndex: 9999,
                        background: 'linear-gradient(135deg, rgba(25, 20, 10, 0.95) 0%, rgba(15, 10, 5, 0.98) 100%)',
                        color: '#D4AF37',
                        border: '1px solid #D4AF37',
                        borderRadius: '12px',
                        padding: '14px 22px',
                        fontSize: '0.92rem',
                        fontWeight: '600',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(212,175,55,0.3)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <span>{toastMessage}</span>
                        <button
                            onClick={() => setToastMessage(null)}
                            style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.1rem', marginLeft: '10px' }}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Top Control Header */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(25, 14, 21, 0.9) 0%, rgba(15, 8, 13, 0.9) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '16px',
                    padding: '24px 30px',
                    marginBottom: '30px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h1 style={{ fontFamily: 'Cinzel, serif', color: '#D4AF37', margin: 0, fontSize: '1.9rem', letterSpacing: '0.5px' }}>
                                Product Management Portal
                            </h1>
                            <span style={{
                                background: 'rgba(212,175,55,0.15)',
                                color: '#D4AF37',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.78rem',
                                border: '1px solid rgba(212,175,55,0.3)',
                                fontWeight: '600'
                            }}>
                                Total: {products.length} Products
                            </span>
                        </div>
                        <p style={{ color: '#aaa', margin: '6px 0 0 0', fontSize: '0.88rem' }}>
                            Add new products, replace images, edit pricing, and toggle display visibility live on backend server.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleOpenAddModal}
                            style={{
                                background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                                color: '#000',
                                border: 'none',
                                padding: '12px 22px',
                                borderRadius: '10px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.92rem',
                                boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>+</span> Add New Product
                        </button>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'rgba(255, 77, 77, 0.1)',
                                color: '#ff4d4d',
                                border: '1px solid rgba(255, 77, 77, 0.3)',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '0.88rem'
                            }}
                        >
                            Lock CMS
                        </button>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', justifyContent: 'space-between' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
                        <input
                            type="text"
                            placeholder="🔍 Search product title, ID, or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 18px',
                                borderRadius: '10px',
                                border: '1px solid #33202b',
                                background: '#120910',
                                color: '#fff',
                                fontSize: '0.92rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{
                                padding: '12px 20px',
                                borderRadius: '10px',
                                border: '1px solid #33202b',
                                background: '#120910',
                                color: '#D4AF37',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        >
                            <option value="All">All Categories ({products.length})</option>
                            <option value="coins">🪙 Gold & Silver Coins</option>
                            <option value="necklaces">Necklaces</option>
                            <option value="earrings">Earrings</option>
                            <option value="rings">Rings</option>
                            <option value="bracelets">Bracelets & Bangles</option>
                            <option value="sets">Bridal Sets</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid / Cards UI */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '24px'
                }}>
                    {filteredProducts.map(prod => {
                        const mainImg = prod.images && prod.images[0] ? imageUrl(prod.images[0]) : '';
                        return (
                            <div key={prod.id} style={{
                                background: '#130a10',
                                border: prod.hidden ? '1px dashed #442738' : '1px solid #2d1825',
                                borderRadius: '14px',
                                padding: '18px',
                                opacity: prod.hidden ? 0.65 : 1,
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative'
                            }}>
                                <div>
                                    {/* Image & Badge Header */}
                                    <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px', background: '#0a0508' }}>
                                        <img
                                            src={mainImg}
                                            alt={prod.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            background: 'rgba(0,0,0,0.75)',
                                            color: '#D4AF37',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            border: '1px solid rgba(212,175,55,0.3)',
                                            backdropFilter: 'blur(4px)'
                                        }}>
                                            {prod.id}
                                        </div>
                                        <button
                                            onClick={() => handleToggleVisibility(prod)}
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                padding: '5px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                border: 'none',
                                                cursor: 'pointer',
                                                background: prod.hidden ? 'rgba(255, 77, 77, 0.9)' : 'rgba(76, 175, 80, 0.9)',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                                            }}
                                        >
                                            {prod.hidden ? '🙈 Hidden' : '👁️ Visible'}
                                        </button>
                                    </div>

                                    {/* Product Details */}
                                    <h3 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '1.1rem', fontFamily: 'Cinzel, serif' }}>
                                        {prod.name}
                                    </h3>
                                    <div style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '10px' }}>
                                        {prod.price || 'Price on Request'}
                                    </div>
                                    <p style={{ color: '#aaa', fontSize: '0.82rem', lineHeight: '1.4', margin: '0 0 14px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {prod.description || 'No description provided.'}
                                    </p>
                                </div>

                                {/* Footer Actions */}
                                <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid #23121d' }}>
                                    <a
                                        href={`#/product/${prod.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            flex: 1,
                                            textAlign: 'center',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            background: '#1c0f18',
                                            color: '#aaa',
                                            textDecoration: 'none',
                                            fontSize: '0.82rem',
                                            border: '1px solid #331b2c'
                                        }}
                                    >
                                        View Page ↗
                                    </a>
                                    <button
                                        onClick={() => handleOpenEditModal(prod)}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: '8px',
                                            background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                                            color: '#000',
                                            border: 'none',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            fontSize: '0.82rem'
                                        }}
                                    >
                                        Edit Details
                                    </button>
                                    <button
                                        onClick={() => handleDelete(prod.id, prod.name)}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            background: 'rgba(255, 77, 77, 0.15)',
                                            color: '#ff4d4d',
                                            border: '1px solid rgba(255, 77, 77, 0.3)',
                                            cursor: 'pointer',
                                            fontSize: '0.82rem'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Modal: Add or Edit Product */}
            {showModal && (
                <div
                    onWheel={(e) => e.stopPropagation()}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        padding: '30px 20px',
                        backdropFilter: 'blur(6px)',
                        overflowY: 'auto'
                    }}
                >
                    <div style={{
                        background: '#160d13',
                        border: '1px solid #D4AF37',
                        borderRadius: '16px',
                        maxWidth: '650px',
                        width: '100%',
                        maxHeight: '82vh',
                        overflowY: 'auto',
                        padding: '34px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
                        position: 'relative',
                        WebkitOverflowScrolling: 'touch'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontFamily: 'Cinzel, serif', color: '#D4AF37', margin: 0, fontSize: '1.4rem' }}>
                                {editingProduct ? `Edit Product (${editingProduct.id})` : '✨ Add New Product to Catalog'}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                        </div>

                        <form onSubmit={handleSubmitForm}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>Product Title *</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. The Royal Kundan Haar"
                                        style={{ width: '100%', padding: '12px', background: '#0a0608', border: '1px solid #33202b', color: '#fff', borderRadius: '8px', fontSize: '0.9rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>Display Price</label>
                                    <input
                                        type="text"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="e.g. ₹1,45,000 or Price on Request"
                                        style={{ width: '100%', padding: '12px', background: '#0a0608', border: '1px solid #33202b', color: '#fff', borderRadius: '8px', fontSize: '0.9rem' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>Category Collection</label>
                                    <select
                                        value={formData.collection}
                                        onChange={e => setFormData({ ...formData, collection: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: '#0a0608', border: '1px solid #33202b', color: '#D4AF37', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}
                                    >
                                        <option value="coins">🪙 Gold & Silver Coins</option>
                                        <option value="necklaces">Necklaces</option>
                                        <option value="earrings">Earrings</option>
                                        <option value="rings">Rings</option>
                                        <option value="bracelets">Bracelets & Bangles</option>
                                        <option value="sets">Bridal Sets</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>Product Code / ID</label>
                                    <input
                                        type="text" required
                                        value={formData.id}
                                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                                        style={{ width: '100%', padding: '12px', background: '#0a0608', border: '1px solid #33202b', color: '#fff', borderRadius: '8px', fontSize: '0.9rem' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>Materials & Craftsmanship (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.materials}
                                    onChange={e => setFormData({ ...formData, materials: e.target.value })}
                                    placeholder="925 Sterling Silver, Gold Polish, Moissanite Polki"
                                    style={{ width: '100%', padding: '12px', background: '#0a0608', border: '1px solid #33202b', color: '#fff', borderRadius: '8px', fontSize: '0.9rem' }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', color: '#aaa', fontSize: '0.82rem', marginBottom: '6px' }}>Product Description</label>
                                <textarea
                                    rows="4"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Write product story, details, and specifications..."
                                    style={{ width: '100%', padding: '12px', background: '#0a0608', border: '1px solid #33202b', color: '#fff', borderRadius: '8px', fontSize: '0.9rem', lineHeight: '1.4' }}
                                />
                            </div>

                            {/* Image Upload Manager */}
                            <div style={{ marginBottom: '24px', background: '#0e070c', padding: '18px', borderRadius: '10px', border: '1px solid #2a1723' }}>
                                <label style={{ display: 'block', color: '#D4AF37', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '12px' }}>
                                    🖼️ Upload Product Photo (File Upload or Image URL)
                                </label>
                                {formData.images.map((imgSrc, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            placeholder="Paste Image URL or select file →"
                                            value={imgSrc}
                                            onChange={e => handleImageChange(idx, e.target.value)}
                                            style={{ flex: 1, padding: '10px 14px', background: '#160d13', border: '1px solid #33202b', color: '#fff', borderRadius: '8px', fontSize: '0.85rem' }}
                                        />
                                        <label style={{
                                            padding: '10px 16px',
                                            background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.1) 100%)',
                                            color: '#D4AF37',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            border: '1px solid rgba(212,175,55,0.4)',
                                            fontWeight: '600'
                                        }}>
                                            📁 Choose File
                                            <input type="file" accept="image/*" onChange={e => handleFileUpload(idx, e)} style={{ display: 'none' }} />
                                        </label>
                                        {formData.images.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImageField(idx)}
                                                style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddImageField}
                                    style={{ background: 'none', border: '1px dashed #D4AF37', color: '#D4AF37', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '500' }}
                                >
                                    + Add Another Image Field
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.hidden}
                                        onChange={e => setFormData({ ...formData, hidden: e.target.checked })}
                                        style={{ width: '18px', height: '18px', accentColor: '#D4AF37' }}
                                    />
                                    Hide Product from Public Website Viewers
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ background: '#261520', color: '#aaa', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                                <button type="submit" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', color: '#000', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>Save Product Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
