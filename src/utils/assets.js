const imageModules = import.meta.glob('../../assets/images/*', {
    eager: true,
    query: '?url',
    import: 'default'
});

export function imageUrl(path) {
    if (!path) return '';

    const normalized = path.replaceAll('\\', '/');
    const key = `../../${normalized}`;

    return imageModules[key] || `/${normalized}`;
}

export function whatsappLink(number, message) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}