import {PageContainer} from '@/components/layout';

export default function DashboardLoading() {
    return (
        <main className="page-shell">
            <PageContainer className="page-content">
                <div
                    role="status"
                    aria-label="Loading dashboard"
                    className="space-y-6"
                >
                    <div className="h-10 w-56 animate-pulse rounded-lg bg-surface" />

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({length: 3}).map((_, index) => (
                            <div
                                key={index}
                                className="h-64 animate-pulse rounded-2xl border border-border-subtle bg-surface"
                            />
                        ))}
                    </div>
                </div>
            </PageContainer>
        </main>
    );
}
