export type ModificationCategory =
    | 'performance'
    | 'suspension'
    | 'brakes'
    | 'wheels'
    | 'exterior'
    | 'interior'
    | 'maintenance'
    | 'other';

export type ModificationStatus =
    | 'planned'
    | 'ordered'
    | 'installed'
    | 'removed';

export type Modification = {
    _id: string;
    car: string;
    title: string;
    description?: string;
    category: ModificationCategory;
    status: ModificationStatus;
    cost?: number;
    installedAt?: string;
    brand?: string;
    partNumber?: string;
    mileage?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateModificationInput = {
    title: string;
    description?: string;
    category: ModificationCategory;
    status?: ModificationStatus;
    cost?: number;
    installedAt?: string;
    brand?: string;
    partNumber?: string;
    mileage?: number;
    notes?: string;
};

export type UpdateModificationInput = Partial<CreateModificationInput>;
