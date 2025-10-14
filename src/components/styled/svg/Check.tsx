export default function StyledSvgCkeck() {
  return (
    <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
}
