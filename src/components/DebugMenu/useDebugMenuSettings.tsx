import { createContext, useCallback, useContext, useState } from "react";
import { z } from "zod";
import { DebugWindow, DebugWindowEnum } from "./useDebugWindows";
import { ImGui } from "@mori2003/jsimgui";

export const ThemeSchema = z.enum(['Light', 'Dark', 'Classic']);
export type Theme = z.infer<typeof ThemeSchema>;

export const ImguiThemeContext = createContext<{theme: Theme, setTheme: (theme: Theme) => void}>({
    theme: 'Dark',
    setTheme: () => {},
});

export const useDebugMenuSettings = () => {
    const [imguiVisible, setImguiVisible] = useState<boolean | undefined>(
      undefined
    );
    const [theme, setTheme] = useState<Theme>();
  
    if (imguiVisible === undefined) {
        if (localStorage.getItem("debugMenu.visible") == "true") {
            setImguiVisible(true);
        } 
        else { 
            setImguiVisible(false); 
        }
    }

    if (theme === undefined) {
        if (localStorage.getItem("debugMenu.theme")) {
            const parsedTheme = ThemeSchema.safeParse(
                localStorage.getItem("debugMenu.theme")
            );
            if (parsedTheme.success) {
                setTheme(parsedTheme.data)
            }
            else {
                setTheme('Dark');
            }
        } 
        else { 
            setTheme('Dark'); 
        }
    }
  
    const setImguiVisibleAndStore = useCallback(
      (visible: boolean) => {
        localStorage.setItem("debugMenu.visible", visible.toString());
        setImguiVisible(visible);
      },
      [setImguiVisible]
    );

    const setThemeAndStore = useCallback(
        (theme: Theme) => {
            localStorage.setItem("debugMenu.theme", theme.toString());
            setTheme(theme);
        },
        [setTheme]
    )

    const applyTheme = useCallback(() => {
        switch(theme) {
            case 'Dark': {
                ImGui.StyleColorsDark();
                break;
            }
            case 'Light': {
                ImGui.StyleColorsLight();
                break;
            }
            case 'Classic': {
                ImGui.StyleColorsClassic();
                break;
            }
            default: break;
        }
    }, [theme])
  
    return { 
        imguiVisible: theme && imguiVisible || false, 
        setImguiVisible: setImguiVisibleAndStore,
        theme: theme || 'Dark',
        setTheme: setThemeAndStore,
        applyTheme,
    } as const;
};