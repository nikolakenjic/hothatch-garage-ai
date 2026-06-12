import DeleteModificationButton from '@/app/(dashboard)/garage/_components/forms/DeleteModificationButton';
import EditModificationButton from '@/app/(dashboard)/garage/_components/forms/EditModificationButton';
import {Modification} from '@/types/modification';

type ModificationListProps = {
    modifications: Modification[];
    totalSpent: number;
};

export default function ModificationList({
    modifications,
    totalSpent,
}: ModificationListProps) {
    return (
        <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white/75 p-6 shadow-xl backdrop-blur-xl md:p-8 dark:border-white/10 dark:bg-zinc-950/70">
            <h2 className="font-heading text-2xl font-black text-zinc-950 dark:text-white mb-6">
                Modifications
            </h2>
            {modifications.length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400">
                    No modifications yet — add your first mod below.
                </p>
            ) : (
                <>
                    <div className="space-y-3">
                        {modifications.map((mod: Modification) => (
                            <div
                                key={mod._id}
                                className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-white/5 dark:bg-white/[0.03]"
                            >
                                <div>
                                    <p className="font-semibold text-zinc-950 dark:text-white">
                                        {mod.name}
                                    </p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {mod.category}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {mod.price && (
                                        <p className="font-bold text-zinc-950 dark:text-white">
                                            €{mod.price}
                                        </p>
                                    )}
                                    <EditModificationButton mod={mod} />
                                    <DeleteModificationButton modId={mod._id} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-zinc-100 dark:border-white/10">
                        <p className="font-semibold text-zinc-950 dark:text-white">
                            Total spent
                        </p>
                        <p className="font-heading text-2xl font-black text-red-600 dark:text-red-500">
                            €{totalSpent}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
