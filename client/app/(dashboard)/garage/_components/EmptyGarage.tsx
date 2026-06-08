export default function EmptyGarage() {
    return (
        <div className="mt-10 rounded-[2rem] border border-dashed border-zinc-300 bg-white/60 p-10 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-600/10 text-3xl">
                🏁
            </div>

            <h2 className="font-heading text-2xl font-black text-zinc-950 dark:text-white">
                Your garage is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-zinc-500 dark:text-zinc-400">
                Add your first car and start tracking your build like a real
                premium garage profile.
            </p>
        </div>
    );
}
