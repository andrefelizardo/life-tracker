import { Habit } from "../types/habits";

type Props = {
  habit: Habit;
};

export default function Card({ habit }: Props) {
  const url = `#/${habit.id}`;
  return (
    <li className="rounded-lg bg-gray-dark p-4 border-gray-dark border-2 h-full flex">
      <a
        href={`${url}`}
        className="flex flex-col justify-between w-full h-full"
      >
        <p className="text-gray-light text-lg">{habit.name}</p>
        <p className="text-gray-light">{habit.qtt}</p>
      </a>
    </li>
  );
}
