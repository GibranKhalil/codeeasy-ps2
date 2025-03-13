import type { SpinnerProps } from "./@types/props";

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const innerSizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <div
            className={`relative rounded-full border-2 border-gray-800 cursor-not-allowed animate-spin ${sizeClasses[size]} ${className}`}
            style={{
                boxShadow:
                    '-10px -10px 10px #6359f8, 0px -10px 10px 0px #9c32e2, 10px -10px 10px #f36896, ' +
                    '10px 0 10px #ff0b0b, 10px 10px 10px 0px #ff5500, 0 10px 10px 0px #ff9500, ' +
                    '-10px 10px 10px 0px #ffb700'
            }}
        >
            <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            rounded-full border-2 border-gray-800 ${innerSizeClasses[size]}`}
            />
        </div>
    );
};

export default Spinner;