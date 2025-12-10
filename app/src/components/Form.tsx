import { useState } from "react";

interface FormProps {
  onSubmit: (name: string, goal?: number, mode?: "NORMAL" | "ON" | "OFF", resetOnFailure?: boolean) => void;
}

export default function Form({ onSubmit }: FormProps) {
  const [name, setName] = useState("");
  const [isChallenge, setIsChallenge] = useState(false);
  const [mode, setMode] = useState<"NORMAL" | "ON" | "OFF">("ON");
  const [resetOnFailure, setResetOnFailure] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, isChallenge ? 100 : 0, isChallenge ? mode : "NORMAL", isChallenge ? resetOnFailure : false);
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

        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isChallenge}
              onChange={(e) => setIsChallenge(e.target.checked)}
              className="form-checkbox h-5 w-5 text-orange-500"
            />
            <span className="text-sm font-bold">100-Day Challenge?</span>
          </label>
        </div>

        {isChallenge && (
          <div className="bg-gray-800 p-4 rounded mb-4 border border-gray-700">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Mode</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="ON"
                    checked={mode === "ON"}
                    onChange={() => setMode("ON")}
                    className="form-radio text-orange-500"
                  />
                  <span>ON (Do it everyday)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mode"
                    value="OFF"
                    checked={mode === "OFF"}
                    onChange={() => setMode("OFF")}
                    className="form-radio text-orange-500"
                  />
                  <span>OFF (Avoid it)</span>
                </label>
              </div>
            </div>

            <div className="mb-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resetOnFailure}
                  onChange={(e) => setResetOnFailure(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-red-500"
                />
                <span className="text-sm font-bold text-red-400">Reset progress on failure?</span>
              </label>
            </div>
          </div>
        )}

        <button
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded w-full transition-colors font-bold"
          type="submit"
        >
          Add Habit
        </button>
      </form>
    </div>
  );
}
