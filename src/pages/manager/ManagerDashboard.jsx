// src/pages/manager/ManagerDashboard.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchBranchStats } from '../../store/slices/dashboardSlice'

import { 
    LayoutDashboard, 
    Box, 
    TrendingUp, 
    Users, 
    Activity, 
    ArrowUpRight, 
    ArrowDownRight,
    MapPin,
    Calendar,
    ChevronRight,
    Search,
    Bell,
    Layers,
    Beef,
    Truck,
    Clock,
    Zap
} from 'lucide-react'
import Button from '../../components/common/Button'

import { formatNumber } from '../../utils/numberUtils'

const ManagerDashboard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { stats, loading } = useSelector(state => state.dashboard)

    useEffect(() => {
        dispatch(fetchBranchStats())
    }, [dispatch])


    const kpis = [
        { 
            label: 'Branch Inventory', 
            value: stats?.remainingAnimals || 0, 
            unit: 'Livestock',
            icon: Box, 
            trend: '+5.2%', 
            trendUp: true,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        { 
            label: 'Total Slaughtered', 
            value: stats?.totalSlaughtered || 0, 
            unit: 'Operations',
            icon: Beef, 
            trend: '+8.1%', 
            trendUp: true,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        { 
            label: 'Meat Stock', 
            value: stats?.meatStock || 0, 
            unit: 'Kilograms',
            icon: Activity, 
            trend: '-2.4%', 
            trendUp: false,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        { 
            label: 'Field Staff', 
            value: stats?.staffCount || 0, 
            unit: 'Active Team',
            icon: Users, 
            trend: 'Online', 
            trendUp: true,
            color: 'text-on-surface',
            bg: 'bg-surface-container-low'
        },
    ]

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Top Bar / Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Branch Operations</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Local performance metrics and real-time distribution tracking.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="primary" icon={Zap} size="sm" onClick={() => navigate('/manager/slaughter')}>Records</Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 group hover:shadow-xl hover:shadow-primary/5">

                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 ${kpi.bg} ${kpi.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                                <kpi.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest ${kpi.trendUp ? 'text-primary' : 'text-error'}`}>
                                {kpi.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {kpi.trend}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em]">{kpi.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-xl font-semibold text-on-surface tabular-nums">{loading ? '...' : formatNumber(kpi.value)}</h3>
                                <span className="text-[10px] font-medium text-on-surface-variant/60 uppercase">{kpi.unit}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Batches */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-surface-container-low flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Box size={20} className="text-primary" />
                            <h2 className="text-xl font-semibold text-on-surface font-headline">Allocated Stock</h2>
                        </div>
                        <button className="text-xs font-semibold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                            Request Batch <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className="p-8">
                        <div className="space-y-8">
                            {stats?.inventoryDetails?.slice(0, 5).map((alloc, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center font-semibold text-xs text-on-surface-variant">#{alloc.batchId?.BatchNum || 'N/A'}</div>
                                            <div>
                                                <p className="text-sm font-semibold text-on-surface">{alloc.batchId?.Category || 'Standard'}</p>
                                                <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-tight">Received {new Date(alloc.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-on-surface tabular-nums">{alloc.receivedAnimals || alloc.quantity} Units</p>
                                            <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-tight">Active Supply</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary rounded-full transition-all duration-1000" 
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {(!stats?.inventoryDetails || stats.inventoryDetails.length === 0) && (
                                <div className="py-20 text-center opacity-40">
                                    <Truck size={20} className="mx-auto text-on-surface-variant/20 mb-3" />
                                    <p className="text-sm font-medium text-on-surface-variant">No active stock allocated.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Staff Activity */}
                <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-surface-container-low flex items-center gap-3">
                        <Activity size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold text-on-surface font-headline">Operation Log</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {stats?.recentActivities?.map((activity, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-surface-container-low/50 border border-transparent hover:border-outline-variant/30 hover:bg-white transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border border-outline-variant/20 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors font-semibold text-[10px]">
                                        {activity.staffId?.username?.slice(0, 2).toUpperCase() || 'FO'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-on-surface truncate">{activity.staffId?.username || 'Staff'}</p>
                                        <p className="text-[10px] text-on-surface-variant/60 font-medium">Slaughtered {activity.count} animals • {new Date(activity.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-on-surface-variant/40" />
                                </div>
                            </div>
                        ))}
                        {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
                            <div className="py-20 text-center opacity-40">
                                <Activity size={20} className="mx-auto text-on-surface-variant/20 mb-3" />
                                <p className="text-sm font-medium text-on-surface-variant">No activity logged today.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-surface-container-low/30 border-t border-surface-container-low">
                        <Button variant="outline" className="w-full text-[10px] uppercase tracking-widest font-semibold" size="sm">
                            Manage Team
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerDashboard
