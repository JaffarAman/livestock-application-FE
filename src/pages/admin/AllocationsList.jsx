// src/pages/admin/AllocationsList.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllAllocations } from '../../store/slices/allocationSlice'
import { exportToCSV } from '../../utils/exportUtils'
import { 
    Download, 
    Search, 
    Filter, 
    Truck, 
    CheckCircle2, 
    Clock, 
    Box, 
    Building2,
    FileText,
    ChevronDown,
    ArrowUpRight
} from 'lucide-react'
import Button from '../../components/common/Button'

const AllocationsList = () => {
    const dispatch = useDispatch()
    const { allAllocations, loading } = useSelector(state => state.allocation)
    
    useEffect(() => {
        dispatch(fetchAllAllocations())
    }, [dispatch])

    const [filter, setFilter] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')

    const allocations = allAllocations?.map(a => {
        const id = `#AL-${a._id.toString().slice(-4).toUpperCase()}`
        const batch = a.batchId?.BatchNum || 'Unknown'
        const branch = a.branchId?.name || 'Unknown'
        const qty = a.quantity
        const date = new Date(a.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
        const status = a.status === 'Received' ? 'Delivered' : 'Pending'
        return { _id: a._id, id, batch, branch, qty, date, status }
    }) || [];

    const filtered = allocations.filter(a => {
        const matchesFilter = filter === 'All' || a.status === filter;
        const matchesSearch = a.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             a.batch.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             a.branch.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleExport = () => {
        const exportData = filtered.map(a => ({
            'Allocation ID': a.id,
            'Batch': a.batch,
            'Branch': a.branch,
            'Quantity': a.qty,
            'Date': a.date,
            'Status': a.status
        }));
        exportToCSV(exportData, 'Allocations_List');
    };

    const stats = [
        { label: 'Total Logistics', value: allocations.length, icon: Truck, color: 'text-primary' },
        { label: 'Successfully Delivered', value: allocations.filter(a => a.status === 'Delivered').length, icon: CheckCircle2, color: 'text-primary' },

        { label: 'In-Transit / Pending', value: allocations.filter(a => a.status === 'Pending').length, icon: Clock, color: 'text-error' },
    ]

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden relative group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-on-surface font-headline tracking-tight">Logistics Ledger</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Full audit trail of all livestock movements across branches.</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto relative z-10">
                    <Button 
                        variant="primary" 
                        onClick={handleExport}
                        icon={Download}
                        disabled={filtered.length === 0}
                        className="flex-1 sm:flex-none shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                    >
                        Export Registry
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-outline-variant/30 flex items-center gap-5 shadow-sm">
                        <div className={`p-4 bg-surface-container-low ${s.color} rounded-2xl`}>
                            <s.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">{s.label}</p>
                            <h3 className="text-xl font-semibold text-on-surface tabular-nums">{s.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Table */}
            <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 bg-surface-container-low p-1.5 rounded-2xl">
                        {['All', 'Delivered', 'Pending'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)} 
                                className={`px-5 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant/40 hover:text-on-surface'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative group w-full md:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by ID, batch, branch..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-surface-container-low border-none rounded-2xl py-3 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-container-low/30 text-on-surface-variant/60 text-[10px] font-semibold uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-5">Logistics ID</th>
                                <th className="px-8 py-5">Source Batch</th>
                                <th className="px-8 py-5">Target Branch</th>
                                <th className="px-8 py-5 text-center">Volume</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Fulfillment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low text-sm font-medium">
                            {filtered.map((a) => (
                                <tr key={a._id} className="hover:bg-surface-container-low/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-on-surface tabular-nums tracking-tight">{a.id}</span>
                                            <ArrowUpRight size={12} className="text-on-surface-variant/20 group-hover:text-primary transition-colors" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-on-surface-variant font-medium tabular-nums">#{a.batch}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                                                <Building2 size={14} />
                                            </div>
                                            <span className="text-on-surface font-medium">{a.branch}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="px-2.5 py-1 bg-surface-container-low rounded-lg font-semibold text-on-surface tabular-nums">{a.qty}</span>
                                    </td>
                                    <td className="px-8 py-5 text-on-surface-variant/60 font-medium text-xs">{a.date}</td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest ${
                                            a.status === 'Delivered' 
                                            ? 'bg-primary/10 text-primary border border-primary/10' 
                                            : 'bg-error/10 text-error border border-error/10'
                                        }`}>
                                            {a.status === 'Delivered' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                            {a.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                        <FileText size={20} className="text-on-surface-variant/20 mb-4" />
                        <p className="text-lg font-semibold text-on-surface font-headline">No Matching Records</p>
                        <p className="text-sm text-on-surface-variant mt-1">Try refining your search parameters.</p>
                    </div>
                )}

                <div className="px-8 py-5 bg-surface-container-low/30 border-t border-surface-container-low flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">
                        Showing {filtered.length} of {allocations.length} total entries
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next Page</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllocationsList
