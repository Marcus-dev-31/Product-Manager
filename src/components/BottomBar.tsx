import { Download, Upload } from 'lucide-react'
import { useRef } from 'react'

interface BottomBarProps {
    onExport: () => void
    onImport: (file: File) => void
}

export const BottomBar = ({ onExport, onImport }: BottomBarProps) => {
    const fileRef = useRef<HTMLInputElement>(null)

    return (
        <div className="bottom-bar">
            <button className="bottom-bar-btn" onClick={onExport}>
                <Download size={22} />
            </button>

            <button className="bottom-bar-btn" onClick={() => fileRef.current?.click()}>
                <Upload size={22} />
            </button>

            <input
                type="file"
                accept=".json"
                ref={fileRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onImport(file)
                    e.target.value = ''
                }}
            />
        </div>
    )
}