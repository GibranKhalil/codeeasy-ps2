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
    primaryText: "text-primary-9--dark mb-4",
    mainTitle: "text-5xl font-bold text-dark-12 mb-6 leading-[3.5rem]",
    descriptionText: "text-dark-11 mb-8 font-regular text-md",
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