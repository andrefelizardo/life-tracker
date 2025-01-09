export default function Form() {
  return (
    <div className="container w-full">
      <form>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            id="name"
            type="text"
            placeholder="Name"
          />
        </div>
        <button
          className="bg-blue-500 text-white p-2 rounded w-full"
          type="submit"
        >
          Add Habit
        </button>
      </form>
    </div>
  );
}
