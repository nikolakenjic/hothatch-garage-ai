export function setAuthCookie(token: string) {
    document.cookie = `token=${token}; path=/; SameSite=Strict`;
}
