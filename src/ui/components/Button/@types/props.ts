import { ComponentProps } from "react";

export interface ButtonProps extends ComponentProps<"button"> {
    color?: "primary" | "submit" | "cancel" | "none";
    variant?: "contained" | "icon";
}