// src/pages/admin/UsersPage.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchAllUsers, createUser, updateUser, deleteUser, resetUserState } from '../../store/slices/userSlice'
import { fetchBranches } from '../../store/slices/branchSlice'
import { exportToCSV } from '../../utils/exportUtils'
import { 
    UserPlus, 
    User,
    Users,
    Download, 
    Search, 
    Eye,
    Edit3, 
    Trash2, 
    Mail, 
    Shield, 
    ChevronDown,
    Lock,
    Building2,
    Info
} from 'lucide-react'

import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import SlidePanel from '../../components/common/SlidePanel'
import Modal from '../../components/common/Modal'

const schema = z.object({
  username: z.string().min(2, "Full name is required").max(50, "Max 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
  role: z.enum(['admin', 'manager', 'staff']),
  branchId: z.string().optional()
}).refine(data => {
  if (['manager', 'staff'].includes(data.role) && (!data.branchId || data.branchId === "")) {
    return false;
  }
  return true;
}, {
  message: "Please assign a branch",
  path: ["branchId"]
});

const UsersPage = () => {
    const dispatch = useDispatch()
    const { allUsers, loading: userLoading, success: userSuccess } = useSelector(state => state.user)
    const { branches } = useSelector(state => state.branch)

    const [roleFilter, setRoleFilter] = useState('All Roles')
    const [searchTerm, setSearchTerm] = useState('')
    const [branchFilter, setBranchFilter] = useState('All Branches')
    const [showDrawer, setShowDrawer] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [editingUserId, setEditingUserId] = useState(null)
    const [showUserDetail, setShowUserDetail] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            role: 'manager',
            branchId: ''
        }
    });

    const watchRole = watch('role');

    useEffect(() => {
        dispatch(fetchAllUsers())
        dispatch(fetchBranches())
    }, [dispatch])

    useEffect(() => {
        if (userSuccess) {
            setShowDrawer(false)
            setIsEdit(false)
            setEditingUserId(null)
            reset({ username: '', email: '', password: '', role: 'manager', branchId: '' })
            dispatch(resetUserState())
            dispatch(fetchAllUsers())
        }
    }, [userSuccess, dispatch, reset])

    const onSubmit = (data) => {
        if (isEdit) {
            const updateData = { ...data };
            if (!updateData.password) delete updateData.password;
            dispatch(updateUser({ id: editingUserId, data: updateData }))
        } else {
            if (!data.password) {
                alert("Password is required for new users");
                return;
            }
            dispatch(createUser(data))
        }
    }

    const handleEdit = (user) => {
        setIsEdit(true)
        setEditingUserId(user._id)
        reset({
            username: user.username,
            email: user.email,
            password: '', 
            role: user.role,
            branchId: (typeof user.branchId === 'object') ? user.branchId?._id : (user.branchId || '')
        })
        setShowDrawer(true)
    }

    const handleAddNew = () => {
        setIsEdit(false)
        setEditingUserId(null)
        reset({ username: '', email: '', password: '', role: 'manager', branchId: '' })
        setShowDrawer(true)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            dispatch(deleteUser(id))
        }
    }

    const handleView = (user) => {
        setSelectedUser(user)
        setShowUserDetail(true)
    }

    const filtered = allUsers.filter(u => {
        const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter.toLowerCase();
        const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBranch = branchFilter === 'All Branches' || u.branchId?._id === branchFilter || u.branchId === branchFilter;
        return matchesRole && matchesSearch && matchesBranch;
    });

    const handleExport = () => {
        const exportData = filtered.map(u => ({
            Username: u.username,
            Email: u.email,
            Role: u.role,
            Branch: u.branchId?.name || 'Central Admin'
        }));
        exportToCSV(exportData, 'Staff_Directory');
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden relative group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-on-surface font-headline tracking-tight">Staff Management</h1>
                    <p className="text-on-surface-variant font-medium mt-1">Manage system operators and their access privileges.</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto relative z-10">
                    <Button 
                        variant="outline" 
                        onClick={handleExport}
                        icon={Download}
                        className="flex-1 sm:flex-none bg-white/50 backdrop-blur-sm"
                    >
                        Export List
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleAddNew}
                        icon={UserPlus}
                        className="flex-1 sm:flex-none shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                    >
                        Add New Staff
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Operators', val: allUsers?.length || 0, icon: Users, color: 'text-primary', bg: 'bg-primary/5' },
                    { label: 'Active Managers', val: allUsers?.filter(u => u.role === 'manager').length || 0, icon: Shield, color: 'text-secondary', bg: 'bg-secondary/5' },
                    { label: 'Field Agents', val: allUsers?.filter(u => u.role === 'staff').length || 0, icon: User, color: 'text-tertiary', bg: 'bg-tertiary/5' }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-outline-variant/30 flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div>
                            <p className="text-[10px] font-semibold text-on-surface-variant/40 uppercase tracking-widest mb-1">{s.label}</p>
                            <h3 className="text-xl font-semibold tabular-nums text-on-surface">{s.val}</h3>
                        </div>
                        <div className={`p-4 ${s.bg} ${s.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                            <s.icon size={20} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Table Area */}
            <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
                <div className="px-8 py-6 flex flex-wrap items-center justify-between gap-6 border-b border-surface-container-low">
                    <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl">
                        {['All Roles', 'Manager', 'Staff'].map(r => (
                            <button 
                                key={r} 
                                onClick={() => setRoleFilter(r)} 
                                className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant/40 hover:text-on-surface'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    
                    <div className="relative group flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-surface-container-low border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-container-low/30 text-on-surface-variant/60 text-[10px] font-semibold uppercase tracking-[0.15em]">
                                <th className="px-8 py-5">Full Profile</th>
                                <th className="px-8 py-5">System Role</th>
                                <th className="px-8 py-5">Communication</th>
                                <th className="px-8 py-5">Assigned Branch</th>
                                <th className="px-8 py-5 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-low">
                            {filtered?.map((user, i) => (
                                <tr key={i} className="hover:bg-surface-container-low/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center font-semibold text-primary text-sm uppercase">
                                                {user.username.substring(0, 2)}
                                            </div>
                                            <div>
                                              <p className="font-semibold text-on-surface text-sm">{user.username}</p>
                                              <p className="text-[10px] text-on-surface-variant/40 font-medium uppercase tracking-tight">Active Member</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] ${user.role === 'admin' ? 'bg-error/10 text-error' : user.role === 'manager' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                      <div className="flex flex-col">
                                        <span className="text-sm text-on-surface-variant font-medium">{user.email}</span>
                                        <span className="text-[10px] text-on-surface-variant/40 uppercase font-semibold tracking-widest mt-0.5">Verified Email</span>
                                      </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm text-on-surface font-medium">
                                          <Building2 size={16} className="text-on-surface-variant/40" />
                                          {user.branchId?.name || 'Central Admin'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                title="View Details"
                                                onClick={() => handleView(user)}
                                                className="p-2.5 bg-white border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary/30 rounded-xl transition-all shadow-sm group/eye"
                                            >
                                                <Eye size={18} className="group-hover/eye:scale-110 transition-transform" />
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(user)}
                                                className="p-2.5 bg-white border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/30 rounded-xl transition-all shadow-sm group/edit"
                                            >
                                                <Edit3 size={18} className="group-hover/edit:scale-110 transition-transform" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2.5 bg-white border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error/30 rounded-xl transition-all shadow-sm group/del"
                                            >
                                                <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SlidePanel for Add/Edit User */}
            <SlidePanel
              isOpen={showDrawer}
              onClose={() => setShowDrawer(false)}
              title={isEdit ? 'Update Staff Member' : 'Register New Staff'}
              description={isEdit ? 'Modify access levels or branch assignment for this operator.' : 'Onboard a new operator and assign them to a processing branch.'}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-1">
                      <Input
                        label="Full Legal Name"
                        placeholder="e.g. Abdullah bin Tariq"
                        icon={User}
                        {...register('username')}
                        error={errors.username?.message}
                      />
                  </div>

                  <div className="space-y-1">
                      <Input
                        label="Official Email Address"
                        placeholder="name@saylani.org"
                        icon={Mail}
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                      />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/60 ml-1">Access Role</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                          <Shield size={18} />
                        </div>
                        <select 
                            {...register('role')}
                            className={`w-full bg-white border border-outline-variant/40 rounded-2xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm font-medium appearance-none cursor-pointer text-on-surface ${errors.role ? 'border-2 border-red-500' : ''}`}
                        >
                            <option value="manager">Branch Manager</option>
                            <option value="staff">Field Operator</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant/40">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                      {errors.role && <p className="text-[10px] font-medium text-error px-1 mt-1">{errors.role.message}</p>}
                    </div>

                    {watchRole !== 'admin' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/60 ml-1">Target Branch</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                              <Building2 size={18} />
                            </div>
                            <select 
                                {...register('branchId')}
                                className={`w-full bg-white border border-outline-variant/40 rounded-2xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm font-medium appearance-none cursor-pointer text-on-surface ${errors.branchId ? 'border-error/50 bg-error/5' : ''}`}
                            >
                                <option value="" disabled>Select Branch</option>
                                {branches?.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-on-surface-variant/40">
                              <ChevronDown size={16} />
                            </div>
                          </div>
                          {errors.branchId && <p className="text-[10px] font-medium text-error px-1 mt-1">{errors.branchId.message}</p>}
                        </div>
                    )}
                  </div>

                  {!isEdit && (
                    <div className="space-y-1">
                        <Input
                          label="Initial Access Password"
                          placeholder="••••••••"
                          icon={Lock}
                          type="password"
                          {...register('password')}
                          error={errors.password?.message}
                        />
                    </div>
                  )}
                </div>

                <div className="p-5 bg-primary/5 rounded-3xl border border-primary/10 flex gap-4 items-start">
                  <div className="p-2 bg-white rounded-xl text-primary shadow-sm">
                    <Info size={18} />
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                    Credentials will be automatically dispatched to the staff member's email. They will be required to update their password upon first authentication.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
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
                    isLoading={userLoading}
                  >
                    {isEdit ? 'Update Details' : 'Register & Notify'}
                  </Button>
                </div>
              </form>
            </SlidePanel>

            <Modal
                isOpen={showUserDetail}
                onClose={() => setShowUserDetail(false)}
                title={selectedUser?.username || 'User Details'}
                maxWidth="max-w-xl"
            >
                {!selectedUser ? (
                    <p className="text-sm text-on-surface-variant">No user selected.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                                <p className="text-[10px] uppercase font-semibold tracking-widest text-on-surface-variant">Name</p>
                                <p className="text-sm font-medium text-on-surface mt-1">{selectedUser.username || 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                                <p className="text-[10px] uppercase font-semibold tracking-widest text-on-surface-variant">Role</p>
                                <p className="text-sm font-medium text-on-surface mt-1">{selectedUser.role || 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                                <p className="text-[10px] uppercase font-semibold tracking-widest text-on-surface-variant">Email</p>
                                <p className="text-sm font-medium text-on-surface mt-1 break-all">{selectedUser.email || 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                                <p className="text-[10px] uppercase font-semibold tracking-widest text-on-surface-variant">Assigned Branch</p>
                                <p className="text-sm font-medium text-on-surface mt-1">{selectedUser.branchId?.name || 'Central Admin'}</p>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button variant="outline" onClick={() => setShowUserDetail(false)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default UsersPage

