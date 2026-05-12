// src/pages/manager/ManagerProcessing.jsx
import { useState } from 'react'

const ManagerProcessing = () => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="mb-4">
                <h1 className="text-xl font-extrabold text-on-surface font-headline tracking-tight">Daily Meat Record</h1>
                <p className="text-on-surface-variant text-sm font-medium mt-0.5">Record the amount of meat and other items collected today.</p>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm max-w-2xl border border-slate-50">
                <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-4">
                        {[{ label: 'Meat (kg)', placeholder: '0.0' }, { label: 'Skin Count', placeholder: '0' }, { label: 'Paye Count', placeholder: '0' }, { label: 'Animals Count', placeholder: '0' }].map((f, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <label className="text-[10px] font-medium uppercase tracking-widest text-outline">{f.label}</label>
                                <input type="number" placeholder={f.placeholder} className="w-full bg-surface-container-low border-none rounded-t-xl border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-3 px-4 font-medium text-sm outline-none tabular-nums" />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-end gap-4 pt-2">
                        <button type="submit" className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-medium rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-sm w-full sm:w-auto">
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ManagerProcessing
