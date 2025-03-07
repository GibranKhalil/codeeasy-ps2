import React from "react";

interface TitleProps {
    aditionalTitle?: string | React.ReactNode;
    title: string | React.ReactNode;
    description?: string | React.ReactNode;
    titleHasMainPageTitle?: boolean;
    align?: "left" | "center" | "right";
    className?: HTMLDivElement['className']
}

const commonClasses = {
    primaryText: "text-primary mb-4",
    mainTitle: "text-5xl font-bold text-light-gray mb-6",
    descriptionText: "text-neutral-gray mb-8",
};

export const Title = ({
    title,
    aditionalTitle,
    description,
    titleHasMainPageTitle = false,
    className,
    align = "left",
}: TitleProps) => {
    const alignmentClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <hgroup className={`${alignmentClasses[align]} ${className}`}>
            {aditionalTitle && (
                typeof aditionalTitle === "string" ? (
                    titleHasMainPageTitle 
                        ? <h3 className={commonClasses.primaryText}>{aditionalTitle}</h3> 
                        : <h4 className={commonClasses.primaryText}>{aditionalTitle}</h4>
                ) : (
                    aditionalTitle
                )
            )}

            {typeof title === "string" ? (
                titleHasMainPageTitle 
                    ? <h1 className={commonClasses.mainTitle}>{title}</h1> 
                    : <h2 className={commonClasses.mainTitle}>{title}</h2>
            ) : (
                title
            )}

            {description && (
                typeof description === "string" ? (
                    titleHasMainPageTitle 
                        ? <h2 className={commonClasses.descriptionText}>{description}</h2> 
                        : <h3 className={commonClasses.descriptionText}>{description}</h3>
                ) : (
                    description
                )
            )}
        </hgroup>
    );
};