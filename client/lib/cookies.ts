export function setAuthCookie(token: string) {
    document.cookie = `token=${token}; path=/; SameSite=Strict`;
}

export function removeAuthCookie() {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    return match ? match[1] : null;
}
