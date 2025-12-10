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
    const longPressTriggered = useRef(false);

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
    const size = 160;
    const strokeWidth = 10;
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
        if (name.includes('álcool') || name.includes('alcohol')) return '🚫🍺';
        if (name.includes('açúcar') || name.includes('sugar')) return '🚫🍬';
        if (name.includes('fumar') || name.includes('smoke')) return '🚭';
        if (name.includes('code') || name.includes('program')) return '💻';
        if (name.includes('sleep') || name.includes('dormir')) return '😴';
        return '⭐';
    };

    // Get mode badge styling
    const getModeBadge = () => {
        if (habit.resetOnFailure) {
            return {
                text: '⚡ RESET',
                bgColor: '#FFF7D1',
                textColor: '#B8860B'
            };
        }

        switch (habit.mode) {
            case 'ON':
                return {
                    text: 'ON',
                    bgColor: '#E6F7FF',
                    textColor: '#1890FF'
                };
            case 'OFF':
                return {
                    text: 'OFF',
                    bgColor: '#FFE8E8',
                    textColor: '#FF4D4F'
                };
            default:
                return {
                    text: 'NORMAL',
                    bgColor: '#F0F0F0',
                    textColor: '#666666'
                };
        }
    };

    const modeBadge = getModeBadge();

    // Long press handlers
    const handleTouchStart = () => {
        setIsPressed(true);
        longPressTriggered.current = false;
        longPressTimer.current = setTimeout(() => {
            longPressTriggered.current = true;
            onLongPress();
            setIsPressed(false);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        if (isPressed && !longPressTriggered.current) {
            onClick();
        }
        setIsPressed(false);
    };

    const handleMouseDown = () => {
        setIsPressed(true);
        longPressTriggered.current = false;
        longPressTimer.current = setTimeout(() => {
            longPressTriggered.current = true;
            onLongPress();
            setIsPressed(false);
        }, 500);
    };

    const handleMouseUp = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        if (isPressed && !longPressTriggered.current) {
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
            className={`progress-bubble relative cursor-pointer transition-transform duration-200 ${isPressed ? 'scale-95' : 'hover:scale-105'
                } ${isCompleted ? 'bubble-glow' : ''}`}
            onClick={onClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ width: size, height: size }}
        >
            {/* SVG Progress Circle */}
            <svg width={size} height={size} className="absolute inset-0 transform -rotate-90 pointer-events-none">
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
                    className="progress-border transition-all duration-500 ease-out"
                    style={{
                        filter: isCompleted ? 'drop-shadow(0 0 8px currentColor)' : 'none',
                    }}
                />
            </svg>

            {/* Inner Circle with Content */}
            <div
                className="absolute inset-0 m-[10px] rounded-full bg-white flex flex-col items-center justify-center pointer-events-none"
                style={{
                    boxShadow: '0px 3px 6px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.1)'
                }}
            >
                {/* Habit Icon */}
                <div className="text-3xl mb-2">{getEmoji()}</div>

                {/* Habit Name */}
                <p className="text-sm font-medium mb-2 px-3 text-center truncate w-full" style={{ color: '#222222' }}>
                    {habit.name}
                </p>

                {/* Numerical Progress */}
                <p className="text-base font-semibold mb-3" style={{ color: '#444444' }}>
                    {daysCompleted}/{totalDays}
                </p>

                {/* Mode Badge */}
                <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                        backgroundColor: modeBadge.bgColor,
                        color: modeBadge.textColor
                    }}
                >
                    {modeBadge.text}
                </div>

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
