import "./App.css";
import Card from "./components/Card";
import { Habit } from "./types/habits";
import { useEffect, useState } from "react";

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

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
      <h1 className="text-3xl font-bold underline">Lista de coisas</h1>
      <ul className="mt-8 grid gap-6 grid-cols-2 auto-rows-[1fr]">
        {habits.map((habit) => (
          <Card key={habit.id} habit={habit} />
        ))}
      </ul>
    </div>
  );
}

export default App;
