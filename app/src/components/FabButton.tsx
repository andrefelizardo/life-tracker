interface FabButtonProps {
  onClick: () => void;
}

export default function FabButton({ onClick }: FabButtonProps) {
  return (
    <button
      className="fixed bottom-6 right-4 bg-orange text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none text-7xl w-16 h-16 flex items-center justify-center leading-none"
      onClick={onClick}
    >
      <span className="relative -top-1">+</span>
    </button>
  );
}
