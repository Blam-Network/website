import { ImGui, ImVec2 } from "@mori2003/jsimgui"
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { z } from "zod";
import { DebugMenuProps } from "./DebugMenu";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { api } from "@/src/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_OPACITY, DEFAULT_SCALE, DEFAULT_THEME, Theme, useImguiPreferences } from "./useImguiPreferences";

const MIN_OPACITY = 0.1;
const MAX_OPACITY = 1;
const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const THEMES: Theme[] = ['Dark', 'Light', 'Classic']

export const PreferencesDebug = ({registerRenderer, unregisterRenderer}: DebugMenuProps) => {
    const {themeRef, setTheme, opacityRef, setOpacity, scaleRef, setScale} = useImguiPreferences()

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
        registerRenderer('Preferences', renderPreferencesDebug);

        return () => {
            unregisterRenderer('Preferences');
        }
    }, [renderPreferencesDebug])

    return null;
}