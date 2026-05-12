// src/pages/admin/AllBatches.jsx
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBatches } from '../../store/slices/batchSlice'
import { exportToCSV } from '../../utils/exportUtils'
import { 
    Package, 
    Filter,
    Search,
    History,
    FileText,
    PlusCircle,
    Download
} from 'lucide-react'
import Button from '../../components/common/Button'
import { useNavigate } from 'react-router-dom'

const AllBatches = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { allBatches, loading, error } = useSelector(state => state.batch)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    useEffect(() => {
        dispatch(fetchBatches())
    }, [dispatch])

    const batches = useMemo(() => (Array.isArray(allBatches) ? allBatches : []), [allBatches])

    const filtered = useMemo(() => {
        return batches.filter((b) => {
            const remaining = Number(b?.remainingAnimals ?? 0)
            const total = Number(b?.TotalAnimals ?? 0)
            const batchNum = b?.BatchNum?.toString?.() || ''
            const category = b?.Category?.toLowerCase?.() || ''
            const search = searchTerm.toLowerCase()
            const matchesSearch = batchNum.includes(searchTerm) || category.includes(search)

            const matchesStatus =
                statusFilter === 'All' ||
                (statusFilter === 'Full Stock' && remaining === total) ||
                (statusFilter === 'Active' && remaining > 0 && remaining < total) ||
                (statusFilter === 'Exhausted' && remaining === 0)

            return matchesSearch && matchesStatus
        })
    }, [batches, searchTerm, statusFilter])

    const handleExport = () => {
        const exportData = filtered.map((b) => {
            const remaining = Number(b?.remainingAnimals ?? 0)
            const total = Number(b?.TotalAnimals ?? 0)
            const allocationStatus = remaining === total ? 'Not Allocated' : (remaining === 0 ? 'Fully Allocated' : 'Partially Allocated')
            return {
                'Batch #': b?.BatchNum ?? 'N/A',
                Category: b?.Category ?? 'N/A',
                'Total Stock': total,
                'Remaining Stock': remaining,
                'Allocation Status': allocationStatus,
                'Created Date': b?.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A'
            }
        })
        exportToCSV(exportData, 'Batch_Management')
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Inventory Records</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Comprehensive log of all livestock batches received.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="outline" icon={Download} onClick={handleExport} disabled={filtered.length === 0}>
                        Export CSV
                    </Button>
                    <div className="relative group flex-1 sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by Batch # or Category..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-outline-variant/30 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <History size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-on-surface font-headline">Historical Batch Log</h2>
                    </div>
                    <Button variant="ghost" size="sm" icon={Filter}>Configure Columns</Button>
                </div>
                <div className="px-8 py-5 border-b border-surface-container-low flex flex-wrap items-center gap-2 bg-surface-container-low/20">
                    {['All', 'Full Stock', 'Active', 'Exhausted'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all ${
                                statusFilter === s
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white text-on-surface-variant hover:text-primary border border-outline-variant/30'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="py-20 text-center text-on-surface-variant font-medium">Loading batches...</div>
                )}

                {!loading && error && (
                    <div className="py-20 text-center text-error font-medium">{error}</div>
                )}

                {!loading && !error && (
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-low/30 text-on-surface-variant/60 text-[10px] font-semibold uppercase tracking-[0.15em]">
                                <th className="px-8 py-5">Batch Reference</th>
                                <th className="px-8 py-5">Classification</th>
                                <th className="px-8 py-5 text-center">Initial</th>
                                <th className="px-8 py-5 text-center">Remaining</th>
                                <th className="px-8 py-5">Stock Status</th>
                                <th className="px-8 py-5">Allocation Status</th>
                                <th className="px-8 py-5 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {filtered?.map((b, i) => {
                                const remaining = Number(b?.remainingAnimals ?? 0)
                                const total = Number(b?.TotalAnimals ?? 0)
                                const isExhausted = remaining === 0;
                                const isNew = remaining === total;
                                
                                const status = isExhausted ? 'Exhausted' : (isNew ? 'Full Stock' : 'Active');
                                const allocationStatus = isNew ? 'Not Allocated' : (isExhausted ? 'Fully Allocated' : 'Partially Allocated')
                                const statusColor = isExhausted ? 'bg-error/10 text-error' : (isNew ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary');
                                
                                return (
                                    <tr key={i} className="hover:bg-surface-container-low/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary font-semibold text-xs border border-primary/5">
                                                    #{b?.BatchNum ?? 'N/A'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-on-surface text-sm uppercase tracking-tight">{b?.Category || 'Unknown'} Shipment</p>
                                                    <p className="text-[10px] text-on-surface-variant/40 font-medium uppercase">{b?.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-surface-container-low rounded-lg text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                                                {b?.Category || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 tabular-nums text-on-surface font-medium text-center text-sm">
                                            {total}
                                        </td>
                                        <td className="px-8 py-5 tabular-nums text-primary font-semibold text-center text-sm">
                                            {remaining}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] ${statusColor}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] bg-surface-container-low text-on-surface-variant">
                                                {allocationStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                {!isExhausted && (
                                                    <button 
                                                        title="Allocate Stock"
                                                        className="p-2 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-xl transition-all"
                                                        onClick={() => navigate('/admin/allocation')}
                                                    >
                                                        <PlusCircle size={18} />
                                                    </button>
                                                )}
                                                <button 
                                                    title="View Full Ledger"
                                                    className="p-2 text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-all"
                                                >
                                                    <FileText size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                )}

                {!loading && !error && (!filtered || filtered.length === 0) && (
                    <div className="py-20 text-center opacity-40">
                        <Package size={20} className="mx-auto text-on-surface-variant/20 mb-4" />
                        <p className="text-lg font-semibold text-on-surface font-headline">No matching records</p>
                        <p className="text-sm text-on-surface-variant mt-1">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllBatches
