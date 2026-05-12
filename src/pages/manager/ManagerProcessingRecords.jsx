import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSlaughterRecords, updateSlaughter, deleteSlaughter } from '../../store/slices/slaughterSlice';
import { fetchBranchStats } from '../../store/slices/dashboardSlice';
import { exportToCSV } from '../../utils/exportUtils';
import { Download, Edit3, Trash2, Calendar, FileText, Filter, X, AlertTriangle, Scale, Layers, Beef } from 'lucide-react';
import Button from '../../components/common/Button';
import { formatNumber } from '../../utils/numberUtils';

const ManagerProcessingRecords = () => {
    const dispatch = useDispatch();
    const { slaughters, loading, error } = useSelector(state => state.slaughter);
    const { stats } = useSelector(state => state.dashboard);

    const [searchTerm, setSearchTerm] = useState('');
    const [range, setRange] = useState('daily');
    const [editModal, setEditModal] = useState(null);
    const [editData, setEditData] = useState({ meatWeight: '', skinsCount: '', payeCount: '' });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        dispatch(fetchSlaughterRecords());
        dispatch(fetchBranchStats());
    }, [dispatch]);

    const handleExport = () => {
        if (!slaughters || slaughters.length === 0) return;
        const exportData = filtered.map(p => ({
            'Date': new Date(p.createdAt).toLocaleDateString(),
            'Batch #': p.batchId?.BatchNum || 'N/A',
            'Category': p.batchId?.Category || 'N/A',
            'Meat Weight (kg)': p.meatWeight,
            'Skins (Khal)': p.skinsCount,
            'Paye Sets': p.payeCount,
            'Staff': p.staffId?.username || 'N/A'
        }));
        exportToCSV(exportData, 'Branch_Processing_Registry');
    };

    // Date/Search filter
    const filtered = useMemo(() => {
        if (!slaughters) return [];
        const now = new Date();
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);

        if (range === 'daily') {
            // Already set to start of today
        } else if (range === 'weekly') {
            start.setDate(start.getDate() - start.getDay());
        } else if (range === 'monthly') {
            start.setDate(1);
        } else {
            start.setFullYear(2000); // All time
        }

        const lowerSearch = searchTerm.toLowerCase();

        return slaughters.filter(p => {
            const pDate = new Date(p.createdAt);
            const matchesRange = range === 'all' || pDate >= start;
            
            const batchNum = p.batchId?.BatchNum?.toString() || '';
            const staffName = p.staffId?.username?.toLowerCase() || '';
            
            const matchesSearch = batchNum.includes(searchTerm) || staffName.includes(lowerSearch);
            
            return matchesRange && matchesSearch;
        });
    }, [slaughters, range, searchTerm]);

    const handleEdit = (p) => {
        setEditModal(p);
        setEditData({ 
            meatWeight: p.meatWeight, 
            skinsCount: p.skinsCount, 
            payeCount: p.payeCount,
            count: p.count // Keep count for update
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (editModal) {
            const res = await dispatch(updateSlaughter({
                id: editModal._id,
                data: {
                    meatWeight: Number(editData.meatWeight),
                    skinsCount: Number(editData.skinsCount),
                    payeCount: Number(editData.payeCount),
                    count: Number(editData.count)
                }
            }));
            if (res.meta.requestStatus === 'fulfilled') {
                setEditModal(null);
                dispatch(fetchSlaughterRecords());
                dispatch(fetchBranchStats());
            }
        }
    };

    const handleDelete = async () => {
        if (deleteConfirm) {
            const res = await dispatch(deleteSlaughter(deleteConfirm));
            if (res.meta.requestStatus === 'fulfilled') {
                setDeleteConfirm(null);
                dispatch(fetchBranchStats());
            }
        }
    };

    // Stats derived from filtered data
    const totalFilteredMeat = useMemo(() => filtered.reduce((acc, p) => acc + (p.meatWeight || 0), 0), [filtered]);
    const totalFilteredSkins = useMemo(() => filtered.reduce((acc, p) => acc + (p.skinsCount || 0), 0), [filtered]);
    const totalFilteredPaye = useMemo(() => filtered.reduce((acc, p) => acc + (p.payeCount || 0), 0), [filtered]);

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">Processing Records</h1>
                    <p className="text-on-surface-variant font-medium mt-1">View and manage all meat processing entries for your branch.</p>
                </div>
                <Button 
                    variant="outline" 
                    icon={Download} 
                    onClick={handleExport}
                    disabled={!filtered || filtered.length === 0}
                >
                    Export CSV
                </Button>
            </div>

            {/* Stats Cards - Now Dynamic based on Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <Scale size={20} />
                        </div>
                        <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant/60">Total Meat</p>
                    </div>
                    <p className="text-xl font-semibold text-on-surface tabular-nums">{formatNumber(totalFilteredMeat)} <span className="text-sm font-medium text-on-surface-variant">kg</span></p>
                    <p className="text-[10px] text-on-surface-variant/40 mt-2 font-semibold uppercase tracking-widest">In this period</p>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <Layers size={20} />
                        </div>
                        <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant/60">Total Skins</p>
                    </div>
                    <p className="text-xl font-semibold text-on-surface tabular-nums">{totalFilteredSkins}</p>
                    <p className="text-[10px] text-on-surface-variant/40 mt-2 font-semibold uppercase tracking-widest">Hides collected</p>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <Beef size={20} />
                        </div>
                        <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant/60">Total Paye</p>
                    </div>
                    <p className="text-xl font-semibold text-on-surface tabular-nums">{totalFilteredPaye}</p>
                    <p className="text-[10px] text-on-surface-variant/40 mt-2 font-semibold uppercase tracking-widest">Sets collected</p>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-surface-container-low flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <FileText size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-on-surface font-headline">Yield History</h2>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={14} />
                            <input 
                                type="text"
                                placeholder="Search batch or staff..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-surface-container-low border-none rounded-xl py-2 pl-9 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/10"
                            />
                        </div>
                        <select
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="bg-surface-container-low border-none rounded-xl px-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/10"
                        >
                            <option value="daily">Today</option>
                            <option value="weekly">This Week</option>
                            <option value="monthly">This Month</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-low/30">
                                <th className="px-8 py-5 text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-widest">#</th>
                                <th className="px-8 py-5 text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-widest">Slaughter Event</th>
                                <th className="px-8 py-5 text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-widest text-center">Meat (kg)</th>
                                <th className="px-8 py-5 text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-widest text-center">Skins</th>
                                <th className="px-8 py-5 text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-widest text-center">Paye</th>
                                <th className="px-8 py-5 text-[10px] font-semibold text-on-surface-variant/50 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center opacity-40">
                                        <Beef size={20} className="mx-auto text-on-surface-variant/20 mb-4" />
                                        <p className="text-lg font-semibold text-on-surface font-headline">No processing logs found</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p, i) => (
                                    <tr key={p._id} className="hover:bg-surface-container-low/20 transition-colors group">
                                        <td className="px-8 py-5 text-sm font-medium text-on-surface-variant/40 tabular-nums">{i + 1}</td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-medium text-on-surface">{new Date(p.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short' })}</p>
                                            <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-wider">{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center font-medium text-[10px] text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    #{p.batchId?.BatchNum || 'N/A'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-on-surface">{p.count} Animals</p>
                                                    <p className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-widest">Recorded by {p.staffId?.username || 'Staff'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-lg font-semibold text-primary tabular-nums">{formatNumber(p.meatWeight || 0)}</span>
                                            <span className="text-[10px] font-semibold text-on-surface-variant ml-1">kg</span>
                                        </td>
                                        <td className="px-8 py-5 text-center text-lg font-semibold text-on-surface tabular-nums">{formatNumber(p.skinsCount || 0)}</td>
                                        <td className="px-8 py-5 text-center text-lg font-semibold text-on-surface tabular-nums">{formatNumber(p.payeCount || 0)}</td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(p)} className="p-2 rounded-xl hover:bg-primary/10 text-on-surface-variant/40 hover:text-primary transition-all">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button onClick={() => setDeleteConfirm(p._id)} className="p-2 rounded-xl hover:bg-error/10 text-on-surface-variant/40 hover:text-error transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-outline-variant/30">
                        <div className="p-8 border-b border-surface-container-low flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold text-on-surface font-headline">Edit Yield Data</h3>
                                <p className="text-[10px] text-on-surface-variant/50 font-semibold uppercase tracking-widest mt-1">Batch #{editModal.batchId?.BatchNum}</p>
                            </div>
                            <button onClick={() => setEditModal(null)} className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            <div>
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/40 block mb-2 ml-1">Meat Weight (kg)</label>
                                <input type="number" step="0.1" value={editData.meatWeight} onChange={(e) => setEditData({...editData, meatWeight: e.target.value})} className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 font-medium text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/40 block mb-2 ml-1">Skins</label>
                                    <input type="number" value={editData.skinsCount} onChange={(e) => setEditData({...editData, skinsCount: e.target.value, payeCount: Number(e.target.value) * 4})} className="w-full bg-surface-container-low border-none rounded-2xl px-5 py-4 font-medium text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/40 block mb-2 ml-1">Paye (4:1)</label>
                                    <input type="number" value={editData.payeCount} readOnly className="w-full bg-surface-container-low/50 border-none rounded-2xl px-5 py-4 font-medium text-sm outline-none opacity-60" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button variant="outline" type="button" className="flex-1" onClick={() => setEditModal(null)}>Cancel</Button>
                                <Button variant="primary" type="submit" className="flex-1" isLoading={loading}>Save</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 text-center space-y-6 border border-outline-variant/30">
                        <div className="w-20 h-20 bg-error/10 text-error rounded-[2rem] mx-auto flex items-center justify-center">
                            <AlertTriangle size={22} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-on-surface font-headline">Delete Record?</h3>
                            <p className="text-sm text-on-surface-variant font-medium mt-2">This operation will be reversed and branch inventory will be adjusted back.</p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                            <Button variant="primary" className="flex-1 bg-error border-error shadow-error/20" onClick={handleDelete} isLoading={loading}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerProcessingRecords;
