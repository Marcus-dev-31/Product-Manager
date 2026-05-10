import { Search, X } from 'lucide-react'
import { ChangeEvent } from 'react'

interface SearchBarProps {
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onClear: () => void
}

export const SearchBar = ({ value, onChange, onClear }: SearchBarProps) => {
    return (
        <div className="search-bar">
            <span className="search-icon"><Search size={18} /></span>
            <input
                type="search"
                placeholder="Buscar producto..."
                value={value}
                onChange={onChange}
            />
            {value && (
                <button className="search-clear-btn" onClick={onClear}>
                    <X size={14} />
                </button>
            )}
        </div>
    )
}