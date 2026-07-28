const imageModules = import.meta.glob('../../assets/**/*', {
    eager: true,
    query: '?url',
    import: 'default'
});

export function imageUrl(path) {
    if (!path) return '';

    const normalized = path.replaceAll('\\', '/');
    const key = `../../${normalized.replace(/^\//, '')}`;

    return imageModules[key] || (normalized.startsWith('/') ? normalized : `/${normalized}`);
}

export function whatsappLink(number, message) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}