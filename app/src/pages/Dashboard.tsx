import React, { useEffect, useState } from 'react';
import ProgressBubble from "../components/ProgressBubble";
import ContextMenu from "../components/ContextMenu";
import HabitDetails from "./HabitDetails";
import FabButton from "../components/FabButton";
import Form from "../components/Form";
import { Habit } from "../types/habits";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [contextMenuHabit, setContextMenuHabit] = useState<Habit | null>(null);
    const { token, logout, user } = useAuth();

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/habits`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setHabits(data.data.habits);
                } else if (response.status === 401) {
                    logout();
                }
            } catch (error) {
                console.error("Error fetching habits:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        };

        if (token) {
            fetchHabits();
        }
    }, [token, logout]);

    const addHabit = async (name: string, goal?: number, mode?: "NORMAL" | "ON" | "OFF", resetOnFailure?: boolean) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/habits`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, qtt: 0, goal: goal || 100, mode, resetOnFailure }),
                }
            );
            if (response.ok) {
                const newHabit = await response.json();
                setHabits((prevHabits) => [...prevHabits, newHabit.data]);
                setShowForm(false);
            }
        } catch (error) {
            console.error("Error adding habit:", error);
        }
    };

    const failHabit = async (id: number) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/habits/${id}/fail`,
                {
                    method: "PATCH",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.ok) {
                const updatedHabit = await response.json();
                setHabits((prevHabits) =>
                    prevHabits.map((habit) =>
                        habit.id === id ? updatedHabit.data : habit
                    )
                );
                // Update selected habit if it's the one being modified
                if (selectedHabit?.id === id) {
                    setSelectedHabit(updatedHabit.data);
                }
            }
        } catch (error) {
            console.error("Error failing habit:", error);
        }
    };

    const incrementHabit = async (id: number) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/habits/${id}/increment`,
                {
                    method: "PATCH",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const updatedHabit = await response.json();
                setHabits((prevHabits) =>
                    prevHabits.map((habit) =>
                        habit.id === id ? updatedHabit.data : habit
                    )
                );
                // Update selected habit if it's the one being modified
                if (selectedHabit && selectedHabit.id === id) {
                    setSelectedHabit(updatedHabit.data);
                }
            } else {
                // Throw error with response data for handling in HabitDetails
                const errorData = await response.json();
                const error: any = new Error(errorData.message);
                error.response = { data: errorData };
                throw error;
            }
        } catch (error) {
            console.error("Error incrementing habit:", error);
            throw error; // Re-throw for HabitDetails to handle
        }
    };

    const deleteHabit = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar este hábito?')) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/habits/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.ok) {
                setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
            }
        } catch (error) {
            console.error("Error deleting habit:", error);
        }
    };

    const restartHabit = async (id: number) => {
        if (!confirm('Tem certeza que deseja reiniciar este desafio?')) return;

        // Use the fail endpoint to reset the habit
        await failHabit(id);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen animate-fade-in">
                <img src="/icon.png" alt="Loading..." />
            </div>
        );
    }

    return (
        <div className="animate-fade-in relative min-h-screen pb-20">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pt-6 px-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1" style={{ color: '#111111' }}>
                        Meus Desafios
                    </h1>
                    <p className="text-sm" style={{ color: '#777777' }}>
                        Continue sua jornada de 100 dias ✨
                    </p>
                </div>
                <button
                    onClick={logout}
                    className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors flex items-center justify-center"
                    title={user?.displayName || 'Perfil'}
                >
                    <span className="text-gray-700 font-semibold text-sm">
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                </button>
            </div>

            {/* Progress Bubbles Grid */}
            <div className="px-6">
                {habits.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg mb-4">Nenhum desafio ativo ainda</p>
                        <p className="text-gray-500 text-sm">Clique no botão + para criar seu primeiro desafio de 100 dias!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center">
                        {habits.map((habit) => (
                            <ProgressBubble
                                key={habit.id}
                                habit={habit}
                                onClick={() => setSelectedHabit(habit)}
                                onLongPress={() => setContextMenuHabit(habit)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* FAB Button */}
            <FabButton onClick={() => setShowForm(true)} />

            {/* Add Habit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 w-full h-full text-white flex justify-center items-center z-50">
                    <div className="p-8 rounded-lg shadow-lg w-full max-w-md relative bg-gray-900 mx-4">
                        <Form onSubmit={addHabit} />
                        <button
                            className="mt-4 bg-orange-500 text-white w-10 h-10 rounded-full absolute top-4 right-4 flex items-center justify-center font-bold"
                            onClick={() => setShowForm(false)}
                        >
                            X
                        </button>
                    </div>
                </div>
            )}

            {/* Habit Details Modal */}
            {selectedHabit && (
                <HabitDetails
                    habit={selectedHabit}
                    onIncrement={incrementHabit}
                    onFailure={failHabit}
                    onDelete={deleteHabit}
                    onClose={() => setSelectedHabit(null)}
                />
            )}

            {/* Context Menu */}
            {contextMenuHabit && (
                <ContextMenu
                    habitName={contextMenuHabit.name}
                    canRestart={contextMenuHabit.resetOnFailure || false}
                    onEdit={() => {
                        // TODO: Implement edit functionality
                        alert('Funcionalidade de edição em desenvolvimento');
                    }}
                    onPause={() => {
                        // TODO: Implement pause functionality
                        alert('Funcionalidade de pausa em desenvolvimento');
                    }}
                    onRestart={() => restartHabit(contextMenuHabit.id)}
                    onDelete={() => deleteHabit(contextMenuHabit.id)}
                    onClose={() => setContextMenuHabit(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
