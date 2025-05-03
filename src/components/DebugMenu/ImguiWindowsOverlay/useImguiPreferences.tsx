import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    ReactNode,
} from 'react';

export type Theme = 'Dark' | 'Light' | 'Classic';

export const IMGUI_PREFERENCES_KEY = 'imgui_preferences';
export const DEFAULT_THEME: Theme = 'Dark';
export const DEFAULT_OPACITY = 0.9;
export const DEFAULT_SCALE = 1;

export type ImguiPreferences = {
    setTheme: (theme: Theme) => void;
    setOpacity: (opacity: number) => void;
    setScale: (scale: number) => void;
    themeRef: React.RefObject<Theme>;
    opacityRef: React.RefObject<number>;
    scaleRef: React.RefObject<number>;
};

type StoredImguiPreferences = {
    theme: Theme,
    opacity: number,
    scale: number,
}

const ImguiPreferencesContext = createContext<ImguiPreferences | undefined>(undefined);

export const ImguiPreferencesProvider = ({ children }: { children: ReactNode }) => {
    const stored = loadStoredPreferences();

    const themeRef = useRef<Theme>(stored?.theme ?? DEFAULT_THEME);
    const opacityRef = useRef<number>(stored?.opacity ?? DEFAULT_OPACITY);
    const scaleRef = useRef<number>(stored?.scale ?? DEFAULT_SCALE);

    const setTheme = (value: Theme) => {
        themeRef.current = value;
        savePreferences();
    };

    const setOpacity = (value: number) => {
        opacityRef.current = value;
        savePreferences();
    };

    const setScale = (value: number) => {
        scaleRef.current = value;
        savePreferences();
    };

    const savePreferences = () => {
        try {
            localStorage.setItem(
                IMGUI_PREFERENCES_KEY,
                JSON.stringify({
                    theme: themeRef.current,
                    opacity: opacityRef.current,
                    scale: scaleRef.current,
                })
            );
        } catch { }
    };

    useEffect(() => {
        savePreferences();
    }, []);

    return (
        <ImguiPreferencesContext.Provider
            value={{
                setTheme,
                setOpacity,
                setScale,
                themeRef,
                opacityRef,
                scaleRef,
            }}
        >
            {children}
        </ImguiPreferencesContext.Provider>
    );
};

export const useImguiPreferences = (): ImguiPreferences => {
    const context = useContext(ImguiPreferencesContext);
    if (!context) {
        throw new Error('useImguiPreferences must be used within an ImguiPreferencesProvider');
    }
    return context;
};

const loadStoredPreferences = (): Partial<StoredImguiPreferences> | null => {
    try {
        const json = localStorage.getItem(IMGUI_PREFERENCES_KEY);
        if (!json) return null;
        return JSON.parse(json);
    } catch {
        return null;
    }
};
