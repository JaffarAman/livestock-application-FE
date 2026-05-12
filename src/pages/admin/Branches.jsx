import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBranch, fetchBranches, updateBranch, deleteBranch, resetBranchState } from '../../store/slices/branchSlice'
import { exportToCSV } from '../../utils/exportUtils'
import { useNavigate } from 'react-router-dom'
import { 
    Building2, 
    Users, 
    ChevronRight, 
    MapPin, 
    Edit3, 
    Trash2, 
    Zap, 
    Target, 
    Activity, 
    CheckCircle2, 
    Download, 
    Layers, 
    Search,
    Plus 
} from 'lucide-react'
import Button from '../../components/common/Button'
import SlidePanel from '../../components/common/SlidePanel'
import Input from '../../components/common/Input'

const schema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters").max(80, "Max 80 characters"),
  location: z.string().min(2, "Location is required").max(120, "Max 120 characters"),
  capacity: z.number({ invalid_type_error: "Must be a number" }).int("Must be an integer").min(1, "Capacity must be at least 1").default(500)
});

const Branches = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, success, branches: liveBranches } = useSelector(state => state.branch)
    
    const [showDrawer, setShowDrawer] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editingBranchId, setEditingBranchId] = useState(null)
    const [statusFilter, setStatusFilter] = useState('All Branches')
    const [searchTerm, setSearchTerm] = useState('')

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            location: '',
            capacity: 500
        }
    })

    useEffect(() => {
        dispatch(fetchBranches())
    }, [dispatch])

    useEffect(() => {
        if (success) {
            setShowDrawer(false)
            setIsEdit(false)
            setEditingBranchId(null)
            reset({ name: '', location: '', capacity: 500 })
            dispatch(resetBranchState())
            dispatch(fetchBranches())
        }
    }, [success, dispatch, reset])

    const onSubmit = async (data) => {
        const branchData = { ...data }
        if (isEdit) {
            dispatch(updateBranch({ id: editingBranchId, branchData }))
        } else {
            dispatch(createBranch(branchData))
        }
    }

    const handleEdit = (branch) => {
        setIsEdit(true)
        setEditingBranchId(branch._id)
        reset({
            name: branch.name,
            location: branch.location,
            capacity: branch.capacity || 500
        })
        setShowDrawer(true)
    }

    const handleAddNew = () => {
        setIsEdit(false)
        setEditingBranchId(null)
        reset({ name: '', location: '', capacity: 500 })
        setShowDrawer(true)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            dispatch(deleteBranch(id))
        }
    }

    const handleViewDetails = (id) => {
        navigate(`/admin/branches/${id}`)
    }

    const branchesList = liveBranches?.map((b) => ({
        ...b,
        code: `${b.name.substring(0, 2).toUpperCase()}-${(b._id).substring(18, 24).toUpperCase()}`,
        status: 'Active',
        capacity: b.capacity || 500,
        manager: b.manager || 'Unassigned'
    })) || [];

    const filtered = branchesList.filter(b => {
        const matchesStatus = statusFilter === 'All Branches' || b.status === statusFilter;
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             b.code.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleExport = () => {
        const exportData = filtered.map(b => ({
            Name: b.name,
            Code: b.code,
            Location: b.location,
            Capacity: b.capacity,
            Status: b.status
        }));
        exportToCSV(exportData, 'Branches_List');
    };

    const totalCapacity = branchesList.reduce((acc, curr) => acc + (curr.capacity || 0), 0);

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden relative group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-on-surface font-headline tracking-tight">Branch Management</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Configure and monitor regional processing branches.</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto relative z-10">
                    <Button 
                        variant="outline" 
                        icon={Download} 
                        onClick={handleExport}
                        className="flex-1 sm:flex-none bg-white/50 backdrop-blur-sm"
                    >
                        Export List
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleAddNew}
                        icon={Plus}
                        className="flex-1 sm:flex-none shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                    >
                        Register New Branch
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Total Branches</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">{branchesList.length}</h3>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-outline-variant/30 flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Active Branches</p>
                        <h3 className="text-xl font-semibold text-on-surface tabular-nums">{branchesList.filter(b => b.status === 'Active').length}</h3>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-primary/5 p-8 rounded-3xl border border-primary/10 flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="text-lg font-semibold text-on-surface font-headline">Network Capacity</h4>
                        <p className="text-on-surface-variant text-sm mt-1 max-w-xs">Total processing capacity of {totalCapacity.toLocaleString()} units across all branches.</p>
                    </div>
                    <Activity size={56} className="absolute -right-4 -bottom-4 text-primary/5 select-none" />
                </div>
            </div>

            {/* Filter & Search Area */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-2 bg-white border border-outline-variant/30 rounded-2xl p-1.5">
                    {['All Branches', 'Active', 'Maintenance'].map(r => (
                        <button 
                            key={r} 
                            onClick={() => setStatusFilter(r)} 
                            className={`px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all ${statusFilter === r ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant/60 hover:text-primary hover:bg-primary/5'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
                
                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search branches by name or location..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-outline-variant/30 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Branch Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered?.map((branch, i) => (
                    <div key={i} className="group bg-white p-8 rounded-3xl border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                        
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-primary flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <Building2 size={22} />
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleEdit(branch)} className="p-2 text-on-surface-variant/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                                    <Edit3 size={18} />
                                </button>
                                <button onClick={() => handleDelete(branch._id)} className="p-2 text-on-surface-variant/40 hover:text-error hover:bg-error/5 rounded-xl transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1 mb-8">
                            <h3 className="text-xl font-semibold text-on-surface font-headline">{branch.name}</h3>
                            <div className="flex items-center gap-1.5 text-on-surface-variant/60">
                                <MapPin size={14} />
                                <p className="text-xs font-medium uppercase tracking-tight">{branch.location}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-surface-container-low">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest leading-none">Branch Manager</p>
                                        <p className="text-sm font-medium text-on-surface mt-1">{branch.manager}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                        <Layers size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest leading-none">Capacity</p>
                                        <p className="text-sm font-medium text-on-surface mt-1">{branch.capacity} Units</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div onClick={() => handleViewDetails(branch._id)} className="mt-8 flex items-center justify-between group/link cursor-pointer">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary group-hover/link:translate-x-1 transition-transform">
                                View Details
                            </span>
                            <ChevronRight size={16} className="text-primary" />
                        </div>
                    </div>
                ))}

                {filtered?.length === 0 && (
                    <div className="col-span-full py-32 bg-white rounded-[2.5rem] border border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-center opacity-40">
                        <Building2 size={20} className="text-on-surface-variant/20 mb-4" />
                        <p className="text-lg font-semibold text-on-surface font-headline">No Matching Branches</p>
                        <p className="text-sm text-on-surface-variant mt-1">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* SlidePanel for Add/Edit Branch */}
            <SlidePanel
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                title={isEdit ? 'Update Branch Settings' : 'Register New Branch'}
                description={isEdit ? 'Modify branch details or management.' : 'Establish a new regional processing branch.'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Input
                                label="Branch Name"
                                placeholder="e.g. South Karachi Branch"
                                icon={Target}
                                {...register('name')}
                                error={errors.name?.message}
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="Branch Location"
                                placeholder="Physical address"
                                icon={MapPin}
                                {...register('location')}
                                error={errors.location?.message}
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="Daily Capacity"
                                placeholder="500"
                                type="number"
                                icon={Layers}
                                {...register('capacity', { valueAsNumber: true })}
                                error={errors.capacity?.message}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <Button 
                            variant="outline" 
                            type="button"
                            className="flex-1" 
                            onClick={() => setShowDrawer(false)}
                        >
                            Discard
                        </Button>
                        <Button 
                            type="submit" 
                            className="flex-1" 
                            isLoading={loading}
                        >
                            {isEdit ? 'Save Changes' : 'Register Branch'}
                        </Button>
                    </div>
                </form>
            </SlidePanel>

        </div>
    )
}

export default Branches
