import { useFetchPresets } from "@src/services/tanstack/user/preset";

const RenderOne = ({ preset }: { preset: NonNullable<ReturnType<typeof useFetchPresets>["data"]>[number] }) => {
    return (
        <div>
            <h3>{preset.name}</h3>
            <ul>
                {preset.user_preset_meal.map((meal) => (
                    <li key={`${meal.meal_id}-${meal.type_id?.id}`}>
                        {meal.meal_id.name} - {meal.type_id.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export const List = () => {
    const presetsQuery = useFetchPresets();
    return(
            <div>
                <h2>Presets</h2>
                {presetsQuery.isLoading && <p>Loading...</p>}
                {presetsQuery.isError && <p>Error loading presets: {presetsQuery.error.message}</p>}
            </div>
    )
   /* if (!presetsQuery.data) return null;
    return presetsQuery.data.map((preset) => <RenderOne key={preset.id} preset={preset} />);
    */
}