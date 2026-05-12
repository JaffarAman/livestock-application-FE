import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAdminStats } from '../../store/slices/dashboardSlice'
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
    Download,
    ChevronDown
} from 'lucide-react'
import Button from '../../components/common/Button'
import { exportToCSV } from '../../utils/exportUtils'

import { formatNumber } from '../../utils/numberUtils'

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { stats, loading } = useSelector(state => state.dashboard)
    const [timeRange, setTimeRange] = useState('Today')

    useEffect(() => {
        dispatch(fetchAdminStats(timeRange))
    }, [dispatch, timeRange])

    const kpis = [
        { 
            label: 'Network Inventory', 
            value: stats?.warehouse?.totalAnimalsInSystem || 0, 
            unit: 'Livestock',
            icon: Box, 
            trend: '+12.5%', 
            trendUp: true,
            color: 'text-primary',
            bg: 'bg-primary/10',
            path: '/admin/reports'
        },
        { 
            label: 'Active Processing', 
            value: stats?.globalInventory?.totalSlaughtered || 0, 
            unit: 'Operations',
            icon: Beef, 
            trend: '+4.2%', 
            trendUp: true,
            color: 'text-primary',
            bg: 'bg-primary/10',
            path: '/admin/reports'
        },
        { 
            label: 'Regional Branches', 
            value: stats?.branchWiseReport?.length || 0, 
            unit: 'Active',
            icon: MapPin, 
            trend: 'Stable', 
            trendUp: true,
            color: 'text-primary',
            bg: 'bg-primary/10',
            path: '/admin/branches'
        },
        { 
            label: 'Team Capacity', 
            value: stats?.totalUsers || 0, 
            unit: 'Personnel',
            icon: Users, 
            trend: '+2', 
            trendUp: true,
            color: 'text-on-surface',
            bg: 'bg-surface-container-low',
            path: '/admin/users'
        },
    ]

    const ranges = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Year']

    const handleExport = () => {
        if (!stats) return;

        const summaryRows = [
            { Section: 'Warehouse', Metric: 'Total Animals in System', Value: stats?.warehouse?.totalAnimalsInSystem || 0, Unit: 'Livestock' },
            { Section: 'Warehouse', Metric: 'Available in Main Stock', Value: stats?.warehouse?.availableInMainStock || 0, Unit: 'Livestock' },
            { Section: 'Warehouse', Metric: 'Total Sent to Branches', Value: stats?.warehouse?.totalSentToBranches || 0, Unit: 'Livestock' },
            { Section: 'Network', Metric: 'Total Slaughtered', Value: stats?.globalInventory?.totalSlaughtered || 0, Unit: 'Operations' },
            { Section: 'Network', Metric: 'Total Meat in Stock', Value: stats?.globalInventory?.totalMeatInStock || 0, Unit: 'kg' },
            { Section: 'Network', Metric: 'Total Skins in Stock', Value: stats?.globalInventory?.totalSkinsInStock || 0, Unit: 'Units' },
            { Section: 'Network', Metric: 'Total Paye in Stock', Value: stats?.globalInventory?.totalPayeInStock || 0, Unit: 'Units' }
        ];

        const branchRows = (stats?.branchWiseReport || []).map((branch) => ({
            Section: 'Branch',
            Metric: 'Inventory Snapshot',
            Branch: branch.branchName,
            CowReceived: branch.cowReceived || 0,
            GoatReceived: branch.goatReceived || 0,
            CowSlaughtered: branch.cowSlaughtered || 0,
            GoatSlaughtered: branch.goatSlaughtered || 0,
            MeatStock: branch.currentMeatStock || 0,
            SkinStock: branch.currentSkinStock || 0,
            PayeStock: branch.currentPayeStock || 0
        }));

        const exportData = [...summaryRows, ...branchRows];

        exportToCSV(exportData, `Admin_Dashboard_${timeRange.replace(/\s+/g, '_')}`, [
            'Section',
            'Metric',
            'Value',
            'Unit',
            'Branch',
            'CowReceived',
            'GoatReceived',
            'CowSlaughtered',
            'GoatSlaughtered',
            'MeatStock',
            'SkinStock',
            'PayeStock'
        ]);
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Top Bar / Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Intelligence Dashboard</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Real-time oversight of the regional livestock network.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <select 
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/10 appearance-none pr-10 cursor-pointer transition-all"
                        >
                            {ranges.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 pointer-events-none" />
                    </div>
                    <Button variant="primary" icon={Download} size="sm" onClick={handleExport}>Export Report</Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div 
                        key={i} 
                        onClick={() => navigate(kpi.path)}
                        className="bg-white p-8 rounded-3xl border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 group hover:shadow-xl hover:shadow-primary/5 cursor-pointer active:scale-95"
                    >
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
                {/* Branch Performance */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-surface-container-low flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity size={20} className="text-primary" />
                            <h2 className="text-xl font-semibold text-on-surface font-headline">Regional Branch Throughput</h2>
                        </div>
                        <button 
                            onClick={() => navigate('/admin/reports')}
                            className="text-xs font-semibold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                        >
                            View All <ChevronRight size={14} />
                        </button>
                    </div>
                    <div className="p-8">
                        <div className="space-y-8">
                            {stats?.branchWiseReport?.slice(0, 5).map((branch, i) => (
                                <div key={i} className="space-y-3 cursor-pointer group" onClick={() => navigate('/admin/reports')}>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{branch.branchName}</p>
                                            <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-tight">Active Branch</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-on-surface tabular-nums">{formatNumber(branch.currentMeatStock || 0)} kg</p>
                                            <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-tight">Meat Stock</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary rounded-full transition-all duration-1000" 
                                            style={{ width: `${Math.min(100, (branch.currentMeatStock || 0) / 10)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {(!stats?.branchWiseReport || stats.branchWiseReport.length === 0) && (
                                <div className="py-10 text-center opacity-40">
                                    <Truck size={20} className="mx-auto text-on-surface-variant/20 mb-3" />
                                    <p className="text-sm font-medium text-on-surface-variant">Waiting for operational data...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Intelligence */}
                <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-surface-container-low flex items-center gap-3">
                        <TrendingUp size={20} className="text-primary" />
                        <h2 className="text-xl font-semibold text-on-surface font-headline">Recent Operations</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {stats?.recentOperations?.map((op, i) => (
                            <div 
                                key={i} 
                                onClick={() => navigate('/admin/reports')}
                                className="p-4 rounded-2xl bg-surface-container-low/50 border border-transparent hover:border-outline-variant/30 hover:bg-white transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-outline-variant/20 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                                        <Layers size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-on-surface truncate">Slaughter of {op.count} Animals</p>
                                        <p className="text-[10px] text-on-surface-variant/60 font-medium">{new Date(op.date).toLocaleDateString()} • {op.branchId?.name}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-on-surface-variant/40" />
                                </div>
                            </div>
                        ))}
                        {(!stats?.recentOperations || stats.recentOperations.length === 0) && (
                            <div className="py-20 text-center opacity-40">
                                <Activity size={20} className="mx-auto text-on-surface-variant/20 mb-3" />
                                <p className="text-sm font-medium text-on-surface-variant">No recent activity.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-surface-container-low/30 border-t border-surface-container-low">
                        <Button 
                            variant="outline" 
                            className="w-full text-[10px] uppercase tracking-widest font-semibold" 
                            size="sm"
                            onClick={() => navigate('/admin/allocations-list')}
                        >
                            Open Operation Log
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
