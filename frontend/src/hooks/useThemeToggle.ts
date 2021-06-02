import { useState } from "react";

const useThemeToggle = (): [boolean, () => void] => {
  const [isDark, toggleTheme] = useState<boolean>(false);
  const themeToggler = () => toggleTheme(!isDark);
  return [isDark, themeToggler];
};

export default useThemeToggle;
