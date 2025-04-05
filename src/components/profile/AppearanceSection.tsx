import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import {
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { useUserStore } from "../../store/userStore";
import type { ThemeMode, UIColor } from "../../store/userStore";

export const AppearanceSection = () => {
  const uiPreferences = useUserStore((state) => state.uiPreferences);
  const updateUIPreferences = useUserStore(
    (state) => state.updateUIPreferences
  );
  const theme = useUserStore((state) => state.theme);
  const updateTheme = useUserStore((state) => state.updateTheme);

  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(
    theme || "system"
  );
  const [selectedColor, setSelectedColor] = useState<UIColor>(
    uiPreferences?.primaryColor || "indigo"
  );
  const [fontStyle, setFontStyle] = useState(
    uiPreferences?.fontStyle || "default"
  );
  const [reducedMotion, setReducdMotion] = useState(
    uiPreferences?.reducedMotion || false
  );

  // Theme options
  const themeOptions = [
    { name: "Light", value: "light", icon: SunIcon },
    { name: "Dark", value: "dark", icon: MoonIcon },
    { name: "System", value: "system", icon: ComputerDesktopIcon },
  ];

  // Color options
  const colorOptions = [
    { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Teal", value: "teal", class: "bg-teal-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Pink", value: "pink", class: "bg-pink-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Orange", value: "orange", class: "bg-orange-500" },
  ];

  // Font style options
  const fontOptions = [
    { name: "Default", value: "default" },
    { name: "Readable", value: "readable" },
    { name: "Compact", value: "compact" },
  ];

  const handleThemeChange = (newTheme: ThemeMode) => {
    setSelectedTheme(newTheme);
    updateTheme(newTheme);
    updateUIPreferences({ theme: newTheme });
  };

  const handleColorChange = (newColor: UIColor) => {
    setSelectedColor(newColor);
    updateUIPreferences({ primaryColor: newColor });
  };

  const handleFontChange = (newFont: "default" | "readable" | "compact") => {
    setFontStyle(newFont);
    updateUIPreferences({ fontStyle: newFont });
  };

  const handleReducedMotionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.checked;
    setReducdMotion(newValue);
    updateUIPreferences({ reducedMotion: newValue });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Theme
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose your preferred color theme.
        </p>
        <RadioGroup
          value={selectedTheme}
          onChange={handleThemeChange}
          className="mt-4"
        >
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option.value}
                className={({ checked }) =>
                  `
                  ${
                    checked
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                  }
                  cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none flex flex-col items-center justify-center
                `
                }
              >
                {({ checked }) => (
                  <>
                    <option.icon
                      className={`h-6 w-6 ${
                        checked
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-300"
                      }`}
                    />
                    <RadioGroup.Label
                      as="p"
                      className={`mt-2 font-medium ${
                        checked ? "text-white" : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {option.name}
                    </RadioGroup.Label>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Primary Color
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose your primary accent color.
        </p>
        <RadioGroup
          value={selectedColor}
          onChange={handleColorChange}
          className="mt-4"
        >
          <div className="grid grid-cols-4 gap-3">
            {colorOptions.map((color) => (
              <RadioGroup.Option
                key={color.value}
                value={color.value}
                className={({ checked }) =>
                  `
                  ${
                    checked
                      ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-black dark:ring-white ring-opacity-60"
                      : ""
                  }
                  cursor-pointer rounded-full p-2 focus:outline-none flex items-center justify-center
                `
                }
              >
                <span
                  className={`${color.class} h-8 w-8 rounded-full border border-black border-opacity-10`}
                  aria-hidden="true"
                />
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Font Style
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose your preferred text style.
        </p>
        <RadioGroup
          value={fontStyle}
          onChange={handleFontChange}
          className="mt-4"
        >
          <div className="grid grid-cols-3 gap-3">
            {fontOptions.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option.value}
                className={({ checked }) =>
                  `
                  ${
                    checked
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                  }
                  cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none
                `
                }
              >
                {({ checked }) => (
                  <RadioGroup.Label
                    as="p"
                    className={`font-medium text-center ${
                      checked ? "text-white" : "text-gray-900 dark:text-white"
                    } ${
                      option.value === "readable"
                        ? "text-lg"
                        : option.value === "compact"
                        ? "text-sm"
                        : "text-base"
                    }`}
                  >
                    {option.name}
                  </RadioGroup.Label>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Reduced Motion
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Minimize non-essential animations.
          </p>
        </div>
        <div className="flex h-6 items-center">
          <input
            id="reduced-motion"
            aria-describedby="reduced-motion-description"
            name="reduced-motion"
            type="checkbox"
            checked={reducedMotion}
            onChange={handleReducedMotionChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
