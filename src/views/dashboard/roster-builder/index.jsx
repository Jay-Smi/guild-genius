import useRosterData from "../../../hooks/useRosterData";
import { RosterBuilderActual } from "./RosterBuilderActual";

export default function RosterBuilder() {
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
