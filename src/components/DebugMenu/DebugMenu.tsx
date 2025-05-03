"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { ImGui, ImGuiImplWeb, ImGuiIO, ImVec2, ImVec4 } from "@mori2003/jsimgui";
import { TransparentOverlayCanvas } from "./TransparentOverlayCanvas";
import { ImguiPreferencesProvider, useImguiPreferences } from "./useImguiPreferences";
import { AuthWindow } from "./windows/AuthWindow";
import { VidmastersWindow } from "./windows/VidmastersWindow";
import { PreferencesWindow } from "./windows/PreferencesWindow";
import { DebugWindowsProvider, useDebugWindows } from "./windows/useDebugWindows";

const DebugMenuWithoutContext = () => {
    const { themeRef, opacityRef, scaleRef, showOverlayRef, setShowOverlay } = useImguiPreferences();
    const { renderOpenWindows, openMenu, isMenuOpen } = useDebugWindows();
    const imguiIo = useRef<ImGuiIO>()

    const toggleImguiVisible = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Backspace" && event.ctrlKey)
                setShowOverlay(!showOverlayRef.current);
        },
        [showOverlayRef, setShowOverlay]
    );

    useEffect(() => {
        const htmlElement = document.getElementsByTagName('html').item(0);
        if (!htmlElement) {
            throw new Error("UNREACHABLE: HTML element not found.")
        }

        htmlElement.addEventListener('keydown', toggleImguiVisible);
        return () => {
            htmlElement.removeEventListener('keydown', toggleImguiVisible)
        }
    }, [toggleImguiVisible])


    const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
        if (canvas) {
            ImGuiImplWeb.InitWebGL(canvas)
                .then(() => {
                    imguiIo.current = ImGui.GetIO();
                })
                .catch((e) => {
                    // There's no exposed API to tell if ImGUI has been initialized,
                    // So we just try to initialize it whenever the canvas changes,
                    // and catch any errors.
                    console.warn('Error initializing ImGui: ' + String(e))
                });
        }
    }, []);


    const renderLoop = useCallback((gl: WebGL2RenderingContext) => {
        if (!showOverlayRef.current) {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            return;
        }

        const canvasHeight = gl.canvas.height;
        const canvasWidth = gl.canvas.width;
        const scale = window.devicePixelRatio || 1;

        try {
            ImGuiImplWeb.BeginRenderWebGL();
        } catch (e) {
            // We're probably not initialized yet, abort.
            return;
        }

        ImGui.PushStyleVar(ImGui.StyleVar.Alpha, opacityRef.current || 1)
        if (imguiIo.current)
            imguiIo.current.FontGlobalScale = scaleRef.current || 1
        // ImGui.ShowIDStackToolWindow()
        // ImGui.ShowDemoWindow();


        // ImGui.StyleColorsDark();
        ImGui.SetNextWindowPos(new ImVec2(0, 0))
        ImGui.PushStyleVarX(ImGui.StyleVar.WindowPadding, 2)
        ImGui.PushStyleVarY(ImGui.StyleVar.WindowPadding, 2)
        ImGui.Begin('Watermark', undefined,
            // ImGui.WindowFlags.NoBackground |
            ImGui.WindowFlags.NoTitleBar |
            ImGui.WindowFlags.NoBringToFrontOnFocus |
            ImGui.WindowFlags.NoDecoration |
            ImGui.WindowFlags.NoDocking |
            ImGui.WindowFlags.NoFocusOnAppearing |
            ImGui.WindowFlags.NoNav |
            ImGui.WindowFlags.NoNavFocus |
            ImGui.WindowFlags.NoCollapse |
            ImGui.WindowFlags.NoResize |
            ImGui.WindowFlags.NoInputs |
            ImGui.WindowFlags.NoMouseInputs |
            ImGui.WindowFlags.AlwaysAutoResize
        )
        ImGui.Text(`Blam Network | ${process.env.NODE_ENV} Environment`);
        ImGui.End();
        ImGui.PopStyleVar(2);

        switch (themeRef.current) {
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

        renderOpenWindows(gl);

        ImGui.StyleColorsDark();

        if (!isMenuOpen()) {
            ImGui.SetNextWindowPos(
                new ImVec2(canvasWidth * (1 / scale) - 10, canvasHeight * (1 / scale) - 10),
                undefined,
                new ImVec2(1, 1)
            )
            ImGui.Begin('Menu##buttoncontainer', undefined,
                ImGui.WindowFlags.NoBackground |
                ImGui.WindowFlags.NoTitleBar |
                ImGui.WindowFlags.NoResize |
                ImGui.WindowFlags.AlwaysAutoResize
            )

            if (ImGui.Button("Menus##button")) {
                openMenu();
            }
            ImGui.End();
        }

        ImGui.PopStyleVar()

        ImGuiImplWeb.EndRenderWebGL();
    }, [renderOpenWindows, openMenu, isMenuOpen, showOverlayRef])

    return <>
        <TransparentOverlayCanvas
            canvasRef={setCanvasRef}
            context="webgl2"
            render={renderLoop}
        />
        <AuthWindow />
        <VidmastersWindow />
        <PreferencesWindow />
    </>
}

export const DebugMenu = () => {
    return (
        <DebugWindowsProvider>
            <ImguiPreferencesProvider>
                <DebugMenuWithoutContext />
            </ImguiPreferencesProvider>
        </DebugWindowsProvider>
    )
}