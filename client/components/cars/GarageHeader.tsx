type GarageHeaderProps = {
    carsCount: number;
};

export default function GarageHeader({carsCount}: GarageHeaderProps) {
    return (
        <header className="flex flex-col gap-6 rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl shadow-zinc-200/60 backdrop-blur-xl md:p-8 lg:flex-row lg:items-end lg:justify-between dark:border-white/10 dark:bg-zinc-950/70 dark:shadow-red-950/20">
            <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-red-600 dark:text-red-500">
                    Your Collection
                </p>

                <h1 className="font-heading text-4xl font-black tracking-tight text-zinc-950 md:text-5xl dark:text-white">
                    My Garage 🔥
                </h1>

                <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
                    {carsCount === 0
                        ? 'No cars yet — add your first hot hatch and start building your dream garage.'
                        : `${carsCount} car${carsCount > 1 ? 's' : ''} in your garage. Track builds, modifications, and future AI upgrade ideas.`}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <StatCard label="Cars" value={carsCount} />
                <StatCard label="Mods" value="Soon" />
                <StatCard label="AI" value="Ready" />
            </div>
        </header>
    );
}

function StatCard({label, value}: {label: string; value: string | number}) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-center dark:border-white/10 dark:bg-white/5">
            <p className="font-heading text-xl font-black text-zinc-950 dark:text-white">
                {value}
            </p>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
        </div>
    );
}
