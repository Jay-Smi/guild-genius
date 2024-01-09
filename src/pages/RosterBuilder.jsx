import useRosterData from "../hooks/useRosterData";
import { RosterBuilderActual } from "./RosterBuilderActual";

export function RosterBuilder(
    adjustScale = false,

    cancelDrop,

    coordinateGetter,
    getItemStyles = () => ({}),
    wrapperStyle = () => ({}),
    modifiers,
    renderItem,
    strategy
) {
    const { categories, characters, raids, groups, players, isLoading } =
        useRosterData();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <RosterBuilderActual
            categories={categories}
            characters={characters}
            raids={raids}
            groups={groups}
            players={players}
        />
    );
}
