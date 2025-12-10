
import { Edit2, Pause, RotateCcw, Trash2, X } from 'lucide-react';

type Props = {
    onEdit: () => void;
    onPause: () => void;
    onRestart: () => void;
    onDelete: () => void;
    onClose: () => void;
    habitName: string;
    canRestart: boolean;
};

export default function ContextMenu({
    onEdit,
    onPause,
    onRestart,
    onDelete,
    onClose,
    habitName,
    canRestart,
}: Props) {
    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm mx-4 border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-lg truncate">{habitName}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={() => {
                            onEdit();
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    >
                        <Edit2 className="w-5 h-5" />
                        <span>Editar hábito</span>
                    </button>

                    <button
                        onClick={() => {
                            onPause();
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                    >
                        <Pause className="w-5 h-5" />
                        <span>Pausar desafio</span>
                    </button>

                    {canRestart && (
                        <button
                            onClick={() => {
                                onRestart();
                                onClose();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-900/50 hover:bg-yellow-900 text-yellow-200 transition-colors border border-yellow-800"
                        >
                            <RotateCcw className="w-5 h-5" />
                            <span>Reiniciar desafio</span>
                        </button>
                    )}

                    <button
                        onClick={() => {
                            onDelete();
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-900/50 hover:bg-red-900 text-red-200 transition-colors border border-red-800"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span>Deletar hábito</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
