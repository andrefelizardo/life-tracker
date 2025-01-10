import { Habit } from "../types/habits";

type Props = {
  habit: Habit;
  onIncrement: (id: number) => void;
};

export default function Card({ habit, onIncrement }: Props) {
  return (
    <li
      className="rounded-lg bg-gray-dark p-4 border-gray-dark border-2 h-full flex cursor-pointer"
      onClick={() => onIncrement(habit.id)}
    >
      <div className="flex flex-col justify-between w-full h-full">
        <p className="text-gray-light text-lg">{habit.name}</p>
        <p className="text-gray-light">{habit.qtt}</p>
      </div>
    </li>
  );
}
