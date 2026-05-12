// src/pages/admin/ProfilePage.jsx
import { useState } from 'react'
import { useSelector } from 'react-redux'

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false)
    const { user } = useSelector(state => state.auth)

    // Extract user details dynamically, falling back to placeholders if undefined
    const userData = user?.user || user || {}
    const fullName = userData.name || 'User'
    const email = userData.email || 'user@saylani.org'
    const role = userData.role || 'Staff'
    const phone = userData.phone || '+92 000 0000000'
    const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

    // Determine theme colors based on role
    const getRoleColors = () => {
        if (role === 'admin') return { bg: 'from-primary to-primary-container', text: 'text-primary', badge: 'bg-primary-fixed text-on-primary-fixed-variant' }
        if (role === 'manager') return { bg: 'from-secondary to-secondary-container', text: 'text-secondary', badge: 'bg-secondary-fixed text-on-secondary-fixed-variant' }
        return { bg: 'from-tertiary to-tertiary-container', text: 'text-tertiary', badge: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' }
    }
    const colors = getRoleColors()

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-xl font-extrabold text-on-surface font-headline tracking-tight capitalize">{role} Profile</h1>
                <p className="text-on-surface-variant font-medium mt-1">Manage your account settings and preferences.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
                {/* Header Banner */}
                <div className={`h-32 bg-gradient-to-r ${colors.bg} relative`}>
                    <div className="absolute -bottom-12 left-8">
                        <div className={`w-24 h-24 rounded-full border-4 border-white ${colors.badge} flex items-center justify-center text-xl font-medium shadow-md`}>
                            {initials}
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8 border-b border-slate-50 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-extrabold text-on-surface font-headline capitalize">{fullName}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`${colors.badge} px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider`}>{role}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-medium rounded-xl text-sm transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">{isEditing ? 'close' : 'edit'}</span>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <div className="p-8">
                    <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Personal Information</h3>
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-widest text-outline">Full Name</label>
                                    <input type="text" defaultValue={fullName} disabled={!isEditing} className={`w-full bg-surface-container-low border-none rounded-t-xl border-b-2 border-outline-variant focus:${colors.text} focus:ring-0 py-3 px-4 font-medium text-sm outline-none disabled:opacity-70 disabled:bg-slate-50`} />
                                </div>
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-widest text-outline">Email Address</label>
                                    <input type="email" defaultValue={email} disabled={!isEditing} className={`w-full bg-surface-container-low border-none rounded-t-xl border-b-2 border-outline-variant focus:${colors.text} focus:ring-0 py-3 px-4 font-medium text-sm outline-none disabled:opacity-70 disabled:bg-slate-50`} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-widest text-outline">Phone Number</label>
                                    <input type="tel" defaultValue={phone} disabled={!isEditing} className={`w-full bg-surface-container-low border-none rounded-t-xl border-b-2 border-outline-variant focus:${colors.text} focus:ring-0 py-3 px-4 font-medium text-sm outline-none disabled:opacity-70 disabled:bg-slate-50 tabular-nums`} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Security & Preferences</h3>
                                
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-widest text-outline">Role</label>
                                    <input type="text" defaultValue={role.toUpperCase()} disabled className="w-full bg-slate-100 border-none rounded-t-xl border-b-2 border-slate-200 py-3 px-4 font-medium text-sm outline-none cursor-not-allowed text-slate-500" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-widest text-outline">Password</label>
                                    <div className="flex gap-3">
                                        <input type="password" defaultValue="••••••••" disabled className="flex-1 bg-slate-100 border-none rounded-t-xl border-b-2 border-slate-200 py-3 px-4 font-medium text-sm outline-none cursor-not-allowed text-slate-500" />
                                        {isEditing && (
                                            <button type="button" className={`px-4 py-3 bg-surface-container-low hover:bg-surface-container-high ${colors.text} font-medium rounded-xl text-sm transition-colors`}>
                                                Change
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-10 h-6 rounded-full transition-colors relative ${isEditing ? 'bg-slate-800' : 'bg-slate-300'}`}>
                                            <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1 shadow-sm" />
                                        </div>
                                        <span className="text-sm font-medium text-on-surface">Enable Two-Factor Auth (2FA)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="pt-8 mt-8 border-t border-slate-50 flex justify-end gap-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 text-on-surface-variant font-medium hover:bg-surface-container-high rounded-xl transition-colors text-sm">
                                    Discard Changes
                                </button>
                                <button type="submit" onClick={() => setIsEditing(false)} className={`px-10 py-3 bg-gradient-to-br ${colors.bg} text-white font-medium rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-sm`}>
                                    Save Profile
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
