export default function Tooltip({ text, position = "top" }) {
  return (
    <div
      className="
        absolute
        px-2 py-1
        bg-[#3B2868]
        text-[#EAEAEA]
        text-sm
        rounded-lg
        border border-[#7763B3]
        whitespace-nowrap
        z-[9999]
        pointer-events-none
      "
      style={{
        transform: position === "top" ? "translate(-50%, -110%)" : "translate(-50%, 10px)",
        left: "50%",
        top: position === "top" ? "0" : "100%",
      }}
    >
      {text}
    </div>
  );
}
