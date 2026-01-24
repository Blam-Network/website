"use client"

import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Fade, Slide } from '@mui/material';
import { useSession } from "next-auth/react";

interface MOTDProps {
    title?: string;
    subtitle?: string;
    message?: string;
    imageUrl?: string;
}

const useMOTDState = () => {
    return useState(false);
}

export const useOpenMOTD = () => {
    const [, setOpen] = useState(false);
    return useCallback(() => {
        setOpen(true);
    }, [setOpen]);
}

export default function MOTD({ 
    title = "",
    subtitle = "",
    message = "",
    imageUrl = "",
}: MOTDProps) {
    const [show, setShow] = useMOTDState();
    const [animateIn, setAnimateIn] = useState(false);
    const [showOnionSkin, setShowOnionSkin] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        // Check if user has seen the MOTD today
        const lastSeen = localStorage.getItem('motd-last-seen');
        const today = new Date().toDateString();
        
        if (session?.user) {
            setShow(true);
            // Trigger animations after a brief delay
            setTimeout(() => {
                setAnimateIn(true);
            }, 100);
        }

        // Toggle onion skin with 'O' key
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'o' || e.key === 'O') {
                // setShowOnionSkin(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [session?.user]);

    const handleContinue = () => {
        const today = new Date().toDateString();
        localStorage.setItem('motd-last-seen', today);
        setAnimateIn(false);
        setTimeout(() => {
            setShow(false);
        }, 500);
    };

    if (!show) return null;

    return (
        <Box>
            {/* Backdrop with fade animation */}
            <Fade in={animateIn} timeout={800}>
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 100000,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}>
                    {/* Background gradient overlay */}
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(ellipse at center, rgba(0, 40, 80, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)',
                        zIndex: -1,
                    }}/>
                </Box>
            </Fade>

            {/* MOTD Content - slides in from right */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100001,
                pointerEvents: 'none',
                '& > *': {
                    pointerEvents: 'auto',
                },
            }}>
                <Box sx={{
                    transform: animateIn ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '100%',
                }}>

                {/* Image Layer - Large blue box with image */}
                <Box sx={{
                    position: 'absolute',
                    left: '12vw',
                    top: '8vh',
                    width: '88vw',
                    height: '86vh',
                    backgroundColor: 'rgba(10, 25, 45, 0.85)',
                    border: '1px solid rgba(60, 100, 140, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>               

                    {/* Black header strip */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        height: '8vh',
                        width: '100%',
                        borderBottom: '1px solid rgba(60, 100, 140, 0.2)',
                    }}>
                        {/* "NEW TRANSMISSION" Header - Above the boxes */}
                        <Typography 
                            variant="h3" 
                            sx={{
                                marginLeft: '4vw',
                                fontFamily: '"Conduit ITC", "Segoe UI", sans-serif',
                                color: 'white',
                                fontWeight: 400,
                                letterSpacing: '0',
                                textTransform: 'uppercase',
                                fontSize: '3.65em',
                                lineHeight: 1,
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>

                    {/* Content area with image on left, dark blue on right */}
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        overflow: 'hidden',
                        pl: '4vw',
                    }}>
                        {/* Image on left side - full height */}
                        <Box
                            component="img"
                            src={imageUrl}
                            alt="MOTD"
                            sx={{
                                width: '32%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                flexShrink: 0,
                            }}
                        />
                        {/* Dark blue area on right */}
                        <Box sx={{
                            width: '41vw',
                            backgroundColor: 'rgba(10, 25, 45, 0.95)',
                        }} />
                    </Box>
                    
                    {/* Black footer strip */}
                    <Box sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        height: '6vh',
                        width: '100%',
                        borderBottom: '1px solid rgba(60, 100, 140, 0.2)',
                    }}>
                        {/* Continue Button - Bottom right of screen */}
                        <Box sx={{
                            zIndex: 100001,
                            width: '71.5vw',
                            display: 'flex',
                            flexDirection: 'row-reverse',
                        }}>
                            <Button
                                onClick={handleContinue}
                                variant='text'
                                sx={{
                                    fontFamily: '"Conduit ITC", "Segoe UI", sans-serif',
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    textTransform: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 3,
                                    py: 1,
                                }}
                            >
                                <Box 
                                    component="span" 
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        border: '2px solid currentColor',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        color: 'green',
                                    }}
                                >
                                    A
                                </Box>
                                Let's Go!
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Text Layer - Smaller blue box that overlaps the image */}
                <Box sx={{
                    position: 'absolute',
                    left: '39vw',
                    top: '19vh',
                    width: '61.5vw',
                    height: '62vh',
                    backgroundColor: 'rgba(15, 35, 60, 0.7)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(60, 100, 140, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                }}>
                    {/* Black header strip with title */}
                    <Box sx={{
                        backgroundColor: 'rgba(5, 15, 40, 0.6)',
                        height: '6vh',
                        borderBottom: '1px solid rgba(60, 76, 140, 0.3)',
                    }}>
                        <Typography 
                            variant="h4" 
                            sx={{
                                fontFamily: '"Conduit ITC", "Segoe UI", sans-serif',
                                color: 'white',
                                fontWeight: 400,
                                textTransform: 'uppercase',
                                letterSpacing: 0,
                                fontSize: '2.5em',
                                marginLeft: '1.2vw',
                            }}
                        >
                            {subtitle}
                        </Typography>
                    </Box>

                    {/* Text content */}
                    <Box sx={{
                        flex: 1,
                        p: '1vw',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                    }}>
                        <Typography 
                            sx={{
                                fontFamily: '"Conduit ITC", "Segoe UI", sans-serif',
                                color: '#94B2D5',
                                fontSize: '1.75em',
                                lineHeight: 1.05,
                                whiteSpace: 'pre-line',
                                width: '40vw'
                            }}
                        >
                            {message.replaceAll('|r|n', '\r\n')}
                        </Typography>
                    </Box>
                </Box>


                </Box>

                {/* Onion Skin Overlay - Press 'O' to toggle */}
                {showOnionSkin && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 200000,
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            component="img"
                            src="https://i.gyazo.com/2605a549c76fef3a066ae539ffc5c89c.jpg"
                            alt="Reference overlay"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                opacity: 0.5,
                            }}
                        />
                        <Typography
                            sx={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                color: 'red',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                            }}
                        >
                            Onion Skin Mode (Press O to toggle)
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
