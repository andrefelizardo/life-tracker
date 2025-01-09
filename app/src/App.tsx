import "./App.css";
import Card from "./components/Card";
import FabButton from "./components/FabButton";
import Form from "./components/Form";
import { Habit } from "./types/habits";
import { useEffect, useState } from "react";

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/habits`
        );
        const data = await response.json();
        setHabits(data.data.habits);
      } catch (error) {
        console.error("Error fetching habits:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchHabits();
  }, []);

  const addHabit = async (name: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/habits`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, qtt: 0 }),
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen animate-fade-in">
        <img src="/icon.png" alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold underline">Life Tracker</h1>
      <ul className="mt-8 grid gap-6 grid-cols-2 auto-rows-[1fr]">
        {habits.map((habit) => (
          <Card key={habit.id} habit={habit} />
        ))}
      </ul>
      <FabButton onClick={() => setShowForm(true)} />
      {showForm && (
        <div className="fixed inset-0 bg-black w-full h-full text-white flex justify-center items-center">
          <div className="p-16 rounded-lg shadow-lg w-full h-full items-center justify-center flex flex-col">
            <Form onSubmit={addHabit} />
            <button
              className="mt-4 bg-orange text-white p-4 rounded-full absolute top-4 right-4 leading-none"
              onClick={() => setShowForm(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
