// src/pages/admin/CreateBatch.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBatch } from '../../store/slices/batchSlice'
import { 
    PackagePlus, 
    Calendar, 
    Tag, 
    ArrowRight, 
    Info, 
    CheckCircle2, 
    AlertCircle,
    Hash,
    PlusCircle
} from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const schema = z.object({
  BatchNum: z.string().min(1, "Batch Number is required").max(30, "Max 30 characters"),
  TotalAnimals: z.number({ invalid_type_error: "Must be a number" }).int("Must be an integer").min(1, "Must be at least 1"),
  Category: z.enum(['cow', 'goat'], { errorMap: () => ({ message: "Category must be cow or goat" }) }),
  ArrivalDate: z.string().min(1, "Arrival Date is required")
});

const CreateBatch = () => {
    const dispatch = useDispatch()
    const { loading, error } = useSelector(state => state.batch)
    const [success, setSuccess] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            BatchNum: '',
            TotalAnimals: '',
            Category: 'cow',
            ArrivalDate: new Date().toISOString().split('T')[0]
        }
    })

    const onSubmit = async (data) => {
        const res = await dispatch(createBatch({
            ...data,
            BatchNum: data.BatchNum.toString()
        }))
        if (res.meta.requestStatus === 'fulfilled') {
            setSuccess(true)
            reset()
            setTimeout(() => setSuccess(false), 5000)
        }
    }

    return (
        <div className="max-w-[800px] mx-auto space-y-10 animate-fadeIn">
            <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-4">
                    <PackagePlus size={20} />
                </div>
                <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Initialize Inventory Batch</h1>
                <p className="text-on-surface-variant font-medium max-w-md mx-auto">
                    Register a new shipment of livestock into the central tracking system.
                </p>
            </div>

            {success && (
                <div className="p-4 bg-primary/5 text-primary border border-primary/20 rounded-2xl flex items-center gap-3 animate-slideUp">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-medium">Inventory record initialized successfully.</span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-error/5 text-error border border-error/20 rounded-2xl flex items-center gap-3 animate-slideUp">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-3xl border border-outline-variant/30 shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                        <Input
                            label="Batch Reference Number"
                            placeholder="e.g. 5021"
                            type="text"
                            icon={Hash}
                            {...register('BatchNum')}
                            error={errors.BatchNum?.message}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/60 ml-1">Livestock Category</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                                <Tag size={18} />
                            </div>
                            <select 
                                {...register('Category')}
                                className={`w-full bg-surface-container-low border-none rounded-2xl py-4 pl-10 pr-4 focus:ring-2 focus:ring-primary/10 outline-none text-sm font-medium appearance-none cursor-pointer ${errors.Category ? 'border-2 border-red-500' : ''}`}
                            >
                                <option value="cow">Cow</option>
                                <option value="goat">Goat</option>
                            </select>
                        </div>
                        {errors.Category && <p className="text-red-500 text-xs ml-1">{errors.Category.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <Input
                            label="Initial Unit Count"
                            placeholder="e.g. 100"
                            type="number"
                            icon={PlusCircle}
                            {...register('TotalAnimals', { valueAsNumber: true })}
                            error={errors.TotalAnimals?.message}
                        />
                    </div>

                    <div className="space-y-1">
                        <Input
                            label="Physical Arrival Date"
                            type="date"
                            icon={Calendar}
                            {...register('ArrivalDate')}
                            error={errors.ArrivalDate?.message}
                        />
                    </div>
                </div>

                <div className="p-6 bg-surface-container-low/30 rounded-2xl border border-outline-variant/20 flex gap-4 items-start">
                    <Info size={20} className="text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-on-surface uppercase tracking-widest">Audit Notice</p>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                            Once established, the batch ID becomes a permanent reference for all downstream allocations and processing logs. 
                            Ensure unit counts match the physical delivery manifest exactly.
                        </p>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full py-4 text-sm uppercase tracking-widest font-semibold shadow-xl shadow-primary/20 bg-primary"
                    isLoading={loading}
                    icon={ArrowRight}
                >
                    Finalize Batch Entry
                </Button>
            </form>
        </div>
    )
}

export default CreateBatch
