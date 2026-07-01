import React from 'react';

const ShinyText = ({
    text,
    color = '#11224D', // cor base
    shineColor = '#00F2FE', // cor reflexo (neon ciano)
    speed = 3,
    disabled = false,
    className = ''
}) => {
    const animationDuration = `${speed}s`;

    return (
        <span
            className={`inline-block text-transparent bg-clip-text ${className}`}
            style={{
                backgroundImage: `linear-gradient(120deg, ${color} 40%, ${shineColor} 50%, ${color} 60%)`,
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
                animation: disabled ? 'none' : `shine ${speed}s linear infinite`,
            }}
        >
            <style>{`
                @keyframes shine {
                    0% { background-position: 200% 0; }
                    100& {background-position: -200% 0; }
                }
            `}</style>
            {text}
        </span>
    );
};

export default ShinyText;