import {Request, Response} from 'express';

export const recommendCar = async (req: Request, res: Response) => {
    const {budget, fuel, use} = req.body;

    // MOCK response (no AI yet)
    const recommendation = `Based on your budget of ${budget}, I recommend a Volkswagen Golf GTD for ${use} use.`;

    res.status(200).json({
        message: 'Recommendation generated',
        recommendation,
    });
};
