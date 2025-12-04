import { useState } from "react";

interface FormProps {
  onSubmit: (name: string) => void;
}

export default function Form({ onSubmit }: FormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <div className="container w-full">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded text-gray-900 dark:text-white bg-white dark:bg-gray-800"
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          className="mt-4 bg-orange text-white p-2 rounded w-full"
          type="submit"
        >
          Add Habit
        </button>
      </form>
    </div>
  );
}
