export type Car = {
    _id: string;
    brand: string;
    model: string;
    year: number;
    user: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateCarInput = {
    brand: string;
    model: string;
    year: number;
};
