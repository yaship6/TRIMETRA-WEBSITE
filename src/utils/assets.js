export function imageUrl(path) {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const normalized = path.replaceAll('\\', '/');
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

export function whatsappLink(number, message) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}