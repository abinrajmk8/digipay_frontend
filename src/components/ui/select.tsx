import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectContextType {
    value?: string
    onValueChange?: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
    labels: Record<string, React.ReactNode>
    registerLabel: (value: string, label: React.ReactNode) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

interface SelectProps {
    children: React.ReactNode
    value?: string
    onValueChange?: (value: string) => void
    defaultValue?: string
}

const Select: React.FC<SelectProps> = ({ children, value, onValueChange, defaultValue }) => {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>({})

    const handleValueChange = (newValue: string) => {
        setInternalValue(newValue)
        onValueChange?.(newValue)
    }

    const registerLabel = React.useCallback((val: string, label: React.ReactNode) => {
        setLabels((prev) => {
            if (prev[val] === label) return prev;
            return { ...prev, [val]: label }
        })
    }, [])

    const currentValue = value !== undefined ? value : internalValue

    return (
        <SelectContext.Provider
            value={{
                value: currentValue,
                onValueChange: handleValueChange,
                open,
                setOpen,
                labels,
                registerLabel
            }}
        >
            <div className="relative inline-block w-full text-left">
                {children}
            </div>
        </SelectContext.Provider>
    )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
}

const SelectTrigger: React.FC<SelectTriggerProps> = ({ className, children, ...props }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectTrigger must be used within a Select")
    const { open, setOpen } = context

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
        }
    }

    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            onKeyDown={handleKeyDown}
            aria-expanded={open}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    )
}

interface SelectValueProps {
    placeholder?: string
    className?: string
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, className }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectValue must be used within a Select")
    const { value, labels } = context

    const displayValue = (value && labels[value]) ? labels[value] : (value || placeholder)

    return (
        <span className={cn("block truncate", className)}>
            {displayValue}
        </span>
    )
}

interface SelectContentProps {
    children: React.ReactNode
    className?: string
}

const SelectContent: React.FC<SelectContentProps> = ({ children, className }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectContent must be used within a Select")
    const { open, setOpen } = context
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                // If the click target is the trigger, let the trigger handle it.
                const target = e.target as HTMLElement;
                if (target.closest('button[aria-expanded]')) return;
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleDocumentClick)
        }
        return () => {
            document.removeEventListener("mousedown", handleDocumentClick)
        }
    }, [open, setOpen])

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false)
            }
        }
        if (open) {
            document.addEventListener("keydown", handleKeyDown)
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [open, setOpen])

    if (!open) return null

    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md animate-in fade-in-80",
                className
            )}
            role="listbox"
        >
            {children}
        </div>
    )
}

interface SelectItemProps {
    children: React.ReactNode
    value: string
    className?: string
}

const SelectItem: React.FC<SelectItemProps> = ({ children, value, className }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectItem must be used within a Select")
    const { onValueChange, setOpen, value: selectedValue, registerLabel } = context

    React.useEffect(() => {
        registerLabel(value, children)
    }, [value, children, registerLabel])

    const isSelected = selectedValue === value

    const handleSelect = () => {
        onValueChange?.(value)
        setOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleSelect()
        }
    }

    return (
        <div
            role="option"
            aria-selected={isSelected}
            tabIndex={0}
            onClick={handleSelect}
            onKeyDown={handleKeyDown}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <Check className="h-4 w-4" />}
            </span>
            <span className="truncate">{children}</span>
        </div>
    )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
