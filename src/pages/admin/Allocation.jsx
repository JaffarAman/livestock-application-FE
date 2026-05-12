import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchBatches } from '../../store/slices/batchSlice'
import { fetchBranches } from '../../store/slices/branchSlice'
import { createAllocation } from '../../store/slices/allocationSlice'
import { formatId } from '../../utils/formatId'
import { 
    Network, 
    ArrowRight, 
    Box, 
    Building2, 
    CheckCircle2, 
    AlertCircle,
    Info,
    Move
} from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const schema = z.object({
  batchId: z.string().min(1, "Please select an inventory source"),
  branchId: z.string().min(1, "Please select a target branch"),
  quantity: z.number({ invalid_type_error: "Must be a number" }).int("Must be an integer").min(1, "Quantity must be at least 1")
});

const Allocation = () => {
    const dispatch = useDispatch()
    const { allBatches } = useSelector(state => state.batch)
    const { branches } = useSelector(state => state.branch)
    const { loading: allocLoading, error: allocError } = useSelector(state => state.allocation)

    const [successMsg, setSuccessMsg] = useState('')

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            batchId: '',
            branchId: '',
            quantity: ''
        }
    })

    useEffect(() => {
        dispatch(fetchBatches())
        dispatch(fetchBranches())
    }, [dispatch])

    const onSubmit = async (data) => {
        const res = await dispatch(createAllocation(data))
        if (res.meta.requestStatus === 'fulfilled') {
            setSuccessMsg('Stock successfully deployed to branch.')
            reset()
            dispatch(fetchBatches()) 

            setTimeout(() => setSuccessMsg(''), 5000)
        }
    }

    return (
        <div className="max-w-[800px] mx-auto space-y-10 animate-fadeIn">
            {/* Header Area */}
            <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-4">
                    <Network size={20} />
                </div>
                <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Deploy Livestock Assets</h1>
                <p className="text-on-surface-variant font-medium max-w-lg mx-auto">
                    Strategically distribute received batches to regional processing branches across the network.
                </p>
            </div>

            {successMsg && (
                <div className="p-4 bg-primary/5 text-primary border border-primary/20 rounded-2xl flex items-center gap-3 animate-slideUp">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-medium">{successMsg}</span>
                </div>
            )}

            {allocError && (
                <div className="p-4 bg-error/5 text-error border border-error/20 rounded-2xl flex items-center gap-3 animate-slideUp">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">{allocError}</span>
                </div>
            )}

            <div className="flex justify-center">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white p-10 rounded-[2.5rem] border border-outline-variant/30 shadow-sm space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/60 ml-1">Select Inventory Source</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                                    <Box size={18} />
                                </div>
                                <select 
                                    {...register('batchId')}
                                    className={`w-full bg-white border border-outline-variant/40 rounded-2xl py-4 pl-10 pr-4 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm font-medium appearance-none cursor-pointer text-on-surface ${errors.batchId ? 'border-2 border-red-500' : ''}`}
                                >
                                    <option value="" disabled>Choose active batch...</option>
                                    {allBatches?.filter(b => b.remainingAnimals > 0).map(b => (
                                        <option key={b._id} value={b._id}>{formatId(b._id, 'BATCH')} ({b.Category}) - {b.remainingAnimals} units left</option>
                                    ))}
                                </select>
                            </div>
                            {errors.batchId && <p className="text-red-500 text-xs ml-1">{errors.batchId.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant/60 ml-1">Target Processing Branch</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                                    <Building2 size={18} />
                                </div>
                                <select 
                                    {...register('branchId')}
                                    className={`w-full bg-white border border-outline-variant/40 rounded-2xl py-4 pl-10 pr-4 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-sm font-medium appearance-none cursor-pointer text-on-surface ${errors.branchId ? 'border-2 border-red-500' : ''}`}
                                >
                                    <option value="" disabled>Choose target branch...</option>
                                    {branches?.map(b => (
                                        <option key={b._id} value={b._id}>{b.name} - {b.location}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.branchId && <p className="text-red-500 text-xs ml-1">{errors.branchId.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="Quantity to Allocate"
                                placeholder="e.g. 50"
                                type="number"
                                icon={Move}
                                {...register('quantity', { valueAsNumber: true })}
                                error={errors.quantity?.message}
                            />
                        </div>

                    </div>

                    <div className="p-6 bg-surface-container-low/30 rounded-2xl border border-outline-variant/20 flex gap-4 items-start">
                        <Info size={20} className="text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-on-surface uppercase tracking-widest">Allocation Policy</p>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Deploying assets to a branch will immediately update local inventory levels. 
                                Verify the transport manifest matches the electronic allocation.
                            </p>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full py-4 text-sm uppercase tracking-widest font-semibold shadow-xl shadow-primary/20 bg-primary"
                        isLoading={allocLoading}
                        icon={ArrowRight}
                    >
                        Execute Deployment
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default Allocation
