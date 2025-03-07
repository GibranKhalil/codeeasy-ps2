import { ComponentProps } from "react"

type ButtonProps = ComponentProps<'button'>

export const Button= ({children, className, ...rest}: ButtonProps) => {
    return(
        <button {...rest} className={`inline-block bg-primary font-bold text-light-gray px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors ${className}`}>
            {children}
        </button>
    )
}