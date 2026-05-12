import { useState, useRef, useEffect } from 'react'

const CustomSelect = ({ value, onChange, options, icon, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative w-full" ref={selectRef}>
            <div
                className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-10 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    isOpen ? 'bg-white border-primary ring-4 ring-primary/10' : 'hover:bg-surface-container hover:border-outline-variant/50'
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {icon && (
                    <div className="absolute left-4 text-on-surface-variant flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <span className={`font-medium ${!value ? 'text-on-surface-variant' : 'text-on-surface'} select-none`}>
                    {value || placeholder || 'Select an option'}
                </span>
                <span className={`absolute right-4 text-on-surface-variant material-symbols-outlined transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''} pointer-events-none`}>
                    expand_more
                </span>
            </div>

            {isOpen && (
                <div className="absolute z-[100] w-full mt-2 bg-white border border-outline-variant/10 rounded-xl shadow-xl shadow-on-surface/5 overflow-hidden animate-fadeIn">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {options.map((option, idx) => (
                            <div
                                key={idx}
                                className={`px-4 py-3 cursor-pointer rounded-lg text-sm font-medium transition-colors select-none ${
                                    value === (option.value || option) 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                                }`}
                                onClick={() => {
                                    onChange(option.value || option)
                                    setIsOpen(false)
                                }}
                            >
                                {option.label || option.value || option}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomSelect
