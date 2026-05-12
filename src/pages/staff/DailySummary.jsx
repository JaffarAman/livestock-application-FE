// src/pages/staff/DailySummary.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSlaughterRecords } from '../../store/slices/slaughterSlice'
import { 
    BarChart2, 
    Calendar, 
    Search, 
    Filter, 
    CheckCircle2, 
    Clock,
    Beef,
    Scissors,
    Zap,
    ChevronRight,
    Award,
    TrendingUp,
    Layers,
    Download
} from 'lucide-react'
import Button from '../../components/common/Button'
import { exportToCSV } from '../../utils/exportUtils'
import { formatNumber } from '../../utils/numberUtils'

const DailySummary = () => {
    const dispatch = useDispatch()
    const { slaughters, loading } = useSelector(state => state.slaughter)

    const { user } = useSelector(state => state.auth)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        dispatch(fetchSlaughterRecords())
    }, [dispatch])

    const handleExport = () => {
        if (!filtered || filtered.length === 0) return;
        const exportData = filtered.map(r => ({
            'Date': new Date(r.createdAt).toLocaleDateString(),
            'Time': new Date(r.createdAt).toLocaleTimeString(),
            'Batch #': r.batchId?.BatchNum || 'N/A',
            'Category': r.batchId?.Category || 'N/A',
            'Animals': r.count,
            'Meat (kg)': r.meatWeight,
            'Skins': r.skinsCount || 0,
            'Paye': r.payeCount || 0
        }));
        exportToCSV(exportData, `Daily_Summary_${user?.username}`);
    };

    // Filter only my records - check both populated object and raw ID string
    const myRecords = slaughters?.filter(r => {
        const staffId = r.staffId?._id || r.staffId;
        const currentUserId = user?._id || user?.id;
        return staffId?.toString() === currentUserId?.toString();
    }) || []

    const filtered = myRecords.filter(r => 
        r.batchId?.BatchNum?.toString().includes(searchTerm) ||
        r.batchId?.Category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalWeight = myRecords.reduce((sum, r) => sum + (Number(r.meatWeight) || 0), 0)
    const totalAnimals = myRecords.reduce((sum, r) => sum + (Number(r.count) || 0), 0)

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Performance Log</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Review your shift contributions and operational efficiency.</p>
                </div>
                <div className="flex gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
                        <TrendingUp size={16} className="text-primary" />
                        <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">Efficiency: {formatNumber(totalWeight / (totalAnimals || 1))} kg/unit</span>
                    </div>
                    <Button 
                        variant="outline" 
                        icon={Download} 
                        onClick={handleExport}
                        disabled={filtered.length === 0}
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Scissors size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Total Slaughtered</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">{totalAnimals}</h3>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight">Units My Operation</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Beef size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Meat Weight</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">{formatNumber(totalWeight)} <span className="text-sm font-semibold text-on-surface-variant">kg</span></h3>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight">Net Contribution</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-5">
                         <Award size={20} />
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Award size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Achievements</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">02</h3>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight">Badges Earned</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">Syncing Records...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-20 text-center opacity-40 animate-fadeIn">
                    <BarChart2 size={20} className="mx-auto text-on-surface-variant/20 mb-4" />
                    <p className="text-lg font-semibold text-on-surface font-headline">No shift logs found</p>
                    <p className="text-sm text-on-surface-variant mt-1">Start recording operations in the Records section.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden animate-slideUp">
                    <div className="px-8 py-6 border-b border-surface-container-low flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Layers size={20} />
                            </div>
                            <h2 className="text-xl font-semibold text-on-surface font-headline">Recent Operations</h2>
                        </div>
                        <div className="relative group w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={14} />
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none" 
                                placeholder="Find batch record..." 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-surface-container-low/30 text-on-surface-variant/60 text-[10px] font-semibold uppercase tracking-[0.15em]">
                                    <th className="px-8 py-5">Batch Reference</th>
                                    <th className="px-8 py-5 text-center">Unit Volume</th>
                                    <th className="px-8 py-5 text-center">Meat Weight</th>
                                    <th className="px-8 py-5 text-center">Skins</th>
                                    <th className="px-8 py-5 text-center">Paye</th>
                                    <th className="px-8 py-5">Time Recorded</th>
                                    <th className="px-8 py-5 text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low">
                                {filtered.map((record, i) => (
                                    <tr key={i} className="hover:bg-surface-container-low/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center font-medium text-[10px] text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    #{record.batchId?.BatchNum || 'N/A'}
                                                </div>
                                                <span className="font-medium text-on-surface text-sm">{record.batchId?.Category || 'Standard'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center tabular-nums text-on-surface font-semibold">{record.count}</td>
                                        <td className="px-8 py-5 text-center tabular-nums text-on-surface font-semibold">{formatNumber(record.meatWeight)} <span className="text-[10px] text-on-surface-variant font-medium">kg</span></td>
                                        <td className="px-8 py-5 text-center tabular-nums text-on-surface-variant/60 font-medium">{formatNumber(record.skinsCount || 0)}</td>
                                        <td className="px-8 py-5 text-center tabular-nums text-on-surface-variant/60 font-medium">{formatNumber(record.payeCount || 0)}</td>
                                        <td className="px-8 py-5 text-on-surface-variant/60 text-xs font-medium">{new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1.5 text-primary">
                                                <CheckCircle2 size={14} />
                                                <span className="text-[10px] font-semibold uppercase tracking-widest">Verified</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DailySummary
