import { useState, useRef, useEffect } from 'react';
import { Habit } from "../types/habits";

type Props = {
    habit: Habit;
    onClick: () => void;
    onLongPress: () => void;
};

export default function ProgressBubble({ habit, onClick, onLongPress }: Props) {
    const [isPressed, setIsPressed] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);

    // Calculate progress
    const daysCompleted = habit.qtt;
    const totalDays = habit.goal || 100;
    const progressPercent = Math.min((daysCompleted / totalDays) * 100, 100);
    const isCompleted = daysCompleted >= totalDays;

    // Determine color based on mode
    const getColor = () => {
        if (isCompleted) return '#fbbf24'; // Gold for completed

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

    // SVG circle properties
    const size = 140;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    // Get emoji based on habit name (simple mapping)
    const getEmoji = () => {
        const name = habit.name.toLowerCase();
        if (name.includes('medita')) return '🧘';
        if (name.includes('água') || name.includes('water')) return '💧';
        if (name.includes('exerc') || name.includes('gym')) return '💪';
        if (name.includes('ler') || name.includes('read')) return '📚';
        if (name.includes('inglês') || name.includes('english')) return '🇬🇧';
        if (name.includes('álcool') || name.includes('alcohol')) return '🍺';
        if (name.includes('fumar') || name.includes('smoke')) return '🚭';
        if (name.includes('code') || name.includes('program')) return '💻';
        if (name.includes('sleep') || name.includes('dormir')) return '😴';
        return '⭐';
    };

    // Long press handlers
    const handleTouchStart = () => {
        setIsPressed(true);
        longPressTimer.current = setTimeout(() => {
            onLongPress();
            setIsPressed(false);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        if (isPressed) {
            onClick();
        }
        setIsPressed(false);
    };

    const handleMouseDown = () => {
        setIsPressed(true);
        longPressTimer.current = setTimeout(() => {
            onLongPress();
            setIsPressed(false);
        }, 500);
    };

    const handleMouseUp = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        if (isPressed) {
            onClick();
        }
        setIsPressed(false);
    };

    const handleMouseLeave = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        setIsPressed(false);
    };

    useEffect(() => {
        return () => {
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
            }
        };
    }, []);

    return (
        <div
            className={`progress-bubble relative flex flex-col items-center justify-center cursor-pointer transition-transform duration-200 ${isPressed ? 'scale-95' : 'hover:scale-105'
                } ${isCompleted ? 'bubble-glow' : ''}`}
            onClick={onClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {/* SVG Progress Circle */}
            <svg width={size} height={size} className="transform -rotate-90 pointer-events-none">
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
                    className="progress-border transition-all duration-500 ease-out"
                    style={{
                        filter: isCompleted ? 'drop-shadow(0 0 8px currentColor)' : 'none',
                    }}
                />
            </svg>

            {/* Content inside the bubble */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                {/* Emoji */}
                <div className="text-3xl mb-1">{getEmoji()}</div>

                {/* Habit Name */}
                <p className="text-white font-bold text-sm mb-1 line-clamp-1 max-w-full">
                    {habit.name}
                </p>

                {/* Day Counter */}
                <p className="text-white/80 text-xs font-medium">
                    Dia {daysCompleted}/{totalDays}
                </p>

                {/* Reset Indicator */}
                {habit.resetOnFailure && (
                    <div className="absolute top-2 right-2 text-yellow-400 text-sm">⚡</div>
                )}

                {/* Completed Badge */}
                {isCompleted && (
                    <div className="absolute -bottom-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                        ✓ Completo
                    </div>
                )}
            </div>
        </div>
    );
}
