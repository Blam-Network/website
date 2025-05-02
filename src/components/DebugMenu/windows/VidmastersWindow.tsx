import { ImGui, ImVec2 } from "@mori2003/jsimgui"
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { api } from "@/src/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useDebugWindows } from "./useDebugWindows";

export const VidmastersWindow = () => {
    const { registerWindow, unregisterWindow } = useDebugWindows();
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

            if (ImGui.BeginTable('Achievements', 2)) {
                ImGui.TableSetupColumn('Name')
                ImGui.TableSetupColumn('Unlocked')
                ImGui.TableHeadersRow()
                
                ImGui.TableNextRow()
                ImGui.TableNextColumn()
                ImGui.Text(`Annual`)
                ImGui.TableNextColumn()
                ImGui.Text(String(data.annual))

                ImGui.TableNextRow()
                ImGui.TableNextColumn()
                ImGui.Text('Brianpan')
                ImGui.TableNextColumn()
                ImGui.Text(String(data.brainpan))


                ImGui.TableNextRow()
                ImGui.TableNextColumn()
                ImGui.Text('Classic')
                ImGui.TableNextColumn()
                ImGui.Text(String(data.classic))


                ImGui.TableNextRow()
                ImGui.TableNextColumn()
                ImGui.Text('Deja-Vu')
                ImGui.TableNextColumn()
                ImGui.Text(String(data.dejaVu))

                ImGui.TableNextRow()
                ImGui.TableNextColumn()
                ImGui.Text('Endure')
                ImGui.TableNextColumn()
                ImGui.Text(String(data.endure))


                ImGui.TableNextRow()
                ImGui.TableNextColumn()
                ImGui.Text('Lightswitch')
                ImGui.TableNextColumn()
                ImGui.Text(String(data.lightswitch))


                ImGui.TableNextRow()
                ImGui.TableNextColumn()
                ImGui.Text('7 on the 7th')
                ImGui.TableNextColumn()
                ImGui.Text(String(data.sevenOnSeven))

                ImGui.EndTable();
            }


            ImGui.End();
        }
    }, [isFetching, data, session])

    useEffect(() => {
        registerWindow('Vidmasters', renderVidmasterDebug);

        return () => {
            unregisterWindow('Vidmasters');
        }
    }, [renderVidmasterDebug])

    return null;
}