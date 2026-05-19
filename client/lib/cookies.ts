export function setAuthCookie(token: string) {
    document.cookie = `token=${token}; path=/; SameSite=Strict`;
}

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    return match ? match[1] : null;
}
