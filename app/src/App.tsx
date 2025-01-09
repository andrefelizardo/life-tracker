import "./App.css";
import Card from "./components/Card";
import { Habit } from "./types/habits";

const habits: Habit[] = [
  {
    id: 1,
    name: "Secso",
    qtt: 1,
  },
  {
    id: 2,
    name: "Correr",
    qtt: 0,
  },
  {
    id: 3,
    name: "Video-game",
    qtt: 3,
  },
  {
    id: 4,
    name: "Beber álcool",
    qtt: 1,
  },
  {
    id: 5,
    name: "Lugar novo",
    qtt: 3,
  },
  {
    id: 6,
    name: "Encontrar pessoas",
    qtt: 2,
  },
];

function App() {
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
