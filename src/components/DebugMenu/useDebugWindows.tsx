import { ImGui, ImVec2 } from "@mori2003/jsimgui";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

export const DebugWindowEnum = z.enum([
    'Menu',

    'Authentication',
    'Vidmasters',
    'Config',
])

export type DebugWindow = z.infer<typeof DebugWindowEnum>;

export type WindowRenderer = (gl: WebGL2RenderingContext) => void;

export const useDebugWindows = () => {
    const registeredWindowsRef = useRef<{[name: string]: WindowRenderer}>({});
    const openWindowsRef = useRef<DebugWindow[]>();
    const registerWindow = useCallback((name: DebugWindow, renderer: (gl: WebGL2RenderingContext) => void) => {
        console.log('registering renderer for ' + name)
        registeredWindowsRef.current[name] = renderer;
    }, [registeredWindowsRef])
    const unregisterWindow = useCallback((name: string) => {
        delete registeredWindowsRef.current[name];
    }, [registerWindow]);

    const isWindowOpen = useCallback((name: DebugWindow) => {
        return openWindowsRef.current?.includes(name);
    }, [openWindowsRef.current])
    const setOpenWindowsAndStore = useCallback((openWindows: DebugWindow[]) => {
        localStorage.setItem("debugMenu.windows", JSON.stringify(openWindows));
        openWindowsRef.current = openWindows;
    }, [openWindowsRef.current])
    const toggleWindow = useCallback((name: DebugWindow) => {
        if (isWindowOpen(name)) {
            setOpenWindowsAndStore([...(openWindowsRef.current || []).filter(window => window !== name)]);
        }
        else {
            setOpenWindowsAndStore([...(openWindowsRef.current || []), name]);
        }
    }, [openWindowsRef.current, isWindowOpen])
    const openMenu = useCallback(() => {
        if (!isWindowOpen('Menu')) {
            toggleWindow('Menu');
        }
    }, [isWindowOpen, toggleWindow])
    const closeMenu = useCallback(() => {
        if (isWindowOpen('Menu')) {
            toggleWindow('Menu');
        }
    }, [isWindowOpen, toggleWindow])
    const isMenuOpen = useCallback(() => isWindowOpen('Menu'), [isWindowOpen])
    const renderOpenWindows = useCallback((gl: WebGL2RenderingContext) => {
        openWindowsRef.current?.forEach(window => {
            const renderer = registeredWindowsRef.current[window];

            if (renderer) {
                renderer(gl);
            }
        })

    }, [openWindowsRef, registeredWindowsRef])

    useEffect(() => {
        registerWindow('Menu', (gl: WebGL2RenderingContext) => {
            const canvasHeight = gl.canvas.height;
            const canvasWidth = gl.canvas.width;
            const scale = window.devicePixelRatio || 1;
            ImGui.SetNextWindowPos(
                new ImVec2(canvasWidth * (1 / scale) - 10, canvasHeight * (1 / scale) - 10),
                undefined,
                new ImVec2(1, 1)
            )

            ImGui.Begin('Menu', undefined, 
                ImGui.WindowFlags.NoResize 
                | ImGui.WindowFlags.AlwaysAutoResize 
                | ImGui.WindowFlags.NoCollapse
                | ImGui.WindowFlags.NoTitleBar
            );
                let menuNames = DebugWindowEnum.options;
                if (ImGui.BeginMultiSelect(ImGui.MultiSelectFlags.None, undefined, menuNames.length - 1)) {
                    for (let i = 0; i < menuNames.length; i++) {
                        let name = menuNames[i];
                        if (name == 'Menu') continue;
                        if (ImGui.Selectable(name, isWindowOpen(name))) {
                            toggleWindow(name);
                        }
                    }
                    if (ImGui.Selectable('Close', false)) {
                        closeMenu();
                    }
                }
                ImGui.EndMultiSelect();
            ImGui.End();
        })
        return () => {
            unregisterWindow('Menu')
        }
    }, [toggleWindow, isWindowOpen])

    if (openWindowsRef.current == undefined) {
        if (localStorage.getItem("debugMenu.windows")) {
            const parsedWindows = DebugWindowEnum
                .array()
                .safeParse(
                    JSON.parse(localStorage.getItem("debugMenu.windows") || '')
                );
            console.log({parsedWindows})

            if (parsedWindows.success) {
                openWindowsRef.current = parsedWindows.data;
            } 
            else {
                openWindowsRef.current = [];
            }
        } else {
            openWindowsRef.current = [];
        }
    }
  
    return { openMenu, isMenuOpen, renderOpenWindows, registerWindow, unregisterWindow } as const;
  };