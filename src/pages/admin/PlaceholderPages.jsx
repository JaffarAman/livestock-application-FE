// src/pages/admin/PlaceholderPages.jsx
export const Analytics = () => (
    <div className="space-y-8 animate-fadeIn">
        <div>
            <h1 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">Analytics Dashboard</h1>
            <p className="text-on-surface-variant font-medium mt-1">Deep dive into livestock operational metrics.</p>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl p-16 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-24 h-24 bg-primary-container/10 text-primary rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-xl">analytics</span>
            </div>
            <h2 className="text-xl font-extrabold font-headline text-on-surface">Analytics Engine Loading</h2>
            <p className="text-slate-500 max-w-md mx-auto mt-2">The advanced analytics module is currently being calibrated with the latest batch data. Please check back shortly.</p>
        </div>
    </div>
)

export const Settings = () => (
    <div className="space-y-8 animate-fadeIn">
        <div>
            <h1 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">System Settings</h1>
            <p className="text-on-surface-variant font-medium mt-1">Configure global application parameters.</p>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl p-16 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-24 h-24 bg-secondary-container/10 text-secondary rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-xl">settings_applications</span>
            </div>
            <h2 className="text-xl font-extrabold font-headline text-on-surface">Configuration Module</h2>
            <p className="text-slate-500 max-w-md mx-auto mt-2">Global settings are temporarily restricted for routine maintenance. Admin access will be restored once updates are complete.</p>
        </div>
    </div>
)
