import { useTheme } from '../../../context/ThemeContext';

function SwitchModo() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="relative w-15 h-7">
      <input
        type="checkbox"
        id="toggle"
        className="hidden"
        checked={!isDarkMode}
        onChange={toggleTheme}
      />
      <label
        htmlFor="toggle"
        className={`block w-full h-full rounded-full cursor-pointer border-4 overflow-hidden transition-all duration-500 ease-in-out ${
          isDarkMode
            ? 'bg-[#14132B] border-[#4285f4]'
            : 'bg-[#f5f5f5] border-[#ffcc66]'
        }`}
      >
        {/* ÍCONE PRINCIPAL — Lua / Sol */}
        <span
          className={`absolute top-1/2 w-4 h-4 rounded-full transition-all duration-500 ease-in-out transform -translate-y-1/2 ${
            isDarkMode
              ? 'left-3.5 bg-[#14132B] shadow-[-8px_0_0_0_#91B6E1]'
              : 'left-9.5 bg-[#ff944d] shadow-none'
          }`}
        ></span>
      </label>
    </div>
  );
}

export default SwitchModo;