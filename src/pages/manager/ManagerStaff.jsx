import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
    Users, 
    Search, 
    Mail, 
    UserPlus,
    UserCheck,
    Shield,
    AlertCircle,
    Info,
    Eye,
    Edit3,
    Trash2,
    Activity
} from 'lucide-react'
import Button from '../../components/common/Button'
import SlidePanel from '../../components/common/SlidePanel'
import Input from '../../components/common/Input'
import { createUser, fetchBranchStaff, deleteUser, updateUser } from '../../store/slices/userSlice'

const ManagerStaff = () => {
    const dispatch = useDispatch()
    const { branchStaff, loading: userLoading, success, error: userError } = useSelector(state => state.user)
    const { user } = useSelector(state => state.auth)

    const [searchTerm, setSearchTerm] = useState('')
    const [showDrawer, setShowDrawer] = useState(false)
    const [showViewDrawer, setShowViewDrawer] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState(null)
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [formError, setFormError] = useState('')
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        dispatch(fetchBranchStaff())
    }, [dispatch])

    useEffect(() => {
        if (success && showDrawer) {
            setShowDrawer(false)
            setForm({ username: '', email: '', password: '' })
            setEditingId(null)
            dispatch(fetchBranchStaff())
        }
    }, [success, dispatch])

    const handleRegister = async (e) => {
        e.preventDefault()
        setFormError('')
        
        const payload = {
            ...form,
            role: 'staff',
            branchId: user?.branchId?._id || user?.branchId
        };
        const res = editingId
            ? await dispatch(updateUser({ id: editingId, data: payload }))
            : await dispatch(createUser(payload))

        if (res.meta.requestStatus === 'rejected') {
            setFormError(res.payload)
        }
    }


    // Filter only staff for this manager's view
    const staff = branchStaff || []

    
    const filtered = staff.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Implement missing functionality
    const handleEdit = (user) => {
        setForm({ username: user.username, email: user.email, password: '' })
        setEditingId(user._id)
        setFormError('')
        setShowDrawer(true)
    }

    const handleView = (user) => {
        setSelectedStaff(user)
        setShowViewDrawer(true)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            dispatch(deleteUser(id))
        }
    }

    const handleToggleStatus = (staffUser) => {
        dispatch(updateUser({
            id: staffUser._id,
            data: {
                username: staffUser.username,
                email: staffUser.email,
                role: 'staff',
                branchId: user?.branchId?._id || user?.branchId,
                isActive: !staffUser.isActive
            }
        })).then(() => dispatch(fetchBranchStaff()));
    }

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Branch Personnel</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Manage and monitor field staff assigned to this processing center.</p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="primary" 
                        icon={UserPlus} 
                        size="sm"
                        onClick={() => {
                            setEditingId(null);
                            setForm({ username: '', email: '', password: '' });
                            setShowDrawer(true);
                        }}
                    >
                        Register Staff
                    </Button>
                </div>
            </div>

            <SlidePanel
                isOpen={showDrawer}
                onClose={() => {
                    setShowDrawer(false)
                    setForm({ username: '', email: '', password: '' })
                    setEditingId(null)
                    setFormError('')
                }}
                title={editingId ? "Update Staff" : "Add Staff"}
                description={`Register a new operator for the ${user?.branchId?.name || 'Local'} Branch.`}
            >
                <form onSubmit={handleRegister} className="space-y-8">
                    {formError && (
                        <div className="p-4 bg-error/5 text-error border border-error/20 rounded-2xl flex items-center gap-3 animate-slideUp">
                            <AlertCircle size={18} />
                            <p className="text-xs font-medium">{formError}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <Input
                            label="Operator Name"
                            placeholder="e.g. John Doe"
                            icon={UserCheck}
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                        />
                        <Input
                            label="Email Address"
                            placeholder="operator@saylani.org"
                            icon={Mail}
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <Input
                            label="System Password"
                            placeholder="••••••••"
                            icon={Shield}
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required={!editingId}
                        />
                    </div>

                    <div className="p-6 bg-surface-container-low/30 rounded-2xl border border-outline-variant/20 flex gap-4 items-start">
                        <Info size={20} className="text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-on-surface uppercase tracking-widest">Automatic Assignment</p>
                            <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                This staff member will be automatically locked to the {user?.branchId?.name} branch.
                                They will only have access to local inventory and operation logs.
                            </p>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full py-4 text-sm uppercase tracking-widest font-semibold shadow-xl shadow-primary/20"
                        isLoading={userLoading}
                        icon={UserPlus}
                    >
                        {editingId ? 'Save Staff' : 'Create Staff'}
                    </Button>
                </form>
            </SlidePanel>

            {/* View Details Panel */}
            <SlidePanel
                isOpen={showViewDrawer}
                onClose={() => setShowViewDrawer(false)}
                title="Personnel Profile"
                description="Comprehensive details of the selected staff member."
            >
                {selectedStaff && (
                    <div className="space-y-10">
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="w-24 h-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl uppercase shadow-sm border border-primary/10">
                                {selectedStaff.username.charAt(0)}
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-semibold text-on-surface font-headline">{selectedStaff.username}</h3>
                                <div className="flex items-center gap-2 justify-center mt-2">
                                    <div className={`w-2 h-2 rounded-full ${selectedStaff.isActive ? 'bg-primary' : 'bg-error'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                                        {selectedStaff.isActive ? 'Active Duty' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-surface-container-low/30 border border-outline-variant/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Mail size={16} className="text-primary" />
                                        <span className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">Email Identity</span>
                                    </div>
                                    <span className="text-sm font-medium text-on-surface">{selectedStaff.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shield size={16} className="text-primary" />
                                        <span className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">System Role</span>
                                    </div>
                                    <span className="text-sm font-medium text-on-surface uppercase tracking-tight">{selectedStaff.role}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <UserCheck size={16} className="text-primary" />
                                        <span className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">Employee ID</span>
                                    </div>
                                    <span className="text-xs font-mono text-on-surface-variant">{selectedStaff._id}</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-surface-container-low/30 border border-outline-variant/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Activity size={16} className="text-primary" />
                                        <span className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">Last Activity</span>
                                    </div>
                                    <span className="text-xs font-medium text-on-surface">{new Date(selectedStaff.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Info size={16} className="text-primary" />
                                        <span className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">Join Date</span>
                                    </div>
                                    <span className="text-xs font-medium text-on-surface">{new Date(selectedStaff.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <Button 
                            variant="outline" 
                            className="w-full mt-10" 
                            onClick={() => setShowViewDrawer(false)}
                        >
                            Close Profile
                        </Button>
                    </div>
                )}
            </SlidePanel>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-outline-variant/30 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <UserCheck size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest">Active Staff</p>
                        <h4 className="text-xl font-semibold text-on-surface tabular-nums">{staff.filter((s) => s.isActive).length}</h4>
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold text-on-surface font-headline">Personnel Roster</h2>
                    <div className="relative group w-full md:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-surface-container-low border-none rounded-2xl py-3 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-container-low/30 text-on-surface-variant/60 text-[10px] font-semibold uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-5">Operator</th>
                                <th className="px-8 py-5">Access Rights</th>
                                <th className="px-8 py-5">Communication</th>
                                <th className="px-8 py-5 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {filtered.map((u, i) => (
                                <tr key={i} className="hover:bg-surface-container-low/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm uppercase">
                                                {u.username.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-on-surface text-sm">{u.username}</p>
                                                <p className="text-[9px] text-on-surface-variant/40 font-semibold uppercase tracking-tighter">Verified Identity</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary text-[10px] font-semibold uppercase tracking-widest rounded-full w-fit border border-primary/10">
                                            <Shield size={10} />
                                            {u.isActive ? 'Active Staff' : 'Inactive Staff'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-on-surface-variant font-medium">{u.email}</span>
                                            <span className="text-[10px] text-on-surface-variant/40 uppercase font-semibold tracking-widest mt-0.5">Secure Mailbox</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleView(u)}
                                                title="View Details"
                                                className="p-2.5 bg-white border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary/30 rounded-xl transition-all shadow-sm group/view"
                                            >
                                                <Eye size={16} className="group-hover/view:scale-110 transition-transform" />
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(u)}
                                                title={u.isActive ? "Deactivate Staff" : "Activate Staff"}
                                                className="p-2.5 bg-white border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/30 rounded-xl transition-all shadow-sm"
                                            >
                                                {u.isActive ? 'Off' : 'On'}
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(u)}
                                                title="Edit Staff"
                                                className="p-2.5 bg-white border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/30 rounded-xl transition-all shadow-sm group/edit"
                                            >
                                                <Edit3 size={16} className="group-hover/edit:scale-110 transition-transform" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(u._id)}
                                                title="Remove Staff"
                                                className="p-2.5 bg-white border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error/30 rounded-xl transition-all shadow-sm group/del"
                                            >
                                                <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="py-20 text-center opacity-40">
                        <Users size={20} className="mx-auto text-on-surface-variant/20 mb-4" />
                        <p className="text-lg font-semibold text-on-surface font-headline">No staff records found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManagerStaff
