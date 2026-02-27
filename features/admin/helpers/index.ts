export const AUTH_ROUTES = {
    DASHBOARD: '/admin',
    SIGNIN: '/signin',
    SIGNUP: '/signup',
    SELECT_ORGANIZATION: '/select-organization',
    FORBIDDEN: '/forbidden',
    FORGOT_PASSWORD: '/forgot-password',
    EMAIL_VERIFICATION: '/email-verification',
};

export const HEADER_KEYS = {
    PROTOCOL: 'x-protocol',
    HOSTNAME: 'x-hostname',
    PORT: 'x-port',
    SUBDOMAIN: 'x-subdomain',
    MAIN_DOMAIN: 'x-main-domain',
    PATHNAME: 'x-pathname',
    SEARCH: 'x-search',
    HASH: 'x-hash'
};

/**
 * Extracts URL parts from headers set by the proxy middleware.
 *
 * Example:
 *   For the URL:
 *     https://tenant1.local.dev:3000/admin/signin?callbackUrl=/example#testanchor
 *
 *   The returned object will be:
 *   {
 *     protocol:   'https:',
 *     hostname:   'tenant1.local.dev',
 *     port:       '3000',
 *     subdomain:  'tenant1',
 *     mainDomain: 'local.dev:3000',
 *     pathname:   '/admin/signin',
 *     search:     '?callbackUrl=/example',
 *     hash:       '#testanchor',
 *   }
 *
 * @param headers Headers object containing proxy-injected URL parts
 * @returns An object with protocol, hostname, port, subdomain, mainDomain, pathname, search, and hash
 */
export function getRequestUrlParts(headers: Headers) {

    const protocol = headers.get(HEADER_KEYS.PROTOCOL) || 'https:';
    const hostname = headers.get(HEADER_KEYS.HOSTNAME) || '';
    const port = headers.get(HEADER_KEYS.PORT) || '';
    const subdomain = headers.get(HEADER_KEYS.SUBDOMAIN) || '';
    const mainDomain = headers.get(HEADER_KEYS.MAIN_DOMAIN) || '';
    const pathname = headers.get(HEADER_KEYS.PATHNAME) || '';
    const search = headers.get(HEADER_KEYS.SEARCH) || '';
    const hash = headers.get(HEADER_KEYS.HASH) || '';

    return {
        protocol,
        hostname,
        port,
        subdomain,
        mainDomain,
        pathname,
        search,
        hash,
    };
}

/**
 * Returns the root domain (main domain + port, no subdomain) from proxy headers.
 * @param headers Headers object containing proxy-injected URL parts
 * @returns {string} The root domain (e.g. 'local.dev:3000')
 */
export function getRootDomain(headers: Headers) {
    // Use the main domain and port from proxy headers for consistency
    return headers.get(HEADER_KEYS.MAIN_DOMAIN) || '';
}

/**
 * Builds a full root URL (with no subdomain/orgSlug) for a given path using proxy headers.
 *
 * Example:
 *   If the incoming request is:
 *     https://tenant1.local.dev:3000/admin/signin
 *   and you call:
 *     buildBaseDomainUrl(headers, '/admin/signin')
 *   The result will be:
 *     'https://local.dev:3000/admin/signin'
 *
 * @param headers Headers object containing proxy-injected URL parts
 * @param path Path to append (should start with '/')
 * @returns {string} Full URL with protocol and root domain
 */
export function buildBaseDomainUrl(headers: Headers, path: string) {
    const protocol = headers.get(HEADER_KEYS.PROTOCOL) || 'https:';
    const mainDomain = headers.get(HEADER_KEYS.MAIN_DOMAIN) || '';

    return `${protocol}//${mainDomain}${path}`;
}

/**
 * Builds the full URL (including subdomain, port, path, query, and hash) from proxy headers.
 *
 * Example:
 *   If the incoming request is:
 *     https://tenant1.local.dev:3000/admin/signin?callbackUrl=/example#testanchor
 *   and you call:
 *     getFullUrl(headers)
 *   The result will be:
 *     'https://tenant1.local.dev:3000/admin/signin?callbackUrl=/example#testanchor'
 *
 * @param headers Headers object containing proxy-injected URL parts
 * @returns {string} Full URL with protocol, hostname, port, path, search, and hash
 */
export function getFullUrl(headers: Headers, fallbackPathname?: string) {
    const protocol = headers.get(HEADER_KEYS.PROTOCOL) || 'https:';
    const hostname = headers.get(HEADER_KEYS.HOSTNAME) || '';
    const port = headers.get(HEADER_KEYS.PORT);
    const pathname = headers.get(HEADER_KEYS.PATHNAME) || (fallbackPathname || '');
    const search = headers.get(HEADER_KEYS.SEARCH) || '';
    const hash = headers.get(HEADER_KEYS.HASH) || '';

    // Only add :port if present
    let hostWithPort = hostname;
    if (port) {
        hostWithPort += `:${port}`;
    }

    return `${protocol}//${hostWithPort}${pathname}${search}${hash}`;
}

/**
 * Builds a subdomain-based route for a given organization slug and path.
 *
 * Example:
 *   If mainDomain is 'local.dev:3000', slug is 'tenant1', and pathname is '/admin',
 *   the result will be:
 *     'tenant1.local.dev:3000/admin'
 *
 * If no pathname is provided, defaults to the dashboard route.
 *
 * @param headers Headers object containing proxy-injected URL parts (expects x-main-domain)
 * @param slug Organization slug (used as subdomain)
 * @param pathname Optional path to append (defaults to dashboard)
 * @returns {string} The full subdomain-based route for the organization
 */
export function getOrganizationRoute(headers: Headers, slug: string, pathname?: string) {
    const mainDomain = headers.get(HEADER_KEYS.MAIN_DOMAIN) || '';
    const protocol = headers.get(HEADER_KEYS.PROTOCOL) || 'https:';

    if (!pathname) {
        pathname = AUTH_ROUTES.DASHBOARD; // Default to dashboard if no pathname provided
    }

    return `${protocol}//${slug}.${mainDomain}${pathname}`;
}

/**
 * Builds a subdomain-based route for a given mainDomain, organization slug and path.
 *
 * Example:
 *   If mainDomain is 'local.dev:3000', slug is 'tenant1', and pathname is '/admin',
 *   the result will be:
 *     'tenant1.local.dev:3000/admin'
 *
 * If no pathname is provided, defaults to the dashboard route.
 *
 * @param protocol Headers object containing proxy-injected URL parts (expects x-PROTOCOL)
 * @param headers Headers object containing proxy-injected URL parts (expects x-main-domain)
 * @param slug Organization slug (used as subdomain)
 * @param pathname Optional path to append (defaults to dashboard)
 * @returns {string} The full subdomain-based route for the organization
 */
export function getOrganizationRouteClient(slug: string, pathname?: string) {

    const protocol = window.location.protocol || 'https:';
    const hostname = window.location.hostname;
    const port = window.location.port;

    if (!hostname) {
        throw new Error('Hostname is required to build organization route');
    }

    if (!pathname) {
        pathname = AUTH_ROUTES.DASHBOARD; // Default to dashboard if no pathname provided
    }

    // Extract main domain by removing the first subdomain segment
    const hostParts = hostname.split('.');
    let mainDomain = hostname;

    if (hostParts.length > 2) {
        mainDomain = hostParts.slice(1).join('.');
    }

    // Only add :port if present
    let domainWithPort = mainDomain;
    if (port) {
        domainWithPort += `:${port}`;
    }

    return `${protocol}//${slug}.${domainWithPort}${pathname}`;
}


/**
 * Builds a full main domain URL (removing the first subdomain, if present) for a given pathname using the browser's window location.
 *
 * Example:
 *   If the current location is:
 *     https://tenant1.local.dev:3000/some/path
 *   and you call:
 *     getClientMainDomainUrl('/admin/signin')
 *   The result will be:
 *     'https://local.dev:3000/admin/signin'
 *
 * @param pathname Path to append to the main domain (should start with '/')
 * @returns {string} Full URL with protocol and main domain (no subdomain)
 * @throws {Error} If hostname is not available in window.location
 */
export function getClientMainDomainUrl(pathname: string) {
    const protocol = window.location.protocol || 'https:';
    const hostname = window.location.hostname;
    const port = window.location.port;

    if (!hostname) {
        throw new Error('Hostname is required to build main domain URL');
    }

    // Extract main domain by removing the first subdomain segment
    const hostParts = hostname.split('.');
    let mainDomain = hostname;

    if (hostParts.length > 2) {
        mainDomain = hostParts.slice(1).join('.');
    }

    // Only add :port if present
    let domainWithPort = mainDomain;
    if (port) {
        domainWithPort += `:${port}`;
    }

    return `${protocol}//${domainWithPort}${pathname}`;
}