export function imageUrl(path) {
    if (!path) return '';

    const normalized = path.replaceAll('\\', '/');
    return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

export function whatsappLink(number, message) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}