import { createContext, useCallback, useContext, useRef, useState } from "react";
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
    const themeRef = useRef<Theme>();
  
    if (imguiVisible === undefined) {
        if (localStorage.getItem("debugMenu.visible") == "true") {
            setImguiVisible(true);
        } 
        else { 
            setImguiVisible(false); 
        }
    }

    if (themeRef.current === undefined) {
        if (localStorage.getItem("debugMenu.theme")) {
            const parsedTheme = ThemeSchema.safeParse(
                localStorage.getItem("debugMenu.theme")
            );
            if (parsedTheme.success) {
                themeRef.current = parsedTheme.data
            }
            else {
                themeRef.current = 'Dark';
            }
        } 
        else { 
            themeRef.current = 'Dark'; 
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
            themeRef.current = theme;
        },
        [themeRef]
    )

    const applyTheme = useCallback(() => {
        switch(themeRef.current) {
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
    }, [themeRef])
  
    return { 
        imguiVisible: themeRef.current && imguiVisible || false, 
        setImguiVisible: setImguiVisibleAndStore,
        theme: themeRef.current || 'Dark',
        setTheme: setThemeAndStore,
        applyTheme,
    } as const;
};