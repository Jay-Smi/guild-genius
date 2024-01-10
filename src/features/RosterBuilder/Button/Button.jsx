import { forwardRef } from "react";
import { classNames } from "../../../utils/helpers.js";
import { StyledButton } from "./Button.styles.jsx";

export const Button = forwardRef(
    ({ active, className, cursor, style, ...props }, ref) => {
        return (
            <StyledButton
                ref={ref}
                {...props}
                className={classNames(
                    className,
                    props.overlay === "overlay" ? "overlay" : "",
                    props.type === "handle" ? "handle" : ""
                )}
                tabIndex={0}
                style={{ ...style }}
            />
        );
    }
);

Button.displayName = "Button";
