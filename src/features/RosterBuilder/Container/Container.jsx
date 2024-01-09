import React, { forwardRef, useState } from "react";
import { classNames } from "../../../utils/helpers.js";

import { Handle } from "../Handle.jsx";
import { Remove } from "../Remove.jsx";
import {
    StyledContainer,
    StyledRaid,
    StyledGroup,
    StyledCategory,
    StyledActions,
    StyledContainerHeader,
    StyledDragHandle,
    StyledLabel,
} from "./Container.styles.jsx";

const Container = forwardRef(
    (
        {
            children,
            handleProps,
            onClick,
            onRemove,
            label,
            style,
            shadow,
            type,
            ...props
        },
        ref
    ) => {
        const as = onClick ? "button" : "div";
        const [isOpen, setIsOpen] = useState(true);
        const Component =
            type === "raid"
                ? StyledRaid
                : type === "group"
                ? StyledGroup
                : StyledCategory;
        console.log(type);
        function toggleOpen() {
            setIsOpen((isOpen) => !isOpen);
        }
        return (
            <Component
                {...props}
                ref={ref}
                style={style}
                className={classNames(shadow)}
                onClick={onClick}
                tabIndex={onClick ? 0 : undefined}
                as={as}
                open={isOpen}
                type={type}
            >
                {label ? (
                    <StyledContainerHeader>
                        <StyledDragHandle>
                            <Handle {...handleProps} />
                        </StyledDragHandle>
                        <StyledLabel>{label}</StyledLabel>
                        <StyledActions>
                            {onRemove ? (
                                <Remove onClick={toggleOpen} />
                            ) : undefined}
                        </StyledActions>
                    </StyledContainerHeader>
                ) : null}
                {isOpen && <ul>{children}</ul>}
            </Component>
        );
    }
);

export default Container;

Container.displayName = "Container";
