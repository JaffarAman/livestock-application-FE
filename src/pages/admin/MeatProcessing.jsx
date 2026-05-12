// src/pages/admin/MeatProcessing.jsx
import { useState } from 'react'
import { exportToCSV } from '../../utils/exportUtils'

const MeatProcessing = () => {
    const [branch, setBranch] = useState('Main Processing Unit')
    const [date, setDate] = useState('2023-10-27')

    const stats = [
        { label: 'Total Processed', value: '14,700', unit: 'kg', icon: 'scale', color: 'text-primary/10', trend: 'Average 15kg/animal', trendColor: 'text-primary' },
        { label: 'Khal Collected', value: '980', icon: 'curtains', color: 'text-orange-400/20', trend: '100% collection rate', trendColor: 'text-orange-600' },
        { label: 'Paye Sets', value: '3,920', icon: 'soup_kitchen', color: 'text-blue-400/20', trend: '4 sets per animal', trendColor: 'text-blue-600' },
        { label: 'Pending Entry', value: '12', icon: 'pending_actions', color: 'text-tertiary/10', pulse: true, pulseColor: 'bg-tertiary' },
    ]

    const [searchTerm, setSearchTerm] = useState('')

    const filteredEntries = entries.filter(e => 
        e.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        const exportData = filteredEntries.map(e => ({
            'Entry ID': e.id,
            'Branch': e.branch,
            'Animals': e.animals,
            'Meat (kg)': e.meat,
            'Khal': e.khal,
            'Paye': e.paye,
            'Date': e.date,
            'Status': e.status
        }));
        exportToCSV(exportData, 'Meat_Processing_Log');
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="mb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">Meat Records</h1>
                    <p className="text-on-surface-variant text-sm font-medium mt-0.5">Record the amount of meat and other items collected from each group.</p>
                </div>
                <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-on-surface-variant font-medium text-sm rounded-xl shadow-sm border border-slate-100/50 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined text-lg">file_download</span> Export
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="relative overflow-hidden group bg-surface-container-lowest p-6 rounded-xl shadow-sm transition-all duration-300 hover:translate-y-[-4px]">
                        <span className={`material-symbols-outlined absolute -right-4 -bottom-4 text-8xl ${s.color} group-hover:scale-110 transition-transform duration-500`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                        <h3 className="text-xl font-extrabold tabular-nums text-on-surface">
                            {s.value}{s.unit && <span className="text-sm font-medium text-slate-400 ml-1">{s.unit}</span>}
                        </h3>
                        <div className="mt-4">
                            {s.pulse ? (
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${s.pulseColor} animate-pulse`} />
                                    <span className="text-[10px] text-slate-500 font-medium uppercase">Awaiting entry</span>
                                </div>
                            ) : (
                                <div className={`flex items-center gap-1 text-xs font-medium ${s.trendColor}`}>
                                    {s.trend}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Entry Form */}
                <section className="lg:col-span-5">
                    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-slate-50">
                        <h2 className="text-lg font-extrabold text-on-surface font-headline mb-4">New Meat Record</h2>
                        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium uppercase tracking-widest text-outline">Select Branch</label>
                                <div className="relative">
                                    <select value={branch} onChange={e => setBranch(e.target.value)} className="w-full bg-surface-container-low border-none rounded-t-xl border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-3 px-4 appearance-none font-medium text-sm outline-none">
                                        <option>Main Processing Unit</option>
                                        <option>North Region Hub</option>
                                        <option>Industrial Area Branch</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xl">expand_more</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium uppercase tracking-widest text-outline">Record Date</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-surface-container-low border-none rounded-t-xl border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-3 px-4 font-medium text-sm outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[{ label: 'Meat (kg)', placeholder: '0.0' }, { label: 'Skin Count', placeholder: '0' }, { label: 'Paye Count', placeholder: '0' }, { label: 'Animals Count', placeholder: '0' }].map((f, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <label className="text-[10px] font-medium uppercase tracking-widest text-outline">{f.label}</label>
                                        <input type="number" placeholder={f.placeholder} className="w-full bg-surface-container-low border-none rounded-t-xl border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-3 px-4 font-medium text-sm outline-none tabular-nums" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-end gap-4 pt-2">
                                <button type="button" className="px-6 py-3 text-on-surface-variant font-medium hover:bg-surface-container-high rounded-xl transition-colors text-sm">Cancel</button>
                                <button type="submit" className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-medium rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm">
                                    Save Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Log Table */}
                <section className="lg:col-span-7">
                    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4">
                            <h2 className="text-xl font-extrabold text-on-surface font-headline">Processing Log</h2>
                            <div className="flex flex-1 max-w-xs relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                <input 
                                    type="text" 
                                    placeholder="Search by ID or branch..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleExport}
                                    className="p-2 hover:bg-surface-container-low rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-slate-400 text-xl">download</span>
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-container-low text-[10px] font-medium uppercase tracking-widest text-on-surface-variant">
                                    <tr>
                                        <th className="px-6 py-4">Entry ID</th>
                                        <th className="px-6 py-4">Branch</th>
                                        <th className="px-6 py-4">Animals</th>
                                        <th className="px-6 py-4">Meat</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm font-medium">
                                    {filteredEntries.map((e, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-on-surface tabular-nums">{e.id}</td>
                                            <td className="px-6 py-4 text-slate-600">{e.branch}</td>
                                            <td className="px-6 py-4 tabular-nums">{e.animals}</td>
                                            <td className="px-6 py-4 tabular-nums">{e.meat}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-medium uppercase ${e.status === 'Complete' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'}`}>{e.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default MeatProcessing
