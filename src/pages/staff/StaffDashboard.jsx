import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchBranchStats } from '../../store/slices/dashboardSlice'

import {
    LayoutDashboard,
    Zap,
    Scissors,
    Beef,
    Activity,
    ChevronRight,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    Play,
    Award,
    Box,
    Layers
} from 'lucide-react'
import Button from '../../components/common/Button'

import { formatNumber } from '../../utils/numberUtils'

const StaffDashboard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { stats, loading } = useSelector(state => state.dashboard)

    useEffect(() => {
        dispatch(fetchBranchStats())

        // Polling for real-time feel (every 30 seconds)
        const interval = setInterval(() => {
            dispatch(fetchBranchStats())
        }, 30000)

        return () => clearInterval(interval)
    }, [dispatch])


    const myStats = [
        {
            label: 'Today\'s Yield',
            value: stats?.personalSlaughtered || 0,
            unit: 'Units',
            icon: Scissors,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'Meat Collected',
            value: stats?.personalMeatWeight || 0,
            unit: 'kg',
            icon: Beef,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'Hub Inventory',
            value: stats?.remainingAnimals || 0,
            unit: 'Available',
            icon: Box,
            color: 'text-on-surface',
            bg: 'bg-surface-container-low'
        },
    ]


    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Hero / Welcome Area */}
            <div className="relative bg-white p-10 rounded-[2.5rem] border border-outline-variant/30 shadow-sm overflow-hidden group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />


                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-semibold uppercase tracking-widest">Active Operations • {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Ready for operations?</h1>
                            <p className="text-on-surface-variant font-medium max-w-md">Your contribution to the regional hub is vital. Record your slaughter and processing yields below.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <Button variant="primary" className="shadow-xl shadow-primary/20 px-8" icon={Play} onClick={() => navigate('/staff/quick-entry')}>Quick Entry</Button>
                        </div>
                    </div>


                    <div className="flex flex-col gap-6 w-full md:w-80">
                        {myStats.map((s, i) => (
                            <div key={i} className="p-5 bg-surface-container-low/50 rounded-3xl border border-outline-variant/10 flex items-center gap-5 hover:bg-white transition-colors cursor-default">
                                <div className={`p-3 ${s.bg} ${s.color} rounded-2xl`}>
                                    <s.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">{s.label}</p>
                                    <h4 className="text-xl font-semibold text-on-surface tabular-nums">{loading ? '...' : formatNumber(s.value)} <span className="text-xs font-medium text-on-surface-variant/60">{s.unit}</span></h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expanded Activity History */}
            <div className="bg-white rounded-[2.5rem] border border-outline-variant/30 shadow-sm overflow-hidden animate-slideUp">
                <div className="px-10 py-8 border-b border-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                            <Zap size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-on-surface font-headline">My Recent Activity</h2>
                    </div>
                    <button 
                        onClick={() => navigate('/staff/daily-summary')}
                        className="text-xs font-semibold text-primary uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-70 transition-opacity bg-primary/5 px-6 py-3 rounded-xl border border-primary/10"
                    >
                        Full History <ChevronRight size={16} />
                    </button>
                </div>

                <div className="p-10 space-y-6">
                    {stats?.personalRecentActivities?.map((activity, i) => (
                        <div key={i} className="group p-8 rounded-[2rem] bg-surface-container-low/30 border border-transparent hover:border-outline-variant/30 hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-outline-variant/20 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                                        <CheckCircle2 size={22} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-semibold text-on-surface">Recorded Slaughter of {activity.count} Animals</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest">
                                                <Activity size={12} /> {activity.meatWeight || 0}kg Meat
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest">
                                                <Layers size={12} /> {activity.skinsCount || 0} Skins
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest">
                                                <CheckCircle2 size={12} /> {activity.payeCount || 0} Paye
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-lg font-semibold text-on-surface tabular-nums">{new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="text-[10px] font-medium text-on-surface-variant/40 uppercase tracking-widest px-3 py-1 bg-surface-container-low rounded-lg">Operational Log #{activity._id?.slice(-6)}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!stats?.personalRecentActivities || stats.personalRecentActivities.length === 0) && (
                        <div className="py-24 text-center opacity-40 animate-fadeIn">
                            <Activity size={56} className="mx-auto text-on-surface-variant/20 mb-6" />
                            <h3 className="text-xl font-semibold text-on-surface font-headline">No operational logs for today</h3>
                            <p className="text-sm font-medium text-on-surface-variant mt-2">Start a new session by clicking 'Quick Entry' above.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StaffDashboard
