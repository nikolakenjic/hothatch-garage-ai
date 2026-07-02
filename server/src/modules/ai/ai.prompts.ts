export type RecommendCarPromptInput = {
    budget: string;
    fuel: string;
    use: string;
};

export type CarPromptInput = {
    brand: string;
    model: string;
    year: number;
};

export type ModificationPromptInput = {
    title: string;
};

export const buildCarRecommendationPrompt = ({
    budget,
    fuel,
    use,
}: RecommendCarPromptInput) => `
You are a car expert specialized in hot hatch cars.

User preferences:
- Budget: ${budget}
- Fuel: ${fuel}
- Use: ${use}

Recommend ONE hot hatch car with a short explanation.
`;

export const buildUpgradeRecommendationPrompt = (
    car: CarPromptInput,
    modifications: ModificationPromptInput[],
) => {
    const modsList = modifications.map((m) => m.title).join(', ') || 'none';

    return `
You are a car tuning expert.

Car:
- Brand: ${car.brand}
- Model: ${car.model}
- Year: ${car.year}

Current modifications:
${modsList}

Suggest ONE next best upgrade for this car.

Respond in this format:

Upgrade: <name>
Why: <short explanation>
`;
};

export const buildBuildPlanPrompt = (
    car: CarPromptInput,
    modifications: ModificationPromptInput[],
    data: {budget: string; goal: string},
) => {
    const modsList = modifications.map((m) => m.title).join(', ') || 'none';

    return `
You are a hot hatch tuning expert.

Car: ${car.brand} ${car.model} (${car.year})
Current mods: ${modsList}
Budget: ${data.budget}
Goal: ${data.goal}

Create a prioritized mod plan. For each mod include:
1. Name
2. Estimated cost
3. Why it matters for the goal
4. Order priority (do this first, second, etc.)

Also add one warning if anything in the plan could be unsafe if done out of order.
`;
};
