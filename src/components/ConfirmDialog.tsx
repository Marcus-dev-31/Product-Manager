import { Button } from './Button'

interface ConfirmDialogProps {
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export const ConfirmDialog = ({ message, onConfirm, onCancel }: ConfirmDialogProps) => {
    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <p className="confirm-dialog-message">{message}</p>
                <div className="confirm-dialog-actions">
                    <Button variant="confirm" onClick={onConfirm}>Sí, continuar</Button>
                    <Button variant="cancel" onClick={onCancel}>Cancelar</Button>
                </div>
            </div>
        </div>
    )
}