import React, { useEffect, useState } from 'react';
import Card from "../components/Card";
import FabButton from "../components/FabButton";
import Form from "../components/Form";
import { Habit } from "../types/habits";
import { useAuth } from "../context/AuthContext";
import { LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
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
                    body: JSON.stringify({ name, qtt: 0, goal, mode, resetOnFailure }),
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
            }
        } catch (error) {
            console.error("Error incrementing habit:", error);
        }
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
            <div className="flex justify-between items-center mb-8 pt-4 px-4">
                <div>
                    <h1 className="text-3xl font-bold underline">Life Tracker</h1>
                    <p className="text-sm text-gray-500">Welcome, {user?.displayName}</p>
                </div>
                <button onClick={logout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <LogOut className="w-6 h-6" />
                </button>
            </div>

            <ul className="grid gap-6 grid-cols-2 auto-rows-[1fr] px-4">
                {habits.map((habit) => (
                    <Card key={habit.id} habit={habit} onIncrement={incrementHabit} onFailure={failHabit} />
                ))}
            </ul>
            <FabButton onClick={() => setShowForm(true)} />
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
        </div>
    );
};

export default Dashboard;
