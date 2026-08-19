import 'server-only';
import {cookies} from 'next/headers';
import AuthService from '@/services/auth.service';

export async function getServerCookieHeader(): Promise<string> {
    const cookieStore = await cookies();

    return cookieStore
        .getAll()
        .map(({name, value}) => `${name}=${value}`)
        .join('; ');
}

export async function getServerAuthenticatedUser() {
    const cookieHeader = await getServerCookieHeader();

    const response = await AuthService.getMe({
        headers: {
            Cookie: cookieHeader,
        },
    });

    return response.user;
}
