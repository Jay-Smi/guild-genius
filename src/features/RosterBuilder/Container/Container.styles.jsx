import styled from "styled-components";

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
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;
        list-style: none;
        padding: 20px;
        margin: 0;
    }

    &.shadow {
        box-shadow: 0 1px 10px 0 rgba(34, 33, 81, 0.1);
    }
`;

export const StyledGroup = styled.div`
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
        grid-template-columns: 1fr;
        grid-gap: 10px;
        list-style: none;
        padding: 20px;
        margin: 0;
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
    margin-left: -12px;
`;

export const StyledLabel = styled.div`
    width: 100%;
    text-align: left;
`;

export const StyledActions = styled.div`
    display: flex;
`;
