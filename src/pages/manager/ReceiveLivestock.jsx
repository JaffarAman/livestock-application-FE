// src/pages/manager/ReceiveLivestock.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllocationsForBranch, receiveAllocation } from '../../store/slices/allocationSlice'
import { 
    Download, 
    Box, 
    Truck, 
    CheckCircle2, 
    AlertCircle, 
    ArrowRight, 
    Clock,
    Search,
    Filter,
    FileText
} from 'lucide-react'
import Button from '../../components/common/Button'

const ReceiveLivestock = () => {
    const dispatch = useDispatch()
    const { branchAllocations, loading, error } = useSelector(state => state.allocation)
    const [successMsg, setSuccessMsg] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        dispatch(fetchAllocationsForBranch())
    }, [dispatch])

    const handleReceive = async (alloc) => {
        const res = await dispatch(receiveAllocation({
            allocationId: alloc._id,
            quantity: alloc.quantity
        }))
        if (res.meta.requestStatus === 'fulfilled') {
            setSuccessMsg('Shipment received and added to local inventory.')
            dispatch(fetchAllocationsForBranch())
            setTimeout(() => setSuccessMsg(''), 5000)
        }
    }

    const pending = branchAllocations?.filter(a => a.status === 'Pending') || []
    
    // History (Received) filter with search
    const received = (branchAllocations?.filter(a => a.status === 'Received') || []).filter(alloc => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        const batchNum = alloc.batchId?.BatchNum?.toString().toLowerCase() || '';
        const category = alloc.batchId?.Category?.toLowerCase() || '';
        return batchNum.includes(search) || category.includes(search);
    })

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Supply Chain Inbound</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Monitor and acknowledge incoming livestock shipments from central warehouse.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" icon={Filter} size="sm">Active Filters</Button>
                </div>
            </div>

            {successMsg && (
                <div className="p-4 bg-primary/5 text-primary border border-primary/20 rounded-2xl flex items-center gap-3 animate-slideUp">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-medium">{successMsg}</span>
                </div>
            )}
            {error && (
                <div className="p-4 bg-error/5 text-error border border-error/20 rounded-2xl flex items-center gap-3 animate-slideUp">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}


            {/* Pending Shipments Section - Only show if pending exist */}
            {pending.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Truck size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-on-surface font-headline">In-Transit Shipments</h2>
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-widest rounded-full">
                            {pending.length} Dispatch(es)
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pending.map((alloc, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-primary/5">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                                
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-primary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <Box size={22} />
                                    </div>
                                    <div className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full border border-primary/10">
                                        Pending
                                    </div>
                                </div>

                                <div className="space-y-1 mb-8">
                                    <h3 className="text-xl font-semibold text-on-surface font-headline">Batch #{alloc.batchId?.BatchNum || 'N/A'}</h3>
                                    <p className="text-xs font-medium text-on-surface-variant/60 uppercase tracking-tight">{alloc.batchId?.Category || 'Livestock'}</p>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-surface-container-low">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">Quantity</p>
                                        <p className="text-sm font-semibold text-on-surface tabular-nums">{alloc.quantity} Units</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">Dispatch Date</p>
                                        <div className="flex items-center gap-1.5 text-on-surface-variant/60">
                                            <Clock size={12} />
                                            <p className="text-[11px] font-medium">{new Date(alloc.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                    variant="primary" 
                                    className="w-full mt-8 bg-primary shadow-lg shadow-primary/20"
                                    onClick={() => handleReceive(alloc)}
                                    isLoading={loading}
                                    icon={Download}
                                >
                                    Acknowledge Receipt
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Historical Log Section */}
            <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText size={20} className="text-on-surface-variant/40" />
                        <h2 className="text-xl font-semibold text-on-surface font-headline">Receiving History</h2>
                    </div>
                    <div className="relative group w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={14} />
                        <input 
                            className="w-full bg-surface-container-low border-none rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none" 
                            placeholder="Search logs..." 
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
                                <th className="px-8 py-5">Quantity</th>
                                <th className="px-8 py-5">Received At</th>
                                <th className="px-8 py-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {received.map((alloc, i) => (
                                <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center font-medium text-[10px] text-on-surface-variant">
                                                #{alloc.batchId?.BatchNum}
                                            </div>
                                            <span className="font-medium text-on-surface text-sm">{alloc.batchId?.Category || 'Standard Batch'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-on-surface tabular-nums">{alloc.receivedAnimals || alloc.quantity}</td>
                                    <td className="px-8 py-5 text-on-surface-variant/60 text-xs font-medium">{new Date(alloc.updatedAt).toLocaleString()}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 text-primary">
                                            <CheckCircle2 size={14} />
                                            <span className="text-[10px] font-semibold uppercase tracking-widest">Inventory Linked</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {received.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-10 text-center text-on-surface-variant/40 text-sm">
                                        No matching logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ReceiveLivestock
