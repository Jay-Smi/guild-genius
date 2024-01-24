import styled from "@emotion/styled";

export const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    grid-auto-rows: max-content;
    overflow: hidden;
    box-sizing: border-box;
    appearance: none;
    outline: none;
    min-width: 300px;

    border-radius: 5px;
    min-height: ${(props) => (props.isopen ? "100px" : 0)};
    transition: background-color 350ms ease;
    background-color: rgba(246, 246, 246, 1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 1em;

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
`;

export const StyledRaid = styled.div`
    display: flex;
    flex-direction: column;

    overflow: hidden;
    box-sizing: border-box;
    appearance: none;
    outline: none;
    /* min-width: 300px; */
    /* width: "auto"; */
    border-radius: var(--border-radius-sm);
    min-height: ${(props) => (props.isopen ? "100px" : 0)};

    background-color: var(#fff);

    font-size: 1em;

    & > .containerHeader {
        display: flex;
        padding: 5px 20px;
        padding-right: 8px;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        border-top-left-radius: var(--border-radius-sm);
        border-top-right-radius: var(--border-radius-sm);
    }

    & ul {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        list-style: none;
        gap: 10px 20px;
        padding: 20px;
        margin: 0;
        background-color: #ececec;
        box-shadow: inset 0 0 10px 4px rgba(0, 0, 0, 0.05);
    }

    &.shadow {
        box-shadow: 0 1px 10px 0 rgba(34, 33, 81, 0.1);
    }
`;

export const StyledGroup = styled.div`
    display: flex;
    flex-direction: column;

    overflow: hidden;
    box-sizing: border-box;
    appearance: none;
    outline: none;
    min-width: 300px;

    border-radius: 5px;
    min-height: ${(props) => (props.isopen ? "100px" : 0)};
    transition: background-color 350ms ease;
    background-color: rgba(246, 246, 246, 1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 1em;

    & .containerHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px 10px;

        align-items: center;
        background-color: #fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
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
        background-color: #e4e4e4;
    }

    &.shadow {
        box-shadow: 0 1px 10px 0 rgba(34, 33, 81, 0.1);
    }
`;

export const StyledCategory = styled.div`
    display: flex;
    flex-direction: column;
    grid-auto-rows: max-content;
    overflow: hidden;
    box-sizing: border-box;
    appearance: none;
    outline: none;
    min-width: 300px;

    border-radius: 5px;
    min-height: ${(props) => (props.isopen ? "100px" : 0)};
    transition: background-color 350ms ease;
    background-color: rgba(246, 246, 246, 1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 1em;

    & .containerHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        padding-right: 8px;
        align-items: center;
        background-color: #fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
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
`;

export const StyledContainerHeader = styled.div`
    display: flex;
    padding: 5px 20px;
    padding-right: 8px;
    align-items: center;
    background-color: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

export const StyledDragHandle = styled.div`
    cursor: grabbing;
`;
