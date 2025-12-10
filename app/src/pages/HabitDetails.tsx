import { useState, useEffect } from 'react';
import { Habit } from "../types/habits";
import { ArrowLeft, Trash2, RotateCcw } from 'lucide-react';

type Props = {
    habit: Habit;
    onIncrement: (id: number) => void;
    onFailure: (id: number) => void;
    onDelete: (id: number) => void;
    onClose: () => void;
};

type HabitCompletion = {
    id: number;
    habitId: number;
    completedAt: string;
    dayNumber: number;
    isFailure: boolean;
};

export default function HabitDetails({ habit, onIncrement, onFailure, onDelete, onClose }: Props) {
    const [showResetMessage, setShowResetMessage] = useState(false);
    const [completions, setCompletions] = useState<HabitCompletion[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const daysCompleted = habit.qtt;
    const totalDays = habit.goal || 100;
    const progressPercent = Math.min((daysCompleted / totalDays) * 100, 100);
    const isCompleted = daysCompleted >= totalDays;
    const isOffMode = habit.mode === 'OFF';

    // Check if already completed today by comparing dates
    const isCompletedToday = () => {
        if (!habit.lastIncrementedAt) return false;

        const lastDate = new Date(habit.lastIncrementedAt);
        const today = new Date();

        // Compare year, month, and day
        return (
            lastDate.getFullYear() === today.getFullYear() &&
            lastDate.getMonth() === today.getMonth() &&
            lastDate.getDate() === today.getDate()
        );
    };

    const [alreadyCompletedToday, setAlreadyCompletedToday] = useState(isCompletedToday());

    // Fetch completions for calendar
    useEffect(() => {
        const fetchCompletions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/habits/${habit.id}/completions`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setCompletions(data.data);
                }
            } catch (error) {
                console.error("Error fetching completions:", error);
            }
        };

        fetchCompletions();
    }, [habit.id, habit.qtt]);

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

    // Get emoji based on habit name
    const getEmoji = () => {
        const name = habit.name.toLowerCase();
        if (name.includes('medita')) return '🧘';
        if (name.includes('água') || name.includes('water')) return '💧';
        if (name.includes('exerc') || name.includes('gym')) return '💪';
        if (name.includes('ler') || name.includes('read')) return '📚';
        if (name.includes('inglês') || name.includes('english')) return '🇬🇧';
        if (name.includes('álcool') || name.includes('alcohol')) return '🚫🍺';
        if (name.includes('açúcar') || name.includes('sugar')) return '🚫🍬';
        if (name.includes('fumar') || name.includes('smoke')) return '🚭';
        if (name.includes('code') || name.includes('program')) return '💻';
        if (name.includes('sleep') || name.includes('dormir')) return '😴';
        return '⭐';
    };

    // Get motivational message
    const getMotivationalMessage = () => {
        if (isCompleted) {
            return "Parabéns! Você completou o desafio de 100 dias! 🎉";
        }

        const baseMessage = `Você está há ${daysCompleted} ${daysCompleted === 1 ? 'dia' : 'dias'} firme!`;
        const encouragement = isOffMode
            ? "Mantenha-se forte hoje!"
            : "Continue praticando hoje!";

        return `${baseMessage} ${encouragement}`;
    };

    // Large SVG circle
    const size = 240;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    const handleIncrement = async () => {
        try {
            await onIncrement(habit.id);
            // Mark as completed today after successful increment
            setAlreadyCompletedToday(true);
        } catch (error: any) {
            // If backend returns already completed error, show the message
            if (error.response?.data?.alreadyCompletedToday) {
                setAlreadyCompletedToday(true);
            }
        }
    };

    const handleFailure = () => {
        onFailure(habit.id);
        setShowResetMessage(true);
        setTimeout(() => setShowResetMessage(false), 3000);
    };

    const handleDelete = () => {
        onDelete(habit.id);
        onClose();
    };

    // Render 100-day calendar
    const renderCalendar = () => {
        const days = [];
        const completedDays = new Set(completions.map(c => c.dayNumber));

        for (let i = 1; i <= 100; i++) {
            const isCompleted = completedDays.has(i);
            const isFuture = i > daysCompleted;

            let bgColor = '#E5E7EB'; // Light gray for future
            if (isCompleted) {
                bgColor = color; // Habit color for completed
            }

            days.push(
                <div
                    key={i}
                    className="w-5 h-5 rounded-sm transition-colors"
                    style={{ backgroundColor: bgColor }}
                    title={`Dia ${i}${isCompleted ? ' - Concluído' : isFuture ? ' - Futuro' : ''}`}
                />
            );
        }

        return (
            <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
                {days}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col z-50 animate-fade-in overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
                </button>
                <div className="flex-1" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center p-6 space-y-6">
                {/* Icon and Title */}
                <div className="text-center">
                    <div className="text-5xl mb-3">{getEmoji()}</div>
                    <h1 className="text-2xl font-bold mb-2" style={{ color: '#222222' }}>
                        {habit.name}
                    </h1>
                    <div className="flex gap-2 justify-center">
                        <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: isOffMode ? '#FFE8E8' : '#E6F7FF',
                                color: isOffMode ? '#FF4D4F' : '#1890FF'
                            }}
                        >
                            100 Days {habit.mode}
                        </span>
                        {habit.resetOnFailure && (
                            <span
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{ backgroundColor: '#FFF7D1', color: '#B8860B' }}
                            >
                                ⚡ Reset ativo
                            </span>
                        )}
                    </div>
                </div>

                {/* Large Progress Circle */}
                <div className="relative">
                    <svg width={size} height={size} className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#E6E6E6"
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
                        <p className="text-gray-500 text-sm mb-1">DIA ATUAL</p>
                        <p className="text-5xl font-bold mb-1" style={{ color: '#222222' }}>
                            {daysCompleted}
                        </p>
                        <p className="text-gray-400 text-lg">/100</p>
                    </div>
                </div>

                {/* Motivational Message */}
                <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                    {getMotivationalMessage()}
                </p>

                {/* Reset Message */}
                {showResetMessage && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fade-in max-w-md w-full">
                        <p className="text-yellow-800 text-center font-medium">
                            ⚡ Desafio reiniciado — voltamos ao dia 1.
                        </p>
                    </div>
                )}


                {/* Action Buttons */}
                <div className="w-full max-w-md space-y-3">
                    <button
                        onClick={handleIncrement}
                        disabled={isCompleted || alreadyCompletedToday}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${isOffMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                            } ${isCompleted || alreadyCompletedToday ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                    >
                        {alreadyCompletedToday
                            ? '✓ Feito!'
                            : isOffMode
                                ? '✓ Marcar que mantive o desafio hoje'
                                : '✓ Marcar como feito hoje'}
                    </button>

                    {habit.resetOnFailure && !isCompleted && !isOffMode && (
                        <button
                            onClick={handleFailure}
                            className="w-full text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                            Quebrei hoje
                        </button>
                    )}
                </div>

                {/* 100-Day Calendar */}
                <div className="w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-3 text-center" style={{ color: '#222222' }}>
                        Histórico (100 dias)
                    </h3>
                    {renderCalendar()}
                </div>

                {/* Settings */}
                <div className="w-full max-w-md border-t border-gray-200 dark:border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold mb-3" style={{ color: '#222222' }}>
                        Configurações
                    </h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => alert('Funcionalidade em desenvolvimento')}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                        >
                            Editar hábito
                        </button>
                        <button
                            onClick={() => alert('Funcionalidade em desenvolvimento')}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                        >
                            Alterar cor e ícone
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Tem certeza que deseja resetar o progresso? Esta ação não pode ser desfeita.')) {
                                    handleFailure();
                                }
                            }}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-yellow-600 dark:text-yellow-500 flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Resetar progresso
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-500 flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-3" style={{ color: '#222222' }}>
                            Excluir hábito?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Tem certeza que deseja excluir "{habit.name}"? Todo o progresso será perdido e esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
