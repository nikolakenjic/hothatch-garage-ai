import {
    BuildPlanInput,
    CarPromptInput,
    ModificationPromptInput,
    RecommendCarInput,
} from './ai.types';

const formatModsList = (modifications: ModificationPromptInput[]) =>
    modifications.map((m) => m.title).join(', ') || 'none';

export const buildCarRecommendationPrompt = ({
    budget,
    fuel,
    use,
}: RecommendCarInput) => `
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
) => `You are a car tuning expert.

Car:
- Brand: ${car.brand}
- Model: ${car.model}
- Year: ${car.year}

Current modifications:
${formatModsList(modifications)}

Suggest ONE next best upgrade for this car.

Respond in this format:

Upgrade: <name>
Why: <short explanation>
`;

export const buildBuildPlanPrompt = (
    car: CarPromptInput,
    modifications: ModificationPromptInput[],
    data: BuildPlanInput,
) => `
You are a hot hatch tuning expert.

Car: ${car.brand} ${car.model} (${car.year})
Current mods: ${formatModsList(modifications)}
Budget: ${data.budget}
Goal: ${data.goal}

Create a prioritized mod plan. For each mod include:
1. Name
2. Estimated cost
3. Why it matters for the goal
4. Order priority (do this first, second, etc.)

Also add one warning if anything in the plan could be unsafe if done out of order.
`;
