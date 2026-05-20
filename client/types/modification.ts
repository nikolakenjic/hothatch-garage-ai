export type Modification = {
    _id: string;
    car: string;
    name: string;
    category: string;
    price?: number;
    createdAt: string;
    updatedAt: string;
};

export type CreateModificationInput = {
    name: string;
    category: string;
    price?: number;
};
