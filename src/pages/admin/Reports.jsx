// src/pages/admin/Reports.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchReportData } from '../../store/slices/reportSlice'
import { fetchBranches } from '../../store/slices/branchSlice'
import { exportToCSV } from '../../utils/exportUtils'
import { 
    BarChart3, 
    Download, 
    Table, 
    FileText,
    AlertCircle,
    CheckCircle2
} from 'lucide-react'
import Button from '../../components/common/Button'
import FilterBar from '../../components/common/FilterBar'
import { formatNumber } from '../../utils/numberUtils'

const schema = z.object({
  reportType: z.enum(['allocations', 'batches', 'inventory', 'slaughter', 'processing']),
  dateRange: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  branchFilter: z.string().optional()
}).superRefine((data, ctx) => {
    if (data.dateRange === 'custom') {
        if (!data.startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Start date is required",
                path: ['startDate']
            });
        }
        if (!data.endDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "End date is required",
                path: ['endDate']
            });
        }
    }
});

const Reports = () => {
    const dispatch = useDispatch()
    const { reportData, loading, error } = useSelector(state => state.report)
    const { branches } = useSelector(state => state.branch)

    const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            reportType: 'inventory',
            dateRange: 'weekly',
            startDate: '',
            endDate: '',
            branchFilter: ''
        }
    });

    const reportType = watch('reportType');

    useEffect(() => {
        dispatch(fetchBranches())
    }, [dispatch])

    useEffect(() => {
        const values = getValues();
        if (values.dateRange === 'custom' && (!values.startDate || !values.endDate)) {
            return;
        }
        const params = {
            type: values.reportType,
            range: values.dateRange,
            startDate: values.startDate,
            endDate: values.endDate,
            branch: values.branchFilter || ''
        }
        dispatch(fetchReportData(params))
    }, [dispatch, getValues])

    const onSubmit = (data) => {
        const params = {
            type: data.reportType,
            range: data.dateRange,
            startDate: data.startDate,
            endDate: data.endDate,
            branch: data.branchFilter || ''
        }
        dispatch(fetchReportData(params))
    }

    const handleExport = () => {
        if (!reportData || reportData.length === 0) return
        
        const exportData = reportData.map(row => {
            const cleanRow = {};
            Object.entries(row).forEach(([key, value]) => {
                if (key !== '_id' && key !== '__v') {
                    const label = key.replace(/([A-Z])/g, ' $1').trim();
                    cleanRow[label] = typeof value === 'object' ? (value?.name || JSON.stringify(value)) : value;
                }
            });
            return cleanRow;
        });

        exportToCSV(exportData, `${reportType}_report`)
    }

    const stats = [
        { label: 'Total Volume', value: reportData?.length || 0, icon: BarChart3, color: 'text-primary' },
        { label: 'Rows Loaded', value: reportData?.length || 0, icon: CheckCircle2, color: 'text-secondary' },
        { label: 'Errors', value: error ? 1 : 0, icon: AlertCircle, color: 'text-error' },
    ]

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden relative group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-on-surface font-headline tracking-tight">System Reports</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Deep-dive analysis of operational logs and inventory history.</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto relative z-10">
                    <Button 
                        variant="primary" 
                        onClick={handleExport}
                        icon={Download}
                        disabled={!reportData || reportData.length === 0}
                        className="flex-1 sm:flex-none shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                    >
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* dynamic Filter Bar */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <FilterBar 
                    register={register}
                    watch={watch}
                    errors={errors}
                    branches={branches}
                />
            </form>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-outline-variant/30 flex items-center gap-5">
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

            {/* Report Content */}
            <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                <div className="px-8 py-6 border-b border-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Table size={20} className="text-primary" />
                            <h2 className="text-xl font-semibold text-on-surface font-headline">{reportType} records</h2>
                    </div>
                    {reportData?.length > 0 && (
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-widest rounded-full">
                            {reportData.length} Records Found
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-sm font-medium text-on-surface-variant/40 uppercase tracking-[0.2em]">Synthesizing Report...</p>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 px-8 text-center">
                        <div className="p-4 bg-error/5 text-error rounded-full">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-on-surface font-headline">Report Generation Failed</p>
                            <p className="text-sm text-on-surface-variant mt-1">{error}</p>
                        </div>
                        <Button variant="outline" size="md" onClick={handleSubmit(onSubmit)}>Retry Analysis</Button>
                    </div>
                ) : !reportData || reportData.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 px-8 text-center opacity-40">
                        <FileText size={20} className="text-on-surface-variant/20" />
                        <div>
                            <p className="text-lg font-semibold text-on-surface font-headline">No Data Available</p>
                            <p className="text-sm text-on-surface-variant mt-1">Adjust filters to broaden your analysis scope.</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-low/30 text-on-surface-variant/60 text-[10px] font-semibold uppercase tracking-[0.15em]">
                                <tr>
                                    {Object.keys(reportData[0]).filter(k => k !== '_id' && k !== '__v').map(key => (
                                        <th key={key} className="px-8 py-5 whitespace-nowrap">{key.replace(/([A-Z])/g, ' $1')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-container-low text-sm font-medium">
                                {reportData.map((row, i) => (
                                    <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
                                        {Object.entries(row).filter(([k]) => k !== '_id' && k !== '__v').map(([k, v], j) => (
                                            <td key={j} className="px-8 py-5 whitespace-nowrap text-on-surface-variant">
                                                {typeof v === 'object' ? (v?.name || JSON.stringify(v)) : formatNumber(v)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Reports
