import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBranchStats } from '../../store/slices/dashboardSlice'
import { createSlaughterRecord, fetchSlaughterRecords } from '../../store/slices/slaughterSlice'
import { 
    Zap, 
    ArrowRight, 
    Scissors, 
    CheckCircle2, 
    AlertCircle,
    Info,
    Layers,
    Beef
} from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const QuickEntry = () => {
    const dispatch = useDispatch()
    const { stats } = useSelector(state => state.dashboard)
    const { loading, error } = useSelector(state => state.slaughter)
    const [success, setSuccess] = useState(false)
    const [localError, setLocalError] = useState('')
    const [animalType, setAnimalType] = useState('goat')

    const [form, setForm] = useState({
        count: '',
        meatWeight: '',
        skinsCount: '',
        payeCount: ''
    })

    // Auto-calculate processing units
    useEffect(() => {
        const count = Number(form.count) || 0;
        if (count > 0) {
            setForm(prev => ({
                ...prev,
                skinsCount: count,
                payeCount: count * 4
            }));
        } else {
            setForm(prev => ({
                ...prev,
                skinsCount: '',
                payeCount: ''
            }));
        }
    }, [form.count]);

    useEffect(() => {
        dispatch(fetchBranchStats())
    }, [dispatch])

    const remainingCows = stats?.remainingCows || 0;
    const remainingGoats = stats?.remainingGoats || 0;
    const totalAvailable = animalType === 'cow' ? remainingCows : remainingGoats;
    const selectedLabel = animalType === 'cow' ? 'Cows' : 'Goats';

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError('')

        if (totalAvailable < Number(form.count)) {
            setLocalError(`Insufficient stock. Only ${totalAvailable} ${selectedLabel.toLowerCase()} remaining.`);
            return;
        }
        
        const res = await dispatch(createSlaughterRecord({
            animalType,
            count: Number(form.count),
            meatWeight: Number(form.meatWeight) || 0,
            skinsCount: Number(form.skinsCount) || 0,
            payeCount: Number(form.payeCount) || 0
        }))

        if (res.meta.requestStatus === 'fulfilled') {
            setSuccess(true)
            setForm({ 
                count: '',
                meatWeight: '',
                skinsCount: '',
                payeCount: ''
            })
            dispatch(fetchBranchStats())
            dispatch(fetchSlaughterRecords())
            setTimeout(() => setSuccess(false), 5000)
        }
    }

    return (
        <div className="max-w-[800px] mx-auto space-y-10 animate-fadeIn">
            {/* Header Area */}
            <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-4">
                    <Zap size={20} />
                </div>

                <h1 className="text-xl font-semibold text-on-surface font-headline tracking-tight">Operation Terminal</h1>
                <p className="text-on-surface-variant font-medium max-w-lg mx-auto">
                    Record slaughter data. Stocks update automatically in real-time.
                </p>
            </div>

            {/* Global Stock Status */}
            <div className={`p-8 rounded-[2rem] border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 ${
                totalAvailable > 0 ? 'bg-primary/5 border-primary/20' : 'bg-error/5 border-error/20'
            }`}>
                <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${
                        totalAvailable > 0 ? 'bg-primary text-white' : 'bg-error text-white'
                    }`}>
                        <Beef size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold opacity-40 uppercase tracking-[0.2em] mb-1">Available Live Stock</p>
                        <h2 className="text-xl font-semibold tabular-nums">{totalAvailable} <span className="text-sm opacity-60">{selectedLabel}</span></h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest opacity-60">Live Inventory Active</span>
                </div>
            </div>

            {(success || error || localError) && (
                <div className={`p-4 border rounded-2xl flex items-center gap-3 animate-slideUp ${
                    success ? 'bg-primary/5 text-primary border-primary/20' : 'bg-error/5 text-error border-error/20'
                }`}>
                    {success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-medium">{success ? 'Operation record submitted and verified.' : (error || localError)}</span>
                </div>
            )}

            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="w-full bg-white p-10 rounded-[2.5rem] border border-outline-variant/30 shadow-sm space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Input
                                label="Animal Type"
                                as="select"
                                icon={Beef}
                                value={animalType}
                                onChange={(e) => setAnimalType(e.target.value)}
                                className="cursor-pointer"
                            >
                                <option value="goat">Goat</option>
                                <option value="cow">Cow</option>
                            </Input>
                            <p className="text-[10px] font-semibold text-on-surface-variant/70 uppercase tracking-widest">
                                Goats: {remainingGoats} • Cows: {remainingCows}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Animals Slaughtered"
                                placeholder="0"
                                type="number"
                                icon={Scissors}
                                value={form.count}
                                onChange={(e) => setForm({ ...form, count: e.target.value })}
                                max={totalAvailable}
                                required
                                disabled={totalAvailable === 0}
                            />
                            <Input
                                label="Meat Weight (KG)"
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                icon={Layers}
                                value={form.meatWeight}
                                onChange={(e) => setForm({ ...form, meatWeight: e.target.value })}
                                required
                                disabled={totalAvailable === 0}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low/20 p-6 rounded-3xl border border-outline-variant/10">
                            <Input
                                label="Skins Yield (Auto)"
                                placeholder="0"
                                type="number"
                                icon={Layers}
                                value={form.skinsCount}
                                readOnly
                                className="bg-white/50"
                            />
                            <Input
                                label="Paye Yield (Auto)"
                                placeholder="0"
                                type="number"
                                icon={Layers}
                                value={form.payeCount}
                                readOnly
                                className="bg-white/50"
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-surface-container-low/30 rounded-2xl border border-outline-variant/20 flex gap-4 items-start">
                        <Info size={20} className="text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-on-surface uppercase tracking-widest">Automatic Deduction</p>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Submitting this form will automatically deduct animals from the oldest available batches in the branch inventory.
                            </p>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full py-4 text-sm uppercase tracking-widest font-semibold shadow-xl shadow-primary/20 bg-primary"
                        isLoading={loading}
                        icon={ArrowRight}
                        disabled={totalAvailable === 0 || !form.count}
                    >
                        {totalAvailable === 0 ? 'Out of Stock' : 'Confirm & Record Operation'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default QuickEntry
