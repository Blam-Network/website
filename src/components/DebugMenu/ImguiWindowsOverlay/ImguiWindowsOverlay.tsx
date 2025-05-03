"use client"
import { ReactNode, useCallback, useEffect, useRef } from "react"
import { ImGui, ImGuiImplWeb, ImGuiIO, ImVec2 } from "@mori2003/jsimgui";
import { TransparentOverlayCanvas } from "../TransparentOverlayCanvas";
import { ImguiPreferencesProvider, useImguiPreferences } from "./useImguiPreferences";
import { AuthWindow } from "../windows/AuthWindow";
import { VidmastersWindow } from "../windows/VidmastersWindow";
import { PreferencesWindow } from "./PreferencesWindow";
import { ImguiWindowsProvider, useImguiWindows } from "./useImguiWindows";

let IMGUI_OVERLAY_INSTANCED = false;

type ImguiWindowsOverlayProps = {
    visible?: boolean
    watermark?: string;
    enablePreferencesWindow?: boolean;
    children?: ReactNode;
}

const ImguiWindowsOverlayWithoutContext = ({
    children, 
    visible, 
    watermark, 
    enablePreferencesWindow
}: ImguiWindowsOverlayProps) => {
    const { themeRef, opacityRef, scaleRef } = useImguiPreferences();
    const { renderOpenWindows, openMenu, isMenuOpen } = useImguiWindows();
    const imguiIo = useRef<ImGuiIO>()
    
    // We take this in as a prop, but we need a ref to be available for the render loop.
    const visibleRef = useRef<boolean>();
    useEffect(() => {
        visibleRef.current = visible == true || visible == undefined
    }, [visible])

    // see above
    const watermarkRef = useRef<string | undefined>();
    useEffect(() => {
        watermarkRef.current = watermark;
    }, [watermark])

    useEffect(() => {
        if (IMGUI_OVERLAY_INSTANCED) {
            console.warn("Multiple instances of the ImguiWindowsOverlay are rendering, this is not supported.")
        }   
        IMGUI_OVERLAY_INSTANCED = true;
        () => { IMGUI_OVERLAY_INSTANCED = false }
    }, [])

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
        if (!visibleRef.current) {
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            return;
        }

        try {
            ImGuiImplWeb.BeginRenderWebGL();
        } catch (e) {
            // We're probably not initialized yet, abort.
            return;
        }

        ImGui.PushStyleVar(ImGui.StyleVar.Alpha, opacityRef.current || 1)
        if (imguiIo.current)
            imguiIo.current.FontGlobalScale = scaleRef.current || 1

        let watermark = watermarkRef.current;
        if (watermark) {
            ImGui.StyleColorsDark();
            ImGui.SetNextWindowPos(new ImVec2(0, 0))
            ImGui.PushStyleVarX(ImGui.StyleVar.WindowPadding, 2)
            ImGui.PushStyleVarY(ImGui.StyleVar.WindowPadding, 2)
            ImGui.Begin('Watermark', undefined,
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
            ImGui.Text(watermark);
            ImGui.End();
            ImGui.PopStyleVar(2);
        }

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
                new ImVec2(
                    (imguiIo.current?.DisplaySize.x || 0) - 10, 
                    (imguiIo.current?.DisplaySize.y || 0)  - 10
                ),
                undefined,
                new ImVec2(1, 1)
            )
            ImGui.Begin('Menus##buttoncontainer', undefined,
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
    }, [renderOpenWindows, openMenu, isMenuOpen, visibleRef])

    return <>
        <TransparentOverlayCanvas
            canvasRef={setCanvasRef}
            context="webgl2"
            render={renderLoop}
        />
        {/* children are only intended for adding debug windows,
         they're rendered with WebGL so if someone passes through an element,
         we dont render it. */}
        <div style={{display: 'none'}}>
            {enablePreferencesWindow !== false && <PreferencesWindow />}
            {children}
        </div>
    </>
}

export const ImguiWindowsOverlay = (props: ImguiWindowsOverlayProps) => (
    <ImguiWindowsProvider>
        <ImguiPreferencesProvider>
            <ImguiWindowsOverlayWithoutContext {...props} />
        </ImguiPreferencesProvider>
    </ImguiWindowsProvider>
)