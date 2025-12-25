import { useState, useEffect } from "react";

// iOS/Apple-inspired color palette optimized for light and dark modes
export const COLOR_PALETTES = {
	blue: {
		light: ["#007AFF", "#5BA8FF", "#8FC5FF", "#B3D9FF", "#D6EBFF"],
		dark: ["#0A84FF", "#409CFF", "#66B3FF", "#99CCFF", "#CCE5FF"],
	},
	yellow: {
		light: ["#FFB800", "#FFC840", "#FFD873", "#FFE59F", "#FFF2CC"],
		dark: ["#FFD60A", "#FFE040", "#FFE873", "#FFEF9F", "#FFF6CC"],
	},
	green: {
		light: ["#34C759", "#5DD67D", "#87E39F", "#B0EFC1", "#D8F7E3"],
		dark: ["#32D74B", "#5EE371", "#87ED96", "#AFF5BC", "#D7FAE1"],
	},
	purple: {
		light: ["#AF52DE", "#C279E8", "#D49FF1", "#E6C5F9", "#F2DDFC"],
		dark: ["#BF5AF2", "#D279F6", "#E099F9", "#EDB9FC", "#F6D9FE"],
	},
	teal: {
		light: ["#5AC8FA", "#7DD6FB", "#A0E3FC", "#C2EFFD", "#E1F7FE"],
		dark: ["#64D2FF", "#85DCFF", "#A6E6FF", "#C7F0FF", "#E3F8FF"],
	},
	orange: {
		light: ["#FF9500", "#FFAD33", "#FFC566", "#FFDC99", "#FFEDCC"],
		dark: ["#FF9F0A", "#FFB340", "#FFC773", "#FFDB9F", "#FFEDCC"],
	},
	pink: {
		light: ["#FF2D55", "#FF5C7C", "#FF8BA3", "#FFB9CA", "#FFE0E8"],
		dark: ["#FF375F", "#FF6085", "#FF8AA6", "#FFB3C7", "#FFDCE8"],
	},
	red: {
		light: ["#FF3B30", "#FF6459", "#FF8D83", "#FFB6AC", "#FFDDD6"],
		dark: ["#FF453A", "#FF6961", "#FF8D88", "#FFB1AE", "#FFD5D4"],
	},
	gray: {
		light: ["#8E8E93", "#A8A8AD", "#C2C2C7", "#DCDCE1", "#F2F2F7"],
		dark: ["#98989D", "#B2B2B7", "#CCCCCC", "#E6E6E6", "#F2F2F7"],
	},
} as const;

export const COLORLESS = {
	light: ["#8E8E93", "#A8A8AD", "#C2C2C7", "#DCDCE1", "#F2F2F7"],
	dark: ["#98989D", "#B2B2B7", "#CCCCCC", "#E6E6E6", "#F2F2F7"],
} as const;

export type ColorName = keyof typeof COLOR_PALETTES;
export type ShadeIndex = 0 | 1 | 2 | 3 | 4;
export type ColorMode = "light" | "dark";

export function hashStr(s: string, range: number): number {
	let hash = 5381;
	for (let i = 0; i < s.length; i++) {
		hash = (hash << 5) + hash + s.charCodeAt(i);
		hash = hash & hash;
	}
	return Math.abs(hash) % range;
}

// Get a single color (default shade 0 - most vibrant)
export function getColor(
	category: string,
	mode: ColorMode = "light",
	shade: ShadeIndex = 0,
): string {
	const colorNames = Object.keys(COLOR_PALETTES) as ColorName[];
	const colorIndex = hashStr(category, colorNames.length);
	const colorName = colorNames[colorIndex];
	return COLOR_PALETTES[colorName][mode][shade];
}

// Get all 5 shades for a category
export function getColorShades(
	category: string,
	mode: ColorMode = "light",
): string[] {
	const colorNames = Object.keys(COLOR_PALETTES) as ColorName[];
	const colorIndex = hashStr(category, colorNames.length);
	const colorName = colorNames[colorIndex];
	return COLOR_PALETTES[colorName][mode];
}

// Get a specific color by name and shade
export function getColorByName(
	colorName: ColorName,
	mode: ColorMode = "light",
	shade: ShadeIndex = 0,
): string {
	return COLOR_PALETTES[colorName][mode][shade];
}

// Get all shades of a specific color
export function getAllShades(
	colorName: ColorName,
	mode: ColorMode = "light",
): string[] {
	return COLOR_PALETTES[colorName][mode];
}

// Auto mode - uses the most vibrant shade (0)
export function getAutoColor(
	category: string,
	mode: ColorMode = "light",
): string {
	return getColor(category, mode, 0);
}

// Colorful mode - returns the 5 most vibrant shades
export function getColorfulPalette(mode: ColorMode = "light"): string[] {
	return [
		COLOR_PALETTES.blue[mode][0],
		COLOR_PALETTES.yellow[mode][0],
		COLOR_PALETTES.green[mode][0],
		COLOR_PALETTES.purple[mode][0],
		COLOR_PALETTES.orange[mode][0],
	];
}

// Get colorless palette
export function getColorlessPalette(mode: ColorMode = "light"): string[] {
	return COLORLESS[mode];
}

// Utility to detect system theme (for auto mode)
export function getSystemColorMode(): ColorMode {
	if (typeof window !== "undefined") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
	return "light";
}

// React hook for automatic theme detection
export function useColorMode(): ColorMode {
	const [mode, setMode] = useState<ColorMode>(() => {
		if (typeof window === "undefined") return "light";
		return getSystemColorMode();
	});

	useEffect(() => {
		if (typeof window === "undefined") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = (e: MediaQueryListEvent) => {
			setMode(e.matches ? "dark" : "light");
		};

		// Check initial value
		setMode(mediaQuery.matches ? "dark" : "light");

		// Listen for changes
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	return mode;
}

// Example usage:
// const color = getColor("Work", "dark"); // Gets dark mode color
// const lightColor = getColor("Work", "light", 3); // Gets light mode shade 3
// const allShades = getColorShades("Work", "dark"); // Gets all dark mode shades
// const autoMode = getSystemColorMode(); // Detects system preference
// const myColor = getColor("Work", autoMode); // Uses system preference
//
// In React component:
// const mode = useColorMode(); // Auto-updates when system theme changes
// const color = getColor("Work", mode);