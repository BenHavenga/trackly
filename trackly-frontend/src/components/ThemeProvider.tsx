import React, { createContext, useContext, useEffect, useState } from "react";

// Dynamically load the theme CSS file
function useThemeCss(themeName: string) {
  useEffect(() => {
    const existing = document.getElementById("theme-css");
    if (existing) existing.remove();
    const link = document.createElement("link");
    link.id = "theme-css";
    link.rel = "stylesheet";
    link.href = `/themes/${themeName}.css?t=${Date.now()}`;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [themeName]);
}

const ThemeContext = createContext<{
  theme: string;
  setTheme: (theme: string) => void;
}>({
  theme: "clean-slate",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "clean-slate"
  );
  useThemeCss(theme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
