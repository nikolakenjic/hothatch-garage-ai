import {Button} from '@/components/ui/button';

export default function GoogleAuthButton() {
    return (
        <Button
            asChild
            type="button"
            variant="outline"
            size="lg"
            className="w-full font-semibold"
        >
            <a href="/api/auth/google/start">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                    <path
                        fill="#4285F4"
                        d="M21.35 12.25c0-.75-.07-1.46-.18-2.15H12v4.07h5.24a4.5 4.5 0 0 1-1.95 2.95v2.45h3.15c1.85-1.71 2.91-4.23 2.91-7.32Z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 21.75c2.64 0 4.86-.87 6.48-2.37l-3.15-2.45c-.87.58-1.97.92-3.33.92-2.56 0-4.73-1.73-5.5-4.05H3.25v2.52A9.75 9.75 0 0 0 12 21.75Z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M6.5 13.8a5.83 5.83 0 0 1 0-3.6V7.68H3.25a9.75 9.75 0 0 0 0 8.64L6.5 13.8Z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 6.15c1.44 0 2.73.49 3.74 1.47l2.81-2.81A9.37 9.37 0 0 0 12 2.25a9.75 9.75 9.75 0 0 0-8.75 5.43L6.5 10.2c.77-2.32 2.94-4.05 5.5-4.05Z"
                    />
                </svg>
                Continue with Google
            </a>
        </Button>
    );
}
