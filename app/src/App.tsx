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
            <Form />
            <button
              className="mt-4 bg-red-500 text-white p-2 rounded"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
