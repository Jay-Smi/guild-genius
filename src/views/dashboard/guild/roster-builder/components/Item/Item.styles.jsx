import styled from "@emotion/styled";

export const StyledWrapper = styled.div`
    display: flex;
    box-sizing: border-box;
    transform: translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)
        scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1));
    transform-origin: 0 0;
    touch-action: manipulation;

    &.fadeIn {
        animation: fadeIn 500ms ease;
    }
    &.dragOverlay {
        --scale: 1.05;
        --box-shadow: 0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05);
        --box-shadow-picked-up: 0 0 0 calc(1px / var(--scale-x, 1))
                rgba(63, 63, 68, 0.05),
            -1px 0 15px 0 rgba(34, 33, 81, 0.01),
            0px 15px 15px 0 rgba(34, 33, 81, 0.25);
        z-index: 999;
    }
`;

export const StyledItem = styled.div`
    position: relative;
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    padding: 8px 10px;
    /* background-color: ${(props) => {
        return props.theme.palette.mode === "dark"
            ? props.theme.palette.grey[700]
            : props.theme.palette.grey[100];
    }}; */
    box-shadow: ${(props) => {
        return props.theme.palette.mode === "dark"
            ? "4px 5px 5px 2px rgba(0, 0, 0, 0.459)"
            : " 2px 3px 10px 1px rgba(0, 0, 0, 0.155)";
    }};
    outline: none;
    border-radius: 5px;
    box-sizing: border-box;
    list-style: none;
    transform-origin: 50% 50%;

    -webkit-tap-highlight-color: transparent;

    color: ${(props) => {
        return props.theme.palette.mode === "dark"
            ? props.theme.palette.text.title
            : props.theme.palette.text.primary;
    }};
    font-weight: 400;
    font-size: 1rem;
    white-space: nowrap;

    transform: scale(var(--scale, 1));
    transition: box-shadow 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22);

    &.activeplayer {
        background-color: green;
    }

    &:focus-visible {
        box-shadow: 0 0px 4px 1px #4c9ffe,
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05);
    }
    &.dragging:not(.dragOverlay) {
        opacity: var(--dragging-opacity, 0.5);
        z-index: 0;
    }

    &.dragging:not(.dragOverlay):focus {
        box-shadow: 0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05);
    }

    &.disabled {
        color: #999;
        background-color: #f1f1f1;
        cursor: not-allowed;
    }
    &.disabled:focus {
        box-shadow: 0 0px 4px 1px rgba(0, 0, 0, 0.1),
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05);
    }
    &.dragOverlay {
        cursor: inherit;
        /* box-shadow: 0 0px 6px 2px $focused-outline-color; */
        animation: pop 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22);
        transform: scale(var(--scale));
        box-shadow: var(--box-shadow-picked-up);
        opacity: 1;
    }
    &:hover.Remove {
        visibility: visible;
    }
`;

export const StyledRemove = styled.div`
    visibility: hidden;
`;

export const StyledDragHandle = styled.div`
    display: flex;
    margin-top: -12px;
    margin-bottom: -15px;
    margin-left: -12px;
`;

export const StyledActions = styled.div`
    display: flex;
    margin-top: -12px;
    margin-left: auto;
    margin-bottom: -15px;
    margin-right: -10px;
`;
