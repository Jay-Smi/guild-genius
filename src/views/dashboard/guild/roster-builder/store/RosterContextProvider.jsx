import { createContext, useRef } from "react";
import createContainerStore from "./RosterStore";

export const RosterContext = createContext(null);

function RosterContextProvider({
    children,
    categories,
    characters,
    guildCharacterTags,
    players,
    characterTags,
}) {
    const containerStore = useRef(
        createContainerStore({
            children,
            categories,
            characters,
            guildCharacterTags,
            players,
            characterTags,
        })
    ).current;
    return (
        <RosterContext.Provider value={containerStore}>
            {children}
        </RosterContext.Provider>
    );
}

export default RosterContextProvider;
