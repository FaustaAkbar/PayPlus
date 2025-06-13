import { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete }) => {
    // State for managing text animation and logo visibility
    const [text, setText] = useState("");
    const [showLogo, setShowLogo] = useState(false);
    const fullText = "PayPlus";

    // Effect for handling text animation and completion callback
    useEffect(() => {
        let index = 0;
        setShowLogo(true);
        
        // Set up interval for text animation
        const interval = setInterval(() => {
            setText(fullText.substring(0, index + 1));
            index++;
            
            // Check if animation is complete
            if (index >= fullText.length) {
                clearInterval(interval);
                setTimeout(onComplete, 1100);
            }
        }, 200);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <>
            {/* Import Gabriela font */}
            <link href="https://fonts.googleapis.com/css2?family=Gabriela&display=swap" rel="stylesheet" />

            {/* Main loading screen container */}
            <div className="fixed inset-0 z-50 bg-white text-[#9333EA] flex flex-col items-center justify-center">
                {/* Logo and text container */}
                <div className="flex items-center space-x-3 mb-4">
                    {/* Conditional logo rendering */}
                    {showLogo && (
                        <img 
                            src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/logoTab.png?raw=true"  
                            alt="PayPlus Logo"
                            className="w-17 h-auto"
                        />
                    )}

                    {/* Animated text with custom font */}
                    <div className="text-6xl font-mono flex items-center" style={{ fontFamily: 'Gabriela, serif' }}>
                        {text && (
                            <>
                                <span>{text.substring(0, 3)}</span>
                                <span className="text-[#FAA300]">{text.substring(3)}</span>
                            </>
                        )}
                        {/* Blinking cursor animation */}
                        <span className="animate-blink ml-1">|</span>
                    </div>
                </div>

                {/* Loading bar */}
                <div className="w-[200px] h-[2px] bg-[#9333EA] rounded relative overflow-hidden">
                    <div className="w-[40%] h-full bg-[#FAA300] shadow-[0_0_15px_#FFCC00] animate-loading-bar"></div>
                </div>
            </div>
        </>
    );
};