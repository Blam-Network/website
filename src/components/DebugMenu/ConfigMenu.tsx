import { ImGui, ImVec2 } from "@mori2003/jsimgui"
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { z } from "zod";
import { DebugMenuProps } from "./DebugMenu";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { api } from "@/src/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ImguiThemeContext, Theme, ThemeSchema, useDebugMenuSettings } from "./useDebugMenuSettings";

export const ConfigDebug = ({registerRenderer, unregisterRenderer}: DebugMenuProps) => {
    const session = useSession().data;
    const {theme, setTheme} = useContext(ImguiThemeContext);

    const { isFetching, data } = useQuery({
        queryKey: ['cheevos'],
        queryFn: () =>
            api.xbox.getVidmasters.query(),
        enabled: !!session,
    })

    const renderConfigDebug = useMemo(() => {
        return () => {   
            ImGui.Begin("Configuration", undefined, ImGui.WindowFlags.NoResize | ImGui.WindowFlags.AlwaysAutoResize);
            if (ImGui.BeginCombo('Theme', theme)) {
                ThemeSchema.options.forEach(themeOption => {
                    if (ImGui.Selectable(themeOption, theme == themeOption)) {
                        console.log("SET THEME " + themeOption);
                        setTheme(themeOption);
                    }
                })
                ImGui.EndCombo();
            }
            ImGui.End();
        }
    }, [isFetching, data, session, theme, setTheme])

    useEffect(() => {
        registerRenderer('Config', renderConfigDebug);

        return () => {
            unregisterRenderer('Config');
        }
    }, [renderConfigDebug])

    return null;
}