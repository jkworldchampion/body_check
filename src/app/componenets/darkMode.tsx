//다크모드

"use client";

import React, { useState } from "react";

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.style.backgroundColor = darkMode ? "#fff" : "#333";
        document.body.style.color = darkMode ? "#000" : "#fff";
    };

    return (
        <button onClick={toggleDarkMode}>
            {darkMode ? "라이트모드" : "다크모드"}
        </button>
    );
}
