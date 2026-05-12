import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBranchStats } from '../../store/slices/dashboardSlice'

const SlaughterEntry = () => {
    const dispatch = useDispatch()
    const { stats, loading } = useSelector(state => state.dashboard)
    const [quantity, setQuantity] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        dispatch(fetchBranchStats())
    }, [dispatch])

    const available = stats?.remainingAnimals || 0
    const remaining = available - (parseInt(quantity) || 0)
    const isOverflow = parseInt(quantity) > available

    const logs = stats?.recentActivities || []


    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="mb-4">
                <h1 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">Daily Slaughter Record</h1>
                <p className="text-on-surface-variant text-sm font-medium mt-0.5">Record how many animals were processed today at this branch.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <section className="lg:col-span-7">
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-50 space-y-6">
                        <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                            <div className="bg-primary/10 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>inventory</span>
                                    </div>
                                    <div>
                                        <p className="text-on-surface font-medium text-sm">Animals in Yard</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Available to be processed</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-extrabold text-primary tabular-nums">{available}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-medium uppercase tracking-widest text-outline">Animals Processed</label>
                                    <div className="relative">
                                        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" className="w-full bg-surface-container-low border-none rounded-t-xl border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-4 px-4 text-xl font-extrabold tabular-nums text-on-surface outline-none" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-medium text-xs">Animals</span>
                                    </div>
                                </div>
                                <div className="bg-surface-container-low rounded-xl p-3 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">calculate</span>
                                    <p className="text-xs font-medium text-on-surface-variant">
                                        Remaining: <span className="tabular-nums font-medium">{remaining}</span> heads.
                                    </p>
                                </div>
                                {isOverflow && (
                                    <div className="flex items-center gap-2 p-4 bg-error-container text-on-error-container rounded-xl">
                                        <span className="material-symbols-outlined">warning</span>
                                        <p className="text-sm font-medium">Error: Exceeds available livestock.</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end pt-2">
                                <button type="submit" disabled={isOverflow || !quantity} className="px-10 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-medium rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 text-sm">
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <aside className="lg:col-span-5 space-y-4">
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-50">
                        <h3 className="text-lg font-medium font-headline mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">history</span> Today's Entries
                        </h3>
                        <div className="space-y-4">
                            {logs.map((log, i) => (
                                <div key={i} className="flex justify-between items-center p-4 border border-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-sm">{log.count} Animals</p>
                                        <p className="text-xs text-slate-500 mt-1">{log.staffId?.username || 'Staff'} • {new Date(log.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full text-[10px] font-medium uppercase">Recorded</span>
                                </div>
                            ))}

                            {logs.length === 0 && <p className="text-sm text-slate-500">No entries yet today.</p>}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default SlaughterEntry
