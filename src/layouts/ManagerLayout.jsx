import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { 
    LayoutDashboard, 
    Download, 
    Scissors, 
    ClipboardList, 
    Users, 
    LogOut,
    AlertCircle,
    Package,
    Menu,
    X
} from 'lucide-react';
import Button from '../components/common/Button';

const ManagerLayout = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const handleLogout = () => {
        dispatch(logoutUser()).then(() => {
            navigate('/login');
        });
    }

    const navLink = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-300 ${
            isActive
                ? 'font-semibold text-primary bg-primary/10 shadow-sm'
                : 'font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
        }`


    const hasNoBranch = user && user.role !== 'admin' && !user.branchId;

    return (
        <div className="bg-background text-on-surface antialiased min-h-screen font-body overflow-x-hidden">
            {/* Top App Bar */}
            <header className="fixed top-0 w-full h-[70px] z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant/50 flex justify-between items-center px-4 md:px-8">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 lg:hidden text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <img src="/saylani_logo-removebg-preview.png" alt="Saylani" className="h-10 md:h-12 w-auto" />
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-on-surface leading-tight">{user?.username || 'Branch Manager'}</p>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">
                                MANAGER
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-white font-bold text-sm">
                            {user?.username ? user.username.slice(0, 2).toUpperCase() : 'BM'}
                        </div>
                    </div>
                    
                    <div className="w-[1px] h-6 bg-outline-variant/50 mx-1 hidden md:block"></div>

                    <button 
                        onClick={handleLogout}
                        className="p-2.5 text-on-surface-variant/60 hover:text-error hover:bg-error/10 rounded-xl transition-all"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed left-0 top-0 h-full w-[280px] pt-[70px] z-40 bg-white border-r border-outline-variant/50 
                flex flex-col p-6 gap-2 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2 mt-4">
                    <div className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] px-4 mb-5">Operations</div>
                    
                    <NavLink to="/manager/dashboard" className={navLink} onClick={() => setIsSidebarOpen(false)}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    
                    <NavLink to="/manager/receive-livestock" className={navLink} onClick={() => setIsSidebarOpen(false)}>
                        <Download size={20} />
                        <span>Receive Livestock</span>
                    </NavLink>
                    
                    <NavLink to="/manager/inventory" className={navLink} onClick={() => setIsSidebarOpen(false)}>
                        <Package size={20} />
                        <span>Branch Inventory</span>
                    </NavLink>
                    
                    <div className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] px-4 mb-5 mt-10">Processing</div>

                    <NavLink to="/manager/slaughter" className={navLink} onClick={() => setIsSidebarOpen(false)}>
                        <Scissors size={20} />
                        <span>Slaughter Records</span>
                    </NavLink>
                    
                    <NavLink to="/manager/processing-records" className={navLink} onClick={() => setIsSidebarOpen(false)}>
                        <ClipboardList size={20} />
                        <span>Processing Records</span>
                    </NavLink>
                    
                    <div className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] px-4 mb-5 mt-10">Team</div>

                    <NavLink to="/manager/staff" className={navLink} onClick={() => setIsSidebarOpen(false)}>
                        <Users size={20} />
                        <span>Staff Management</span>
                    </NavLink>

                </nav>

                <div className="mt-auto border-t border-outline-variant/50 pt-6 opacity-30">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] px-4">Branch Terminal v1.0</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-[280px] pt-[70px] min-h-screen bg-background transition-all">
                <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto animate-fadeIn">
                    {hasNoBranch ? (
                        <div className="flex flex-col items-center justify-center py-20 px-8 bg-white rounded-3xl border border-error/20 text-center shadow-xl shadow-error/5">
                            <div className="p-4 bg-error/5 text-error rounded-full mb-6">
                                <AlertCircle size={20} />
                            </div>
                            <h2 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Configuration Error</h2>
                            <p className="text-on-surface-variant mt-2 max-w-md mx-auto leading-relaxed">
                                Your account is not currently associated with a physical processing branch. 
                                Please contact the system administrator to assign your profile to a branch.
                            </p>
                            <Button variant="outline" className="mt-8" onClick={handleLogout}>Return to Login</Button>
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </main>
        </div>
    )
}

export default ManagerLayout
