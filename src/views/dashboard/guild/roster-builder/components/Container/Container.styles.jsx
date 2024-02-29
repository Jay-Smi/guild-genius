import { useTheme, styled, Box } from "@mui/material";
import emotionStyled from "@emotion/styled";

export const StyledRaid = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isopen" && prop !== "unavailable",
})(({ theme, isopen, unavailable }) => ({
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxsizing: "border-box",
    appearance: "none",
    outline: "none",
    resize: "horizontal",
    minWidth: "330px",
    maxWidth: "1140px",
    height: "auto",
    minHeight: isopen ? "100px" : "0",
    borderRadius: "12px",
    backgroundColor:
        theme.palette.mode === "dark"
            ? theme.palette.background.dark2
            : theme.palette.grey[100],
    /* border: 1px solid
        ${(props) => {
        return props.theme.palette.mode === "dark"
            ? props.theme.palette.grey[600]
            : props.theme.palette.grey[300];
    }}; */
    boxShadow: unavailable
        ? `4px 5px 5px 2px ${theme.palette.error.dark}`
        : theme.palette.mode === "dark"
        ? "4px 5px 5px 2px rgba(0, 0, 0, 0.459)"
        : " 2px 3px 10px 1px rgba(0, 0, 0, 0.155)",
    fontSize: "1em",

    "& > .containerHeader": {
        display: "flex",

        padding: "5px 20px",
        paddingRight: "8px",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
        borderBottom: `1px solid
            ${
                theme.palette.mode === "dark"
                    ? theme.palette.grey[600]
                    : theme.palette.grey[300]
            }`,
    },

    "& > ul": {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        justifyItems: "center",
        listStyle: "none",

        gap: "20px 20px",
        padding: "20px",
        margin: "0",
        backgroundColor:
            theme.palette.mode === "dark"
                ? theme.palette.background.dark2
                : theme.palette.grey[100],
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
        /* box-shadow: inset 0 0 10px 4px rgba(0, 0, 0, 0.05); */
    },

    "&.shadow": {
        boxShadow: "0 1px 10px 0 rgba(34, 33, 81, 0.1)",
    },
}));

export const StyledGroup = emotionStyled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
    appearance: none;
    outline: none;
    min-width: 250px;
    max-width: 300px;
    min-height: ${(props) => (props.isopen ? "100px" : 0)};
    transition: background-color 350ms ease;
    font-size: 1em;
    border-radius: 12px;
    background-color: ${(props) => {
        return props.theme.palette.mode === "dark"
            ? props.theme.palette.background.dark1
            : props.theme.palette.grey[300];
    }};
    box-shadow: ${(props) => {
        return props.theme.palette.mode === "dark"
            ? "4px 5px 5px 2px rgba(0, 0, 0, 0.459)"
            : " 2px 3px 10px 1px rgba(0, 0, 0, 0.155)";
    }};

    & .containerHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px 10px;

        align-items: center;
        background-color: ${(props) => {
            return props.theme.palette.background.paper;
        }};

        border-bottom: 1px solid
            ${(props) => {
                return props.theme.palette.mode === "dark"
                    ? props.theme.palette.grey[600]
                    : props.theme.palette.grey[300];
            }};
    }

    & .headerInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 200px;
    }

    & ul {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 10px;
        list-style: none;
        padding: 20px;
        margin: 0;
        background-color: ${(props) => {
            return props.theme.palette.mode === "dark"
                ? props.theme.palette.background.dark1
                : props.theme.palette.grey[300];
        }};
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    &.shadow {
        box-shadow: 0 1px 10px 0 rgba(34, 33, 81, 0.1);
    }
`;

export const StyledCategory = emotionStyled.div`
    display: flex;
    flex-direction: column;
    grid-auto-rows: max-content;
    overflow: hidden;
    box-sizing: border-box;
    appearance: none;
    outline: none;
    min-width: 300px;
    min-height: ${(props) => (props.isopen ? "100px" : 0)};
    transition: background-color 350ms ease;
    border-radius: 12px;
    background-color: ${(props) => {
        return props.theme.palette.mode === "dark"
            ? props.theme.palette.background.dark2
            : props.theme.palette.grey[100];
    }};
    /* border: 1px solid
        ${(props) => {
            return props.theme.palette.mode === "dark"
                ? props.theme.palette.grey[600]
                : props.theme.palette.grey[300];
        }}; */
    box-shadow: ${(props) => {
        return props.theme.palette.mode === "dark"
            ? "4px 5px 5px 2px rgba(0, 0, 0, 0.459)"
            : " 2px 3px 10px 1px rgba(0, 0, 0, 0.155)";
    }};
    font-size: 1em;

    & .containerHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        padding-right: 8px;
        align-items: center;

        background-color: ${(props) => {
            return props.theme.palette.background.paper;
        }};

        border-bottom: 1px solid
            ${(props) => {
                return props.theme.palette.mode === "dark"
                    ? props.theme.palette.grey[600]
                    : props.theme.palette.grey[300];
            }};
    }

    & .headerInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 200px;
    }

    & ul {
        display: grid;
        grid-gap: 10px;
        list-style: none;
        padding: 20px;
        margin: 0;
    }

    &.shadow {
        box-shadow: 0 1px 10px 0 rgba(34, 33, 81, 0.1);
    }
    &.dragOverlay {
        scale: 1.05;
    }
`;

// export const StyledContainerHeader = styled.div`
//     display: flex;
//     padding: 5px 20px;
//     padding-right: 8px;
//     align-items: center;
//     background-color: #fff;
//     border-top-left-radius: 5px;
//     border-top-right-radius: 5px;
//     border-bottom: 1px solid rgba(0, 0, 0, 0.08);
// `;

export const StyledDragHandle = emotionStyled.div`
    cursor: grabbing;
`;
