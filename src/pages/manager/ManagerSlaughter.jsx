import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchSlaughterRecords, updateSlaughter, deleteSlaughter } from '../../store/slices/slaughterSlice'
import { fetchBranchStats } from '../../store/slices/dashboardSlice'
import { exportToCSV } from '../../utils/exportUtils'
import { 
    Scissors, 
    Calendar, 
    Search, 
    Filter, 
    ArrowRight, 
    CheckCircle2, 
    AlertCircle,
    Info,
    History,
    FileText,
    Zap,
    Scale,
    Beef,
    Layers,
    Edit3,
    Trash2
} from 'lucide-react'
import Button from '../../components/common/Button'
import SlidePanel from '../../components/common/SlidePanel'
import Input from '../../components/common/Input'
import { formatNumber } from '../../utils/numberUtils'

const ManagerSlaughter = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { slaughters, loading, error } = useSelector(state => state.slaughter)

    const { stats } = useSelector(state => state.dashboard)
    const [searchTerm, setSearchTerm] = useState('')
    
    // Edit Modal State
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState(null)
    const [editForm, setEditForm] = useState({
        count: '',
        meatWeight: '',
        skinsCount: '',
        payeCount: ''
    })

    useEffect(() => {
        dispatch(fetchSlaughterRecords())
        dispatch(fetchBranchStats())
    }, [dispatch])

    const normalizedSearch = searchTerm.trim().toLowerCase()
    const filtered = slaughters?.filter(r => {
        if (!normalizedSearch) return true
        const batchNum = r.batchId?.BatchNum?.toString().toLowerCase() || ''
        const staffName = r.staffId?.username?.toLowerCase() || ''
        const branchName = r.branchId?.name?.toLowerCase() || ''
        return batchNum.includes(normalizedSearch) || staffName.includes(normalizedSearch) || branchName.includes(normalizedSearch)
    })

    const handleEdit = (record) => {
        setEditingRecord(record)
        setEditForm({
            count: record.count,
            meatWeight: record.meatWeight,
            skinsCount: record.skinsCount,
            payeCount: record.payeCount
        })
        setIsEditOpen(true)
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        const res = await dispatch(updateSlaughter({
            id: editingRecord._id,
            data: {
                count: Number(editForm.count),
                meatWeight: Number(editForm.meatWeight),
                skinsCount: Number(editForm.skinsCount),
                payeCount: Number(editForm.payeCount)
            }
        }))

        if (res.meta.requestStatus === 'fulfilled') {
            setIsEditOpen(false)
            dispatch(fetchSlaughterRecords())
            dispatch(fetchBranchStats())
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record? This will adjust inventory stocks.')) {
            const res = await dispatch(deleteSlaughter(id))
            if (res.meta.requestStatus === 'fulfilled') {
                dispatch(fetchBranchStats())
            }
        }
    }

    const handleExport = () => {
        if (!filtered?.length) return;
        const data = filtered.map((record) => ({
            Batch: record.batchId?.BatchNum || 'N/A',
            Category: record.batchId?.Category || 'N/A',
            Staff: record.staffId?.username || 'N/A',
            Count: record.count || 0,
            MeatKg: record.meatWeight || 0,
            Skins: record.skinsCount || 0,
            Paye: record.payeCount || 0,
            Date: new Date(record.createdAt).toISOString()
        }));
        exportToCSV(data, 'slaughter_records');
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Operational Records</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Review and manage daily slaughter and processing entries.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" icon={FileText} size="sm" onClick={handleExport}>Export CSV</Button>
                    <Button variant="primary" icon={Zap} size="sm" onClick={() => navigate('/manager/inventory')}>Inventory View</Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Scissors size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Animals Slaughtered</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">{stats?.totalSlaughtered || 0}</h3>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight">Units (Live Weight)</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Scale size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Current Meat Stock</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">{formatNumber(stats?.totalMeatInStock || 0)} <span className="text-sm font-semibold text-on-surface-variant">kg</span></h3>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight">Net Yield</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Beef size={22} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Operation Count</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">{filtered?.length || 0}</h3>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight">Total Entries</p>
                    </div>
                </div>
            </div>

            {/* Main Records Table */}
            <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Layers size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-on-surface font-headline">History & Logs</h2>
                    </div>
                    <div className="relative group w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={14} />
                        <input 
                            className="w-full bg-surface-container-low border-none rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none" 
                            placeholder="Search by Batch # or Staff..." 
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
                                <th className="px-8 py-5 text-center">Animals</th>
                                <th className="px-8 py-5 text-center">Meat (kg)</th>
                                <th className="px-8 py-5 text-center">Skins</th>
                                <th className="px-8 py-5 text-center">Paye</th>
                                <th className="px-8 py-5">Staff Member</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {filtered?.map((record, i) => (
                                <tr key={record._id} className="hover:bg-surface-container-low/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center font-medium text-[10px] text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                #{record.batchId?.BatchNum || 'N/A'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-on-surface text-sm leading-none">{record.batchId?.Category || 'Standard'}</p>
                                                <p className="text-[10px] text-on-surface-variant font-medium mt-1 uppercase tracking-wider">{new Date(record.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center tabular-nums text-on-surface font-semibold">{record.count}</td>
                                    <td className="px-8 py-5 text-center tabular-nums text-on-surface font-semibold">{formatNumber(record.meatWeight || 0)}</td>
                                    <td className="px-8 py-5 text-center tabular-nums text-on-surface font-semibold">{formatNumber(record.skinsCount || 0)}</td>
                                    <td className="px-8 py-5 text-center tabular-nums text-on-surface font-semibold">{formatNumber(record.payeCount || 0)}</td>
                                    <td className="px-8 py-5 text-sm font-medium text-on-surface">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center text-[10px] font-semibold text-primary">
                                                {record.staffId?.username?.slice(0, 1).toUpperCase() || 'S'}
                                            </div>
                                            {record.staffId?.username || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(record)}
                                                className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                title="Edit Record"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(record._id)}
                                                className="p-2 text-on-surface-variant/40 hover:text-error hover:bg-error/5 rounded-lg transition-all"
                                                title="Delete Record"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!filtered || filtered.length === 0) && (
                    <div className="py-20 text-center opacity-40">
                        <Scissors size={20} className="mx-auto text-on-surface-variant/20 mb-4" />
                        <p className="text-lg font-semibold text-on-surface font-headline">No operational records found</p>
                        <p className="text-sm text-on-surface-variant mt-1">Adjust filters or search criteria.</p>
                    </div>
                )}
            </div>

            {/* Edit Slide Panel */}
            <SlidePanel
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Update Operation Record"
                description={`Editing record for Batch #${editingRecord?.batchId?.BatchNum}. Changes will automatically adjust branch inventory stocks.`}
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Animals Slaughtered"
                            type="number"
                            icon={Scissors}
                            value={editForm.count}
                            onChange={(e) => setEditForm({ ...editForm, count: e.target.value })}
                            required
                        />
                        <Input
                            label="Meat Weight (KG)"
                            type="number"
                            step="0.01"
                            icon={Scale}
                            value={editForm.meatWeight}
                            onChange={(e) => setEditForm({ ...editForm, meatWeight: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Skins Count"
                            type="number"
                            icon={Layers}
                            value={editForm.skinsCount}
                            onChange={(e) => setEditForm({ ...editForm, skinsCount: e.target.value })}
                            required
                        />
                        <Input
                            label="Paye Count"
                            type="number"
                            icon={Layers}
                            value={editForm.payeCount}
                            onChange={(e) => setEditForm({ ...editForm, payeCount: e.target.value })}
                            required
                        />
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3 items-start">
                        <Info size={16} className="text-primary shrink-0 mt-0.5" />
                        <p className="text-[10px] text-primary/80 font-medium leading-relaxed">
                            Updating these values will recalibrate the branch's total inventory. 
                            Ensure the physical counts match your inputs before submitting.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button 
                            variant="outline" 
                            type="button" 
                            className="flex-1" 
                            onClick={() => setIsEditOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="flex-1"
                            isLoading={loading}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </SlidePanel>
        </div>
    )
}

export default ManagerSlaughter
