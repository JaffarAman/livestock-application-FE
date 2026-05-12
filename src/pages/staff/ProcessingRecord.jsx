// src/pages/staff/ProcessingRecord.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProcessing, getAllProcesses } from '../../store/slices/processSlice'
import { getAllSlaughters } from '../../store/slices/slaughterSlice'
import { getInventory } from '../../store/slices/inventorySlice'
import { formatId } from '../../utils/formatId'
import { 
    ClipboardList, 
    ArrowRight, 
    CheckCircle2, 
    AlertCircle, 
    Scale, 
    PlusCircle,
    Info,
    Hash
} from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const schema = z.object({
  slaughterId: z.string().min(1, "Please select a slaughter record"),
  meatWeight: z.number({ invalid_type_error: "Must be a number" }).min(0.1, "Meat weight must be > 0"),
  skins: z.number({ invalid_type_error: "Must be a number" }).int("Must be an integer").min(1, "Must be > 0"),
  paye: z.number({ invalid_type_error: "Must be a number" }).int("Must be an integer").min(1, "Must be > 0")
});

const ProcessingRecord = () => {
    const [success, setSuccess] = useState(false)
    const dispatch = useDispatch()
    const { loading, error, processes } = useSelector(state => state.process)
    const { slaughters } = useSelector(state => state.slaughter)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            slaughterId: '',
            meatWeight: '',
            skins: '',
            paye: ''
        }
    });

    useEffect(() => {
        dispatch(getAllSlaughters())
        dispatch(getAllProcesses())
    }, [dispatch])

    const onSubmit = async (data) => {
        try {
            await dispatch(createProcessing({
                slaughterId: data.slaughterId,
                data: {
                    meatWeight: data.meatWeight,
                    skins: data.skins,
                    paye: data.paye
                }
            })).unwrap()
            
            setSuccess(true)
            reset()
            
            dispatch(getAllSlaughters())
            dispatch(getAllProcesses())
            dispatch(getInventory())
            setTimeout(() => setSuccess(false), 5000)
        } catch (err) {
            console.error(err)
        }
    }

    const processedSlaughterIds = new Set((processes || []).map((p) => p.slaughterId?._id || p.slaughterId));
    const availableSlaughters = (slaughters || []).filter((s) => !processedSlaughterIds.has(s._id));

    return (
        <div className="max-w-[800px] mx-auto space-y-10 animate-fadeIn">
            <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-4">
                    <ClipboardList size={20} />
                </div>
                <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Processing</h1>
                <p className="text-on-surface-variant font-medium max-w-md mx-auto">
                    Record secondary processing results and byproduct collection for verification.
                </p>
            </div>

            {success && (
                <div className="p-4 bg-primary/5 text-primary border border-primary/20 rounded-2xl flex items-center gap-3 animate-slideUp">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-medium">Processing record saved.</span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-error/5 text-error border border-error/20 rounded-2xl flex items-center gap-3 animate-slideUp">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-[2.5rem] border border-outline-variant/30 shadow-sm space-y-8">
                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/60 ml-1">Select Slaughter Record</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                                <Hash size={18} />
                            </div>
                            <select 
                                {...register('slaughterId')}
                                className={`w-full bg-surface-container-low border-none rounded-2xl py-4 pl-10 pr-4 focus:ring-2 focus:ring-primary/10 outline-none text-sm font-medium appearance-none cursor-pointer ${errors.slaughterId ? 'border-2 border-red-500' : ''}`}
                            >
                                <option value="" disabled>Choose unverified slaughter...</option>
                                {availableSlaughters.map(s => (
                                    <option key={s._id} value={s._id}>
                                        {formatId(s._id, 'SLAUGHT')} — Count: {s.count}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.slaughterId && <p className="text-red-500 text-xs ml-1">{errors.slaughterId.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Input
                                label="Total Meat Weight (kg)"
                                placeholder="0.0"
                                type="number"
                                step="0.1"
                                icon={Scale}
                                {...register('meatWeight', { valueAsNumber: true })}
                                error={errors.meatWeight?.message}
                            />
                        </div>
                        <div className="space-y-1">
                            <Input
                                label="Khal (Skins) Count"
                                placeholder="0"
                                type="number"
                                icon={Hash}
                                {...register('skins', { valueAsNumber: true })}
                                error={errors.skins?.message}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Input
                            label="Paye Sets Collected"
                            placeholder="0"
                            type="number"
                            icon={PlusCircle}
                            {...register('paye', { valueAsNumber: true })}
                            error={errors.paye?.message}
                        />
                    </div>
                </div>

                <div className="p-6 bg-surface-container-low/30 rounded-2xl border border-outline-variant/20 flex gap-4 items-start">
                    <Info size={20} className="text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-on-surface uppercase tracking-widest">Audit Compliance</p>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                            Yield records must correspond to the animal count in the selected slaughter batch. 
                            Inconsistent ratios will be flagged for branch manager review.
                        </p>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full py-4 text-sm uppercase tracking-widest font-semibold shadow-xl shadow-primary/20 bg-primary"
                    isLoading={loading}
                    icon={ArrowRight}
                >
                    Save Processing Record
                </Button>
            </form>
        </div>
    )
}

export default ProcessingRecord
