// src/pages/admin/Slaughter.jsx
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Download } from 'lucide-react'
import { fetchSlaughterRecords } from '../../store/slices/slaughterSlice'
import { fetchBranches } from '../../store/slices/branchSlice'
import { exportToCSV } from '../../utils/exportUtils'
import Button from '../../components/common/Button'

const Slaughter = () => {
    const dispatch = useDispatch()
    const { slaughters, loading } = useSelector(state => state.slaughter)
    const { branches } = useSelector(state => state.branch)
    const [selectedBranch, setSelectedBranch] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        dispatch(fetchBranches())
    }, [dispatch])

    useEffect(() => {
        const branchId = selectedBranch !== 'all' ? selectedBranch : undefined
        dispatch(fetchSlaughterRecords(branchId))
    }, [dispatch, selectedBranch])

    const normalizedSearch = searchTerm.trim().toLowerCase()
    const filtered = useMemo(() => {
        if (!slaughters) return []
        return slaughters.filter((record) => {
            if (!normalizedSearch) return true
            const batchNum = record.batchId?.BatchNum?.toString().toLowerCase() || ''
            const category = record.batchId?.Category?.toLowerCase() || ''
            const staff = record.staffId?.username?.toLowerCase() || ''
            const branch = record.branchId?.name?.toLowerCase() || ''
            return batchNum.includes(normalizedSearch) || category.includes(normalizedSearch) || staff.includes(normalizedSearch) || branch.includes(normalizedSearch)
        })
    }, [slaughters, normalizedSearch])

    const handleExport = () => {
        if (!filtered.length) return
        const exportData = filtered.map((record) => ({
            Date: new Date(record.createdAt).toLocaleDateString(),
            Branch: record.branchId?.name || 'N/A',
            Batch: record.batchId?.BatchNum || 'N/A',
            Category: record.batchId?.Category || 'N/A',
            Count: record.count || 0,
            MeatKg: record.meatWeight || 0,
            Skins: record.skinsCount || 0,
            Paye: record.payeCount || 0,
            Staff: record.staffId?.username || 'N/A'
        }))
        exportToCSV(exportData, 'Slaughter_Log')
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">Slaughter Records</h1>
                    <p className="text-on-surface-variant text-sm font-medium mt-0.5">Track processing entries across all branches.</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative">
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="bg-white border border-outline-variant/30 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/10 appearance-none pr-10 cursor-pointer transition-all"
                        >
                            <option value="all">All Branches</option>
                            {branches?.map((b) => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <Button variant="primary" icon={Download} size="sm" onClick={handleExport}>Export CSV</Button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-surface-container-low flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-on-surface font-headline">History & Logs</h2>
                    <div className="relative group w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={14} />
                        <input
                            className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none"
                            placeholder="Search by batch, branch, or staff..."
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
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Branch</th>
                                <th className="px-8 py-5">Batch</th>
                                <th className="px-8 py-5 text-center">Animals</th>
                                <th className="px-8 py-5 text-center">Meat (kg)</th>
                                <th className="px-8 py-5 text-center">Skins</th>
                                <th className="px-8 py-5 text-center">Paye</th>
                                <th className="px-8 py-5">Staff</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {filtered.map((record) => (
                                <tr key={record._id} className="hover:bg-surface-container-low/30 transition-colors">
                                    <td className="px-8 py-5 text-sm text-on-surface tabular-nums">
                                        {new Date(record.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-on-surface">
                                        {record.branchId?.name || 'N/A'}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-on-surface">#{record.batchId?.BatchNum || 'N/A'}</span>
                                            <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{record.batchId?.Category || 'Standard'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center tabular-nums text-on-surface font-semibold">{record.count || 0}</td>
                                    <td className="px-8 py-5 text-center tabular-nums text-on-surface font-semibold">{record.meatWeight || 0}</td>
                                    <td className="px-8 py-5 text-center tabular-nums text-on-surface font-semibold">{record.skinsCount || 0}</td>
                                    <td className="px-8 py-5 text-center tabular-nums text-on-surface font-semibold">{record.payeCount || 0}</td>
                                    <td className="px-8 py-5 text-sm font-medium text-on-surface">
                                        {record.staffId?.username || 'Unknown'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {(!filtered || filtered.length === 0) && (
                    <div className="py-20 text-center opacity-40">
                        <p className="text-lg font-semibold text-on-surface font-headline">No slaughter records found</p>
                        <p className="text-sm text-on-surface-variant mt-1">{loading ? 'Loading data...' : 'Adjust filters or search criteria.'}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Slaughter
