import { ComponentProps, useState } from 'react'

interface ButtonProps extends ComponentProps<"button"> {
    color?: "primary" | "submit" | "cancel" | "none";
    variant?: "contained" | "icon";
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface Ripple {
    x: number;
    y: number;
    id: number;
}

export const Button = ({
    disabled,
    children,
    color = "none",
    variant,
    onClick,
    className,
    ...props
}: ButtonProps) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget.getBoundingClientRect();
        const rippleX = e.clientX - button.left;
        const rippleY = e.clientY - button.top;
        const newRipple: Ripple = {
            x: rippleX,
            y: rippleY,
            id: Date.now()
        };
        setRipples((prevRipples) => [...prevRipples, newRipple]);
        if (onClick) {
            onClick(e);
        }
    };

    const handleAnimationEnd = (rippleId: number) => {
        setRipples((prevRipples) =>
            prevRipples.filter((ripple) => ripple.id !== rippleId)
        );
    };

    const getButtonClasses = () => {
        const baseClasses = "relative overflow-hidden cursor-pointer px-6 py-3 border-none rounded text-sm font-medium transition-all duration-300 flex items-center justify-center";
        const disabledClasses = disabled ? "bg-gray-300 cursor-not-allowed" : "";

        let colorClasses = "bg-gray-50 hover:bg-gray-100 text-gray-800";

        if (variant === "icon" && color === "none") {
            colorClasses = "bg-gray-50 hover:bg-gray-100 text-gray-900 p-1";
        } else if (color === "primary") {
            colorClasses = variant === "contained"
                ? "bg-primary-9--dark hover:bg-primary-10--dark text-white"
                : "bg-gray-50 hover:bg-gray-100 text-primary-9--dark";
        } else if (color === "cancel") {
            colorClasses = variant === "contained"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-50 hover:bg-gray-100 text-red-500 font-semibold";
        } else if (color === "submit") {
            colorClasses = variant === "contained"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-50 hover:bg-gray-100 text-green-600";
        }

        return `${baseClasses} ${colorClasses} ${disabledClasses} ${className}`;
    };

    return (
        <button
            disabled={disabled}
            className={getButtonClasses()}
            onClick={handleClick}
            {...props}
        >
            {children}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="absolute w-24 h-24 bg-white bg-opacity-30 rounded-full pointer-events-none animate-ripple"
                    style={{
                        left: ripple.x + 'px',
                        top: ripple.y + 'px',
                        transform: 'translate(-50%, -50%) scale(0)',
                    }}
                    onAnimationEnd={() => handleAnimationEnd(ripple.id)}
                />
            ))}
        </button>
    );
};