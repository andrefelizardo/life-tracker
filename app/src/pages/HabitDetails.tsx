import { useState } from 'react';
import { Habit } from "../types/habits";
import { ArrowLeft } from 'lucide-react';

type Props = {
    habit: Habit;
    onIncrement: (id: number) => void;
    onFailure: (id: number) => void;
    onClose: () => void;
};

export default function HabitDetails({ habit, onIncrement, onFailure, onClose }: Props) {
    const [showResetMessage, setShowResetMessage] = useState(false);

    const daysCompleted = habit.qtt;
    const totalDays = habit.goal || 100;
    const progressPercent = Math.min((daysCompleted / totalDays) * 100, 100);
    const isCompleted = daysCompleted >= totalDays;
    const isOffMode = habit.mode === 'OFF';

    // Determine color based on mode
    const getColor = () => {
        if (isCompleted) return '#fbbf24'; // Gold

        switch (habit.mode) {
            case 'ON':
                return '#10b981'; // Green
            case 'OFF':
                return '#f97316'; // Orange
            default:
                return '#3b82f6'; // Blue
        }
    };

    const color = getColor();

    // Large SVG circle
    const size = 240;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    const handleIncrement = () => {
        onIncrement(habit.id);
    };

    const handleFailure = () => {
        onFailure(habit.id);
        setShowResetMessage(true);
        setTimeout(() => setShowResetMessage(false), 3000);
    };

    return (
        <div className="fixed inset-0 bg-black/95 flex flex-col z-50 animate-fade-in overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h2 className="text-white font-bold text-xl truncate flex-1 text-center">
                    {habit.name}
                </h2>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {/* Large Progress Bubble */}
                <div className="relative mb-8">
                    <svg width={size} height={size} className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth={strokeWidth}
                        />
                        {/* Progress circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-500 ease-out"
                            style={{
                                filter: isCompleted ? 'drop-shadow(0 0 12px currentColor)' : 'none',
                            }}
                        />
                    </svg>

                    {/* Content inside */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-white text-6xl font-bold mb-2">{daysCompleted}</p>
                        <p className="text-white/60 text-lg">de {totalDays} dias</p>
                    </div>
                </div>

                {/* Day Counter */}
                <h3 className="text-white text-3xl font-bold mb-8">
                    Dia {daysCompleted} de {totalDays}
                </h3>

                {/* Reset Message */}
                {showResetMessage && (
                    <div className="mb-6 bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 animate-fade-in">
                        <p className="text-yellow-200 text-center font-medium">
                            ⚡ Desafio reiniciado — voltamos ao dia 1.
                        </p>
                    </div>
                )}

                {/* Completed Message */}
                {isCompleted && (
                    <div className="mb-6 bg-yellow-900/50 border border-yellow-700 rounded-lg p-4">
                        <p className="text-yellow-200 text-center font-bold text-lg">
                            🎉 Parabéns! Você completou o desafio de 100 dias!
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="w-full max-w-md space-y-3">
                    <button
                        onClick={handleIncrement}
                        disabled={isCompleted}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${isOffMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                            } ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                    >
                        {isOffMode ? '✓ Marcar que mantive o desafio hoje' : '✓ Marcar como feito hoje'}
                    </button>

                    {habit.resetOnFailure && !isCompleted && (
                        <button
                            onClick={handleFailure}
                            className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800 transition-all hover:scale-105"
                        >
                            ✗ Quebrei hoje
                        </button>
                    )}
                </div>

                {/* Info */}
                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Modo: <span className="text-white font-medium">{habit.mode}</span>
                    </p>
                    {habit.resetOnFailure && (
                        <p className="text-yellow-400 text-sm mt-1">
                            ⚡ Modo Reset ativado
                        </p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                        Último registro:{' '}
                        {habit.lastIncrementedAt
                            ? new Date(habit.lastIncrementedAt).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                            : 'Nunca'}
                    </p>
                </div>
            </div>
        </div>
    );
}
