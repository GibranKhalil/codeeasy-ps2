import { ComponentProps, ReactElement } from "react";

export interface InteractionCardProps extends ComponentProps<"article"> {
    icon: ReactElement,
    value: number,
}