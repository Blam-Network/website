import { ImGui } from "@mori2003/jsimgui"
import { signOut, useSession } from "next-auth/react";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import { useImguiWindows } from "../ImguiWindowsOverlay/useImguiWindows";

export const AuthWindow = () => {
    const { registerWindow, unregisterWindow } = useImguiWindows();
    const session = useSession().data;
    const renderAuthDebug = useMemo(() => {
        return () => {
            ImGui.Begin(
                "Authentication", 
                undefined, 
                ImGui.WindowFlags.NoResize | ImGui.WindowFlags.AlwaysAutoResize
            );

            if (!session) {
                ImGui.Text('Not logged in.')
                ImGui.End();
                return;
            }

            const xuid = z.coerce.number().transform(xuid => xuid.toString(16).toUpperCase().padStart(16, '0')).parse(session.user.xuid);

            ImGui.Text(`gametag: ${session.user.gamertag}`)
            ImGui.SameLine();
            if (ImGui.TextLink("copy##1")) {
                navigator.clipboard.writeText(session.user.gamertag)
            }
            ImGui.Text(`xuid: ${xuid}`)
            ImGui.SameLine();
            if (ImGui.TextLink("copy##2")) {
                navigator.clipboard.writeText(xuid)
            }
            ImGui.Text(`role: ${session.user.role}`)
            ImGui.SeparatorText("Tokens")
        
            ImGui.Text(`Microsoft`)
            ImGui.SameLine();
            if (ImGui.TextLink("copy##microsoft")) {
                navigator.clipboard.writeText(session.tokens.microsoft);
            }
        
            ImGui.Text(`Xbox`)
            ImGui.SameLine();
            if (ImGui.TextLink("copy##xbox")) {
                navigator.clipboard.writeText(session.tokens.xbox);
            }
        
            ImGui.Text(`XSTS`)
            ImGui.SameLine();
            if (ImGui.TextLink("copy##xsts")) {
                navigator.clipboard.writeText(session.tokens.xsts);
            }
        
        
            ImGui.Separator();
            if (ImGui.Button("Logout")) {
                signOut()
            }
            ImGui.End();
        }
    }, [session])

    useEffect(() => {
        registerWindow('Authentication', renderAuthDebug);

        return () => {
            unregisterWindow('Authentication');
        }
    }, [renderAuthDebug])

    return null;
}