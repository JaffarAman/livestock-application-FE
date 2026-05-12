// src/pages/manager/BranchInventory.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchBranchStats } from '../../store/slices/dashboardSlice'
import { 
    Package, 
    Beef, 
    Layers, 
    ArrowRight, 
    ChevronRight, 
    Search, 
    Filter,
    Activity,
    Info,
    Warehouse,
    Tag,
    Scale,
    Box
} from 'lucide-react'
import Button from '../../components/common/Button'
import { formatNumber } from '../../utils/numberUtils'

const BranchInventory = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { stats, loading } = useSelector(state => state.dashboard)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        dispatch(fetchBranchStats())
    }, [dispatch])

    const livestock = (stats?.inventoryDetails || []).filter(item => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        const batchNum = item.batchId?.BatchNum?.toString().toLowerCase() || '';
        const category = item.batchId?.Category?.toLowerCase() || '';
        return batchNum.includes(search) || category.includes(search);
    })
    
    const handleViewProcessing = () => {
        navigate('/manager/processing-records')
    }
    
    return (
        <div className="space-y-12 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Branch Ledger</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Real-time breakdown of animal stock and processed meat reserves.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="primary" icon={ChevronRight} size="sm" onClick={handleViewProcessing}>View Processing Records</Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Box size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Live Inventory</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">{stats?.remainingAnimals || 0}</h3>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight">Active Units</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Beef size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Meat Reserves</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">{formatNumber(stats?.meatStock || 0)} <span className="text-sm font-semibold text-on-surface-variant">kg</span></h3>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight">Post-Processing</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Activity size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Yield Conversion</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">{formatNumber(14.2)} <span className="text-sm font-semibold text-on-surface-variant">avg</span></h3>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight">kg per unit</p>
                    </div>
                </div>
            </div>

            {/* Inventory Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Batches */}
                <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-surface-container-low flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Layers size={20} className="text-primary" />
                            <h2 className="text-xl font-semibold text-on-surface font-headline">Batch Inventory</h2>
                        </div>
                        <div className="relative group w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={14} />
                            <input 
                                className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-semibold uppercase tracking-widest focus:ring-2 focus:ring-primary/10 outline-none" 
                                placeholder="Find batch..." 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                        {livestock.map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-surface-container-low/30 border border-transparent hover:border-outline-variant/30 hover:bg-white transition-all group cursor-pointer">
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-14 h-14 rounded-xl bg-white border border-outline-variant/20 flex items-center justify-center font-semibold text-[11px] text-on-surface-variant group-hover:text-primary transition-colors tabular-nums shrink-0">
                                            <span className="truncate">#{item.batchId?.BatchNum || 'N/A'}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-on-surface capitalize truncate">{item.batchId?.Category || 'Standard'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Tag size={10} className="text-on-surface-variant/40" />
                                                <p className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-widest">Active Deployment</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right min-w-[110px] shrink-0">
                                        <div className="flex items-baseline justify-end gap-1.5">
                                            <span className="text-lg font-semibold text-on-surface tabular-nums">{item.receivedAnimals || item.quantity || 0}</span>
                                            <span className="text-[10px] font-medium text-on-surface-variant/50 uppercase tracking-widest">Units</span>
                                        </div>
                                        <div className="h-1 w-28 bg-surface-container-low rounded-full mt-3 overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {livestock.length === 0 && (
                            <div className="py-20 text-center opacity-40">
                                <Package size={20} className="mx-auto text-on-surface-variant/20 mb-3" />
                                <p className="text-sm font-medium text-on-surface-variant">No matching batches found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Processed Meat Stock */}
                <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-surface-container-low flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Beef size={20} className="text-primary" />
                            <h2 className="text-xl font-semibold text-on-surface font-headline">Meat Inventory</h2>
                        </div>
                        <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-widest rounded-full">
                            Ready for Distribution
                        </span>
                    </div>
                    <div className="p-8 space-y-10">
                        <div className="bg-surface-container-low/30 rounded-3xl p-8 border border-dashed border-outline-variant/50 relative overflow-hidden">
                             <div className="absolute -right-6 -bottom-6 opacity-5 text-on-surface">
                                <Beef size={120} />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-outline-variant/10">
                                            <Beef size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-on-surface">Total Meat Weight</p>
                                            <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">Aggregate across all batches</p>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-semibold text-on-surface tabular-nums">{formatNumber(stats?.meatStock || 0)} <span className="text-sm font-medium text-on-surface-variant">kg</span></h4>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-white rounded-2xl border border-outline-variant/10">
                                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest mb-1">Byproduct: Paye</p>
                                        <p className="text-xl font-semibold text-on-surface tabular-nums">{stats?.payeStock || 0} <span className="text-[10px] font-medium text-on-surface-variant">Units</span></p>
                                    </div>
                                    <div className="p-5 bg-white rounded-2xl border border-outline-variant/10">
                                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest mb-1">Byproduct: Skins</p>
                                        <p className="text-xl font-semibold text-on-surface tabular-nums">{stats?.skinStock || 0} <span className="text-[10px] font-medium text-on-surface-variant">Units</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-surface-container-low/30 rounded-2xl border border-outline-variant/20 flex gap-4 items-start">
                            <Info size={20} className="text-primary shrink-0 mt-0.5" />
                            <p className="text-[10px] text-on-surface-variant leading-relaxed">
                                Meat stock values are automatically updated upon field staff entry of yield records. 
                                Discrepancies should be reported to the central audit team immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BranchInventory
