import React, {
    createContext,
    useContext,
    useRef,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import { ImGui, ImVec2 } from "@mori2003/jsimgui";

export type WindowRenderer = (gl: WebGL2RenderingContext) => void;

type ImguiWindowsContextType = {
    openMenu: () => void;
    closeMenu: () => void;
    isMenuOpen: () => boolean;
    renderOpenWindows: (gl: WebGL2RenderingContext) => void;
    registerWindow: (name: string, renderer: WindowRenderer) => void;
    unregisterWindow: (name: string) => void;
};

const ImguiWindowsContext = createContext<ImguiWindowsContextType | undefined>(undefined);

const IMGUI_WINDOWS_KEY = "imgui_windows";
const MENU_WINDOW_NAME = "Menu";

export const ImguiWindowsProvider = ({ children }: { children: ReactNode }) => {
    const registeredWindowsRef = useRef<Record<string, WindowRenderer>>({});
    const openWindowsRef = useRef<string[]>([]);

    const saveOpenWindows = () => {
        localStorage.setItem(IMGUI_WINDOWS_KEY, JSON.stringify(openWindowsRef.current));
    };

    const setOpenWindows = (windows: string[]) => {
        openWindowsRef.current = windows;
        saveOpenWindows();
    };

    const isWindowOpen = useCallback((name: string) => {
        return openWindowsRef.current.includes(name);
    }, []);

    const toggleWindow = useCallback((name: string) => {
        if (isWindowOpen(name)) {
            setOpenWindows(openWindowsRef.current.filter(w => w !== name));
        } else {
            setOpenWindows([...openWindowsRef.current, name]);
        }
    }, [isWindowOpen]);

    const openMenu = useCallback(() => {
        if (!isWindowOpen(MENU_WINDOW_NAME)) {
            toggleWindow(MENU_WINDOW_NAME);
        }
    }, [isWindowOpen, toggleWindow]);

    const closeMenu = useCallback(() => {
        if (isWindowOpen(MENU_WINDOW_NAME)) {
            toggleWindow(MENU_WINDOW_NAME);
        }
    }, [isWindowOpen, toggleWindow]);

    const isMenuOpen = useCallback(() => isWindowOpen(MENU_WINDOW_NAME), [isWindowOpen]);

    const renderOpenWindows = useCallback((gl: WebGL2RenderingContext) => {
        openWindowsRef.current.forEach(name => {
            const renderer = registeredWindowsRef.current[name];
            if (renderer) renderer(gl);
        });
    }, []);

    const registerWindow = useCallback((name: string, renderer: WindowRenderer) => {
        if (!name) throw new Error("Window name must be a non-empty string.");
        if (name === MENU_WINDOW_NAME) return; // "Menu" is reserved and handled internally
        registeredWindowsRef.current[name] = renderer;
    }, []);

    const unregisterWindow = useCallback((name: string) => {
        delete registeredWindowsRef.current[name];
    }, []);

    useEffect(() => {
        registeredWindowsRef.current[MENU_WINDOW_NAME] = (gl: WebGL2RenderingContext) => {
            const canvasHeight = gl.canvas.height;
            const canvasWidth = gl.canvas.width;
            const scale = window.devicePixelRatio || 1;

            ImGui.SetNextWindowPos(
                new ImVec2(canvasWidth * (1 / scale) - 10, canvasHeight * (1 / scale) - 10),
                undefined,
                new ImVec2(1, 1)
            );

            ImGui.Begin(MENU_WINDOW_NAME, undefined,
                ImGui.WindowFlags.NoResize |
                ImGui.WindowFlags.AlwaysAutoResize |
                ImGui.WindowFlags.NoCollapse |
                ImGui.WindowFlags.NoTitleBar
            );

            const allWindowNames = Object.keys(registeredWindowsRef.current).filter(n => n !== MENU_WINDOW_NAME);
            if (ImGui.BeginMultiSelect(ImGui.MultiSelectFlags.None, undefined, allWindowNames.length)) {
                for (const name of allWindowNames) {
                    if (ImGui.Selectable(name, isWindowOpen(name))) {
                        toggleWindow(name);
                    }
                }
                if (ImGui.Selectable("Close", false)) {
                    closeMenu();
                }
            }
            ImGui.EndMultiSelect();
            ImGui.End();
        };

        return () => {
            delete registeredWindowsRef.current[MENU_WINDOW_NAME];
        };
    }, [toggleWindow, isWindowOpen, closeMenu]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(IMGUI_WINDOWS_KEY);
            const parsed = stored ? JSON.parse(stored) : [];
            if (Array.isArray(parsed) && parsed.every(n => typeof n === "string")) {
                openWindowsRef.current = parsed;
            }
        } catch {
            openWindowsRef.current = [];
        }
    }, []);

    return (
        <ImguiWindowsContext.Provider
            value={{
                openMenu,
                closeMenu,
                isMenuOpen,
                renderOpenWindows,
                registerWindow,
                unregisterWindow,
            }}
        >
            {children}
        </ImguiWindowsContext.Provider>
    );
};

export const useImguiWindows = (): ImguiWindowsContextType => {
    const ctx = useContext(ImguiWindowsContext);
    if (!ctx) throw new Error("useImguiWindows must be used within ImguiWindowsProvider");
    return ctx;
};
