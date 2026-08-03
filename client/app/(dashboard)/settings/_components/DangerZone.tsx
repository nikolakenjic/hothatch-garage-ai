'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {AlertTriangle, LoaderCircle, Trash2} from 'lucide-react';

import GlassPanel from '@/components/shared/GlassPanel';
import {Button} from '@/components/ui/button';
import {getErrorMessage} from '@/lib/errors';
import UserService from '@/services/user.service';

export default function DangerZone() {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'This permanently deletes your account, cars, modifications, AI history, and active sessions. This action cannot be undone.',
        );

        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);

            await UserService.deleteAccount();

            toast.success('Account deleted successfully');
            router.replace('/register');
            router.refresh();
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <GlassPanel
            variant="solid"
            padding="lg"
            className="border-destructive/30"
        >
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-5" aria-hidden="true" />
                </div>

                <div>
                    <p className="eyebrow text-destructive">Danger zone</p>

                    <h2 className="section-title mt-2">Delete account</h2>

                    <p className="body-text mt-2">
                        Permanently remove your account and all associated
                        garage and AI data.
                    </p>
                </div>
            </div>

            <div className="mt-7 flex flex-col gap-5 rounded-xl border border-destructive/25 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        Permanently delete this account
                    </p>

                    <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                        This removes your profile, vehicles, modifications,
                        recommendation history, and active sessions. It cannot
                        be reversed.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={handleDeleteAccount}
                    className="shrink-0"
                >
                    {isDeleting ? (
                        <>
                            <LoaderCircle
                                className="size-4 animate-spin"
                                aria-hidden="true"
                            />
                            Deleting account...
                        </>
                    ) : (
                        <>
                            <Trash2 className="size-4" aria-hidden="true" />
                            Delete account
                        </>
                    )}
                </Button>
            </div>
        </GlassPanel>
    );
}
