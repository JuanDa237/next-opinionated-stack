const DEFAULT_CALLBACK_URL = '/admin';

export const getSafeCallbackURL = (
    value?: string | null,
    fallback: string = DEFAULT_CALLBACK_URL
) => {
    if (!value) {
        return fallback;
    }

    const trimmed = value.trim();

    if (trimmed.startsWith('/')) {
        return trimmed.startsWith('//') ? fallback : trimmed;
    }

    try {
        const url = new URL(trimmed);
        const path = `${url.pathname}${url.search}`;
        return path.startsWith('/') ? path : fallback;
    } catch {
        return fallback;
    }
};

export function normalizeRoles(role: string | string[], fallback = ['member']) {
    if (Array.isArray(role)) {
        return role;
    }

    if (typeof role === 'string') {
        return role
            .split(',')
            .map(r => r.trim())
            .filter(Boolean);
    }

    return fallback;
}