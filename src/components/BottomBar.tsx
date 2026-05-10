import { Plus } from 'lucide-react'

interface BottomBarProps {
    onAdd: () => void
}

export const BottomBar = ({ onAdd }: BottomBarProps) => {
    return (
        <button className="fab" onClick={onAdd}>
            <Plus size={20} />
            Agregar
        </button>
    )
}