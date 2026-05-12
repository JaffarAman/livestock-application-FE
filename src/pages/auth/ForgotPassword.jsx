// src/pages/auth/ForgotPassword.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { forgetPassword, verifyOtp, changePassword } from '../../store/slices/authSlice'
import { Mail, KeyRound, Lock, ShieldCheck, ArrowLeft, Eye, EyeOff, ShieldAlert } from 'lucide-react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const ForgotPassword = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading, error } = useSelector(state => state.auth)
    
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Password
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' })
    const [localError, setLocalError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSendOtp = async (e) => {
        e.preventDefault()
        setLocalError('')
        setSuccessMessage('')
        const result = await dispatch(forgetPassword({ email }))
        if (result.meta.requestStatus === 'fulfilled') {
            setStep(2)
            setSuccessMessage('OTP sent to your email')
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setLocalError('')
        setSuccessMessage('')
        const result = await dispatch(verifyOtp({ email, otp }))
        if (result.meta.requestStatus === 'fulfilled') {
            setStep(3)
            setSuccessMessage('OTP verified successfully')
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setLocalError('')
        setSuccessMessage('')
        if (passwords.newPassword !== passwords.confirmPassword) {
            setLocalError('Passwords do not match')
            return
        }
        const result = await dispatch(changePassword({ 
            email, 
            newPassword: passwords.newPassword, 
            confirmPassword: passwords.confirmPassword 
        }))
        if (result.meta.requestStatus === 'fulfilled') {
            setSuccessMessage('Password reset successfully! Redirecting...')
            setTimeout(() => navigate('/login'), 2000)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-3 bg-background font-body selection:bg-primary/20 selection:text-primary">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-primary to-primary/10"></div>
            
            <main className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden relative z-10 animate-fadeIn">
                {/* Header Section */}
                <div className="px-8 pt-8 pb-6 text-center border-b border-surface-container-low">
                    <div className="mb-3 flex flex-col items-center">
                        <img src="/saylani_logo-removebg-preview.png" alt="Saylani" className="h-16 w-auto mb-2" />
                        <p className="text-[9px] font-semibold text-on-surface-variant/40 uppercase tracking-[0.2em]">
                            Recovery Portal
                        </p>
                    </div>

                    {(error || localError) && (
                        <div className="mt-2 mb-2 p-2.5 bg-error/5 text-error border border-error/10 rounded-lg text-[10px] font-medium flex items-center justify-center gap-2 animate-fadeIn">
                            <ShieldAlert size={14} />
                            {error || localError}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mt-2 mb-2 p-2.5 bg-primary/5 text-primary border border-primary/10 rounded-lg text-[10px] font-medium flex items-center justify-center gap-2 animate-fadeIn">
                            <ShieldCheck size={14} />
                            {successMessage}
                        </div>
                    )}
                    
                    <h2 className="text-lg font-medium font-headline text-on-surface mt-2">
                        {step === 1 && "Forgot Password?"}
                        {step === 2 && "Verify Identity"}
                        {step === 3 && "Reset Password"}
                    </h2>
                    <p className="text-xs font-medium text-on-surface-variant mt-1.5">
                        {step === 1 && "Enter your email to receive a recovery code"}
                        {step === 2 && <>Enter the code sent to <b>{email}</b></>}
                        {step === 3 && "Create a new secure password"}
                    </p>
                </div>

                <div className="px-8 py-6">
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <Input
                                label="Email"
                                icon={Mail}
                                placeholder="admin@saylani.org"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button 
                                className="w-full"
                                type="submit"
                                isLoading={loading}
                                size="sm"
                            >
                                Send OTP
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <Input
                                label="Verification Code"
                                icon={KeyRound}
                                placeholder="000000"
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="tracking-[0.5em] text-center font-bold"
                            />
                            <Button 
                                className="w-full"
                                type="submit"
                                isLoading={loading}
                                size="sm"
                            >
                                Verify OTP
                            </Button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant/60">
                                    New Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        className="block w-full pl-9 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-white border-b-2 border-transparent focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 transition-all font-medium text-sm outline-none"
                                        placeholder="••••••••"
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                        required
                                    />
                                    <button
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant/40 hover:text-on-surface transition-colors"
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-semibold uppercase tracking-widest text-on-surface-variant/60">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        className="block w-full pl-9 pr-10 py-2.5 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-white border-b-2 border-transparent focus:border-primary text-on-surface placeholder:text-on-surface-variant/30 transition-all font-medium text-sm outline-none"
                                        placeholder="••••••••"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                        required
                                    />
                                    <button
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant/40 hover:text-on-surface transition-colors"
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <Button 
                                className="w-full"
                                type="submit"
                                isLoading={loading}
                                size="sm"
                            >
                                Reset Password
                            </Button>
                        </form>
                    )}

                    <div className="mt-4">
                        <Link 
                            to="/login" 
                            className="text-[9px] font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={12} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ForgotPassword
