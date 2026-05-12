// src/pages/staff/SlaughterEntry.jsx
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSlaughter, getAllSlaughters } from '../../store/slices/slaughterSlice'
import { getInventory } from '../../store/slices/inventorySlice'

const schema = z.object({
  animalType: z.enum(['cow', 'goat'], {
    errorMap: () => ({ message: "Please select an animal type" })
  }),
  count: z.number().int("Count must be an integer").min(1, "Count must be at least 1")
});

const SlaughterEntry = () => {
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.slaughter)
    const { inventory } = useSelector((state) => state.inventory)

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            animalType: 'goat',
            count: ''
        }
    });

    useEffect(() => {
        dispatch(getInventory())
    }, [dispatch])
    
    const selectedType = watch('animalType');

    // Dynamic available calculation based on selected type
    const available = useMemo(() => {
        if (!inventory) return 0;
        if (selectedType === 'cow') {
            return Math.max(0, (inventory.cowReceived || 0) - (inventory.cowSlaughtered || 0));
        } else {
            return Math.max(0, (inventory.goatReceived || 0) - (inventory.goatSlaughtered || 0));
        }
    }, [inventory, selectedType]);

    const onSubmit = async (data) => {
        if (data.count > available) {
            alert(`Cannot slaughter more than available ${selectedType}s (${available})`);
            return;
        }

        const date = new Date().toISOString();

        try {
            await dispatch(createSlaughter({ 
                date, 
                animalType: data.animalType, 
                count: Number(data.count) 
            })).unwrap();
            
            alert('Slaughter record created successfully!');
            reset({ ...data, count: '' });
            // Refresh data
            dispatch(getInventory());
            dispatch(getAllSlaughters());
        } catch (err) {
            alert(err || 'Failed to create record');
        }
    }

    return (
        <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-semibold text-[#0b1c30] font-headline tracking-tighter">Record Slaughter</h1>
                    <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.2em] mt-1">Manual Inventory Update</p>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-3xl p-10 shadow-sm border border-outline-variant/30 space-y-8">
                <div className="bg-[#0c6328]/5 rounded-2xl p-8 flex items-center justify-between border border-[#0c6328]/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0c6328]/10 flex items-center justify-center text-[#0c6328]">
                            <span className="material-symbols-outlined text-xl">pets</span>
                        </div>
                        <div>
                            <p className="text-[#0c6328] font-semibold text-[10px] uppercase tracking-widest">Available {selectedType}s</p>
                            <p className="text-slate-500 text-xs font-medium mt-0.5">Ready for slaughter</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-5xl font-semibold text-[#0c6328] tabular-nums tracking-tighter">{available}</span>
                    </div>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Select Animal Type</label>
                        <select 
                            {...register('animalType')} 
                            className="w-full bg-surface-container-low border-none rounded-2xl border-b-4 border-outline-variant focus:border-[#0c6328] focus:ring-0 py-4 px-6 text-lg font-semibold text-[#0b1c30] outline-none transition-all cursor-pointer"
                        >
                            <option value="goat">Goat</option>
                            <option value="cow">Cow</option>
                        </select>
                        {errors.animalType && <p className="text-red-500 text-xs mt-1">{errors.animalType.message}</p>}
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Number of Animals to Slaughter</label>
                        <input 
                            type="number" 
                            {...register('count', { valueAsNumber: true })} 
                            placeholder="0" 
                            className="w-full bg-surface-container-low border-none rounded-2xl border-b-4 border-outline-variant focus:border-[#0c6328] focus:ring-0 py-8 px-8 text-6xl font-semibold tabular-nums text-[#0b1c30] outline-none transition-all placeholder:text-slate-200" 
                        />
                        {errors.count && <p className="text-red-500 text-xs mt-1">{errors.count.message}</p>}
                    </div>

                    <div className="flex items-center justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-5 bg-[#0c6328] text-white font-semibold rounded-2xl shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all text-xs uppercase tracking-[0.2em] disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? 'Processing...' : 'Authorize Slaughter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SlaughterEntry



