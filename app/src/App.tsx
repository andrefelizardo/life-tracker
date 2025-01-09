import "./App.css";
import Card from "./components/Card";
import { Habit } from "./types/habits";
import { useEffect, useState } from "react";

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/habits`
        );
        const data = await response.json();
        setHabits(data.data.habits);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    fetchHabits();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Lista de coisas</h1>
      <ul className="mt-8 grid gap-6 grid-cols-2 auto-rows-[1fr]">
        {habits.map((habit) => (
          <Card key={habit.id} habit={habit} />
        ))}
      </ul>
    </>
  );
}

export default App;
