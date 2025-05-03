import { ImGui } from "@mori2003/jsimgui"
import { useEffect, useMemo } from "react";
import { DEFAULT_OPACITY, DEFAULT_SCALE, DEFAULT_THEME, Theme, useImguiPreferences } from "./useImguiPreferences";
import { useImguiWindows } from "./useImguiWindows";

const MIN_OPACITY = 0.1;
const MAX_OPACITY = 1;
const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const THEMES: Theme[] = ['Dark', 'Light', 'Classic']

export const PreferencesWindow = () => {
    const {themeRef, setTheme, opacityRef, setOpacity, scaleRef, setScale} = useImguiPreferences()
    const { registerWindow, unregisterWindow } = useImguiWindows();
    

    const renderPreferencesDebug = useMemo(() => {
        return () => {   
            ImGui.Begin("Preferences", undefined, ImGui.WindowFlags.NoResize | ImGui.WindowFlags.AlwaysAutoResize);
            if (ImGui.BeginCombo('Theme', themeRef.current || DEFAULT_THEME)) {
                THEMES.forEach(themeOption => {
                    if (ImGui.Selectable(themeOption, themeRef.current == themeOption)) {
                        setTheme(themeOption);
                    }
                })
                ImGui.EndCombo();
            }
            let opacity = [opacityRef.current || DEFAULT_OPACITY]
            if (ImGui.SliderFloat('Opacity', opacity, MIN_OPACITY, MAX_OPACITY)) {
                setOpacity(opacity[0])
            }
            let scale = [scaleRef.current || DEFAULT_SCALE]
            if (ImGui.InputFloat('Scale', scale, MIN_SCALE, MAX_SCALE)) {
                setScale(scale[0])
            }
            ImGui.End();
        }
    }, [themeRef, setTheme, opacityRef, setOpacity, scaleRef, setScale])

    useEffect(() => {
        registerWindow('Preferences', renderPreferencesDebug);

        return () => {
            unregisterWindow('Preferences');
        }
    }, [renderPreferencesDebug])

    return null;
}