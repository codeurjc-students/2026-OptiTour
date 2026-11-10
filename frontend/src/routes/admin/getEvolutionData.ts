export function getEvolutionData<T>(
    items: T[],
    dateSelector: (item: T) => string | undefined | null
) {
    return items
        // Eliminate items that has not the createdAt field (due to database errors, etc)
        .filter(item => dateSelector(item))
        // Now, we sort items. Sort criteria is got from substracting pairs.
        .sort((a, b) => {
            return new Date(dateSelector(a)!).getTime() - new Date(dateSelector(b)!).getTime();
        })
        // Once it is sorted, recharts needs a data structure like this:
        // [{Period: January, new: 3, total: 3}, {Period: February, new: 2, total: 5}...]
        // (not an exact representation of the structure, but it's similar)
        // We make it using reduce function. If a month already exists, we add 1 to new.
        // If the month is not already existing, we create it in the array.
        .reduce((acc, item) => {
            const dateString = dateSelector(item)!;
            const date = new Date(dateString);
            const month = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            const period = month.charAt(0).toUpperCase() + month.slice(1);

            const existing = acc.find(periodItem => periodItem.period === period);
            if (existing) {
                existing.new += 1;
            } else {
                acc.push({ period, new: 1, total: 0 });
            }

            return acc;
        }, [] as { period: string; new: number; total: number }[])
        // Finally, we calculate the total ammount by adding all new fields. 
        .map((item, index, arr) => {
            item.total = arr.slice(0, index + 1).reduce((sum, current) => sum + current.new, 0);
            return item;
        });
}