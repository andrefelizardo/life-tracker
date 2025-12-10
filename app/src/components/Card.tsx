import { Habit } from "../types/habits";

type Props = {
  habit: Habit;
  onIncrement: (id: number) => void;
  onFailure?: (id: number) => void;
};

export default function Card({ habit, onIncrement, onFailure }: Props) {
  const isChallenge = habit.goal && habit.goal > 0;
  const isOffMode = habit.mode === "OFF";

  return (
    <li className="rounded-lg bg-gray-900 p-4 border border-gray-700 h-full flex flex-col justify-between">
      <div className="flex flex-col w-full h-full mb-4">
        <div className="flex justify-between items-start mb-2">
          <p className="text-white text-lg font-bold truncate">{habit.name}</p>
          {isChallenge && (
            <span className={`text-xs px-2 py-1 rounded ${isOffMode ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'}`}>
              {habit.mode}
            </span>
          )}

        </div>

        <div className="flex items-end space-x-1">
          <span className="text-4xl font-bold text-white leading-none">{habit.qtt}</span>
          {isChallenge && <span className="text-sm text-gray-400 mb-1">/ {habit.goal} dias</span>}
        </div>

        <p className="text-gray-500 text-xs mt-3">
          Último registro:{" "}
          {habit.lastIncrementedAt
            ? new Date(habit.lastIncrementedAt).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "Nunca"}
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={() => onIncrement(habit.id)}
          className={`w-full py-2 px-4 rounded font-bold text-sm transition-colors ${isOffMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
        >
          {isOffMode ? "Marcar que mantive" : "Marcar como feito"}
        </button>

        {habit.resetOnFailure && onFailure && (
          <button
            onClick={() => onFailure(habit.id)}
            className="w-full py-2 px-4 rounded font-bold text-sm bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800 transition-colors"
          >
            Quebrei hoje
          </button>
        )}
      </div>
    </li>
  );
}
