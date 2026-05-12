import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchBranchDetail } from '../../store/slices/branchSlice'
import { fetchAllAllocations } from '../../store/slices/allocationSlice'
import { exportToCSV } from '../../utils/exportUtils'
import {
    ArrowLeft,
    Calendar,
    Download,
    Users,
    Building2,
    Activity,
    Package
} from 'lucide-react'
import Button from '../../components/common/Button'
import { formatNumber } from '../../utils/numberUtils'

const BranchDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { branchDetail, loading, error } = useSelector((state) => state.branch)
    const { allAllocations } = useSelector((state) => state.allocation)
    const [period, setPeriod] = useState('Monthly')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    useEffect(() => {
        if (id) {
            dispatch(fetchBranchDetail(id))
            dispatch(fetchAllAllocations())
        }
    }, [dispatch, id])

    const processingRecords = branchDetail?.processingRecords || []
    const branchAllocations = (allAllocations || []).filter((a) => a?.branchId?._id === id || a?.branchId === id)

    const inRange = (value) => {
        if (!value) return false
        const date = new Date(value)
        const now = new Date()
        if (period === 'Daily') return now.toDateString() === date.toDateString()
        if (period === 'Weekly') {
            const start = new Date(now)
            start.setDate(now.getDate() - 7)
            return date >= start && date <= now
        }
        if (period === 'Monthly') {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }
        if (period === 'Custom') {
            if (!fromDate || !toDate) return true
            const start = new Date(fromDate)
            const end = new Date(toDate)
            end.setHours(23, 59, 59, 999)
            return date >= start && date <= end
        }
        return true
    }

    const timeline = useMemo(() => {
        // Slaughter records (created from Slaughter model)
        const slaughterEntries = (branchDetail?.processingRecords || [])
            .filter((entry) => inRange(entry.createdAt))
            .map((s) => ({
                id: s._id,
                type: 'Slaughter',
                date: s.createdAt,
                reference: s._id,
                quantity: s.count || 0,
                meat: s.meatWeight || 0,
                skins: s.skinsCount || 0,
                legs: s.payeCount || 0,
                staff: s.staffId?.username || 'N/A'
            }));

        // Processing records (from Processing model) — added on backend as allProcessingRecords
        const processingEntries = (branchDetail?.allProcessingRecords || [])
            .filter((entry) => inRange(entry.createdAt))
            .map((p) => ({
                id: p._id,
                type: 'Processing',
                date: p.createdAt,
                reference: p._id,
                meat: p.meatWeight || 0,
                skins: p.skins || 0,
                legs: p.paye || 0
            }));

        return [...slaughterEntries, ...processingEntries]
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [branchDetail?.processingRecords, branchDetail?.allProcessingRecords, period, fromDate, toDate]);

    const allocationEntries = useMemo(() => {
        return branchAllocations
            .filter(a => inRange(a.createdAt))
            .map((a) => ({
                id: `allocation-${a._id}`,
                type: 'Allocation',
                date: a.createdAt,
                reference: a._id,
                quantity: a.quantity || 0,
                status: a.status || 'Pending'
            }));
    }, [branchAllocations, period, fromDate, toDate]);

    const combinedTimeline = [...timeline, ...allocationEntries].sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalAllocated = branchAllocations.reduce((sum, a) => sum + Number(a?.quantity || 0), 0)
    const remainingStock = Number(branchDetail?.remainingStock || 0)
    const totalSlaughtered = Number(branchDetail?.totalSlaughtered || 0)
    
    // Summary from inventory totals (more reliable)
    const totalSkins = Number(branchDetail?.skinStock || 0)
    const totalLegs = Number(branchDetail?.payeStock || 0)
    const totalMeat = Number(branchDetail?.meatStock || 0)

    const handleExport = () => {
        const exportData = timeline.map((item) => ({
            Date: new Date(item.date).toLocaleString(),
            Type: item.type,
            Reference: item.reference,
            Quantity: item.quantity || 0,
            Status: item.status || '',
            'Meat (KG)': item.meat || '',
            Skins: item.skins || '',
            Legs: item.legs || ''
        }))
        exportToCSV(exportData, `Branch_${branchDetail?.branch?.name || 'Details'}_Timeline`)
    }

    if (loading && !branchDetail) {
        return <div className="py-16 text-center text-on-surface-variant font-medium">Loading branch details...</div>
    }

    if (error && !branchDetail) {
        return <div className="py-16 text-center text-error font-medium">{error}</div>
    }

    if (!branchDetail?.branch) {
        return <div className="py-16 text-center text-on-surface-variant font-medium">Branch details not found.</div>
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <button onClick={() => navigate('/admin/branches')} className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline mb-3">
                        <ArrowLeft size={16} /> Back to Branches
                    </button>
                    <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Branch Details</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Complete operational view for selected branch.</p>
                </div>
                <Button variant="outline" icon={Download} onClick={handleExport} disabled={timeline.length === 0}>
                    Export CSV
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-outline-variant/30 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2"><Building2 size={18} /> Branch Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div><p className="text-on-surface-variant font-medium">Branch name</p><p className="font-semibold text-on-surface">{branchDetail.branch.name}</p></div>
                        <div><p className="text-on-surface-variant font-medium">Location</p><p className="font-semibold text-on-surface">{branchDetail.branch.location || 'N/A'}</p></div>
                        <div><p className="text-on-surface-variant font-medium">Created date</p><p className="font-semibold text-on-surface">{branchDetail.branch.createdAt ? new Date(branchDetail.branch.createdAt).toLocaleDateString() : 'N/A'}</p></div>
                        <div><p className="text-on-surface-variant font-medium">Current stock</p><p className="font-semibold text-on-surface">{formatNumber(remainingStock)}</p></div>
                        <div><p className="text-on-surface-variant font-medium">Status</p><p className="font-semibold text-on-surface">{branchDetail.branch?.isActive === false ? 'Inactive' : 'Active'}</p></div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-outline-variant/30 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2"><Users size={18} /> Assigned Users</h2>
                    <div className="space-y-2 text-sm">
                        <p className="text-on-surface-variant font-medium">Manager</p>
                        <p className="font-semibold text-on-surface">{branchDetail.manager?.username || 'Unassigned'}</p>
                        <p className="text-on-surface-variant font-medium pt-2">Staff members</p>
                        {(branchDetail.staff || []).length === 0 ? (
                            <p className="text-on-surface-variant">No staff assigned.</p>
                        ) : (
                            <div className="max-h-40 overflow-auto space-y-1">
                                {(branchDetail.staff || []).map((staff) => (
                                    <p key={staff._id} className="font-medium text-on-surface">{staff.username} {staff.isActive === false ? '(Inactive)' : ''}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl border border-outline-variant/30 p-5"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Total allocated</p><p className="text-xl font-semibold text-on-surface mt-1">{formatNumber(totalAllocated)}</p></div>
                <div className="bg-white rounded-2xl border border-outline-variant/30 p-5"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Remaining stock</p><p className="text-xl font-semibold text-on-surface mt-1">{formatNumber(remainingStock)}</p></div>
                <div className="bg-white rounded-2xl border border-outline-variant/30 p-5"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Slaughtered animals</p><p className="text-xl font-semibold text-on-surface mt-1">{formatNumber(totalSlaughtered)}</p></div>
                <div className="bg-white rounded-2xl border border-outline-variant/30 p-5"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Processed animals</p><p className="text-xl font-semibold text-on-surface mt-1">{formatNumber(totalSlaughtered)}</p></div>
            </div>

            <div className="bg-white rounded-3xl border border-outline-variant/30 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2"><Package size={18} /> Processing Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-surface-container-low rounded-xl"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Total skins</p><p className="text-xl font-semibold text-on-surface mt-1">{formatNumber(totalSkins)}</p></div>
                    <div className="p-4 bg-surface-container-low rounded-xl"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Total legs</p><p className="text-xl font-semibold text-on-surface mt-1">{formatNumber(totalLegs)}</p></div>
                    <div className="p-4 bg-surface-container-low rounded-xl"><p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Meat (KG)</p><p className="text-xl font-semibold text-on-surface mt-1">{formatNumber(totalMeat)}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-outline-variant/30 overflow-hidden">
                <div className="p-6 border-b border-surface-container-low flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2"><Activity size={18} /> Activity Timeline</h2>
                    <div className="flex flex-wrap items-center gap-2">
                        {['Daily', 'Weekly', 'Monthly', 'Custom'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setPeriod(f)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest ${period === f ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    {period === 'Custom' && (
                        <div className="flex items-center gap-2">
                            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-white border border-outline-variant/40 rounded-xl px-3 py-2 text-sm text-on-surface" />
                            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-white border border-outline-variant/40 rounded-xl px-3 py-2 text-sm text-on-surface" />
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-container-low/30 text-on-surface-variant text-[10px] font-semibold uppercase tracking-[0.15em]">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Summary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low text-sm">
                            {combinedTimeline.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 text-on-surface font-medium"><span className="inline-flex items-center gap-2"><Calendar size={14} className="text-on-surface-variant" />{new Date(item.date).toLocaleString()}</span></td>
                                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${item.type === 'Allocation' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>{item.type}</span></td>
                                    <td className="px-6 py-4 text-on-surface-variant font-medium">{item.reference?.toString()?.slice(-8)}</td>
                                    <td className="px-6 py-4 text-on-surface font-semibold">{formatNumber(item.quantity || 0)}</td>
                                    <td className="px-6 py-4 text-on-surface-variant font-medium">
                                        {item.type === 'Allocation' && `Status: ${item.status}`}
                                        {(item.type === 'Slaughter' || item.type === 'Processing') && `Meat: ${formatNumber(item.meat)}kg, Skins: ${formatNumber(item.skins)}, Legs: ${formatNumber(item.legs)}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {timeline.length === 0 && (
                    <div className="py-14 text-center text-on-surface-variant font-medium">No activities found for selected filter.</div>
                )}
            </div>
        </div>
    )
}

export default BranchDetails


