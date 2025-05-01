import { ImGui, ImVec2 } from "@mori2003/jsimgui"
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { z } from "zod";
import { DebugMenuProps } from "./DebugMenu";
import { useEffect, useMemo } from "react";
import { api } from "@/src/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const VidmastersDebug = ({registerRenderer, unregisterRenderer}: DebugMenuProps) => {
    const session = useSession().data;
    const { isFetching, data } = useQuery({
        queryKey: ['cheevos'],
        queryFn: () =>
            api.xbox.getVidmasters.query(),
        enabled: !!session,
    })

    const renderVidmasterDebug = useMemo(() => {
        return () => {            
            ImGui.Begin("Road to Recon", undefined, ImGui.WindowFlags.NoResize | ImGui.WindowFlags.AlwaysAutoResize);
            
            if (!session) {
                ImGui.Text('Not logged in.')
                ImGui.End();
                return;
            }
            if (isFetching) {
                ImGui.ProgressBar(-1.0 * ImGui.GetTime(), new ImVec2(0.0, 0.0), 'Loading Vidmasters...');
                ImGui.End();
                return;
            }
            if (!data) {
                ImGui.Text('Vidmasters Unavailable');
                ImGui.End();
                return;
            }
            
            ImGui.Text(`Annual: ${data.annual}`)
            ImGui.Text(`Brianpan: ${data.brainpan}`)
            ImGui.Text(`Classic: ${data.classic}`)
            ImGui.Text(`Deja-Vu: ${data.dejaVu}`)
            ImGui.Text(`Endure: ${data.endure}`)
            ImGui.Text(`Lightswitch: ${data.lightswitch}`)
            ImGui.Text(`7 on the 7th: ${data.sevenOnSeven}`)
            ImGui.End();
        }
    }, [isFetching, data, session])

    useEffect(() => {
        registerRenderer('Vidmasters', renderVidmasterDebug);

        return () => {
            unregisterRenderer('Vidmasters');
        }
    }, [renderVidmasterDebug])

    return null;
}