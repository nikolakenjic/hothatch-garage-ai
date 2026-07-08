import {
    BuildPlanInput,
    BuildReviewInput,
    CarPromptInput,
    ModificationPromptInput,
    NextUpgradeInput,
    RecommendCarInput,
} from './ai.types';

const formatModsList = (modifications: ModificationPromptInput[]) => {
    if (modifications.length === 0) {
        return 'No modifications added yet.';
    }

    return modifications
        .map((mod) => {
            const brand = mod.brand ? ` | Brand: ${mod.brand}` : '';
            const cost = mod.cost ? ` | Cost: ${mod.cost}` : '';

            return `- ${mod.title} | Category: ${mod.category} | Status: ${mod.status}${brand}${cost}`;
        })
        .join('\n');
};

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

export const buildNextUpgradePrompt = (
    car: CarPromptInput,
    modifications: ModificationPromptInput[],
    data: NextUpgradeInput,
) => `
You are a professional hot hatch garage advisor.

Your goal is to recommend sensible upgrades, not the most expensive upgrades.

Car:
- Brand: ${car.brand}
- Model: ${car.model}
- Year: ${car.year}

Current modifications:
${formatModsList(modifications)}

User goal:
${data.goal}

User budget:
${data.budget}

Rules:

- Prioritize tires, suspension, alignment and brakes before power upgrades when the goal is handling.
- Prioritize maintenance and reliability before performance upgrades when reliability is the goal.
- Avoid recommending upgrades already installed.
- Respect the user's budget.
- Recommend realistic upgrades for a daily-driven hot hatch.
- Explain why each recommendation is valuable.

Respond in this format:

Recommended next upgrade:

Priority 1:
Upgrade:
Estimated cost:
Why:

Priority 2:
Upgrade:
Estimated cost:
Why:

Priority 3:
Upgrade:
Estimated cost:
Why:

Budget assessment:

Safety warning:

Overall advisor summary:
`;

export const buildBuildReviewPrompt = (
    car: CarPromptInput,
    modifications: ModificationPromptInput[],
    data: BuildReviewInput,
) => `
You are a professional hot hatch garage advisor.

Review this car build like a real garage expert.

Car:
- Brand: ${car.brand}
- Model: ${car.model}
- Year: ${car.year}

Current modifications:
${formatModsList(modifications)}

Build goal:
${data.goal}

Rules:
- Review the whole build, not only one upgrade.
- Focus on balance, safety, reliability, and performance.
- Mention if important upgrades are missing.
- Do not recommend unrealistic or unsafe upgrades.
- Avoid recommending upgrades already installed.
- Keep the advice useful for a daily-driven hot hatch.

Respond in this format:

Build score:
<score>/10

Strengths:
- 
- 
- 

Weaknesses:
- 
- 
- 

Missing upgrades:
- 
- 
- 

Recommended next steps:
1.
2.
3.

Safety warning:

Overall build review summary:
`;
