
export interface Request {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    companySize: string;
    useCase: string | null;
    implementation: string | null;
    agentsCount: number | null;
    message: string | null;
    referralSource: string | null;
    createdAt: string;
    updatedAt: string;
    status: string;
}


export interface RequestCreateDto {
    firstName: string;
    lastName: string;
    email: string;
    companySize: string;
    useCase?: string;
    implementation?: string;
    agentsCount?: number;
    message?: string;
    referralSource?: string;
}


export interface RequestResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    companySize: string;
    useCase: string | null;
    implementation: string | null;
    agentsCount: number | null;
    message: string | null;
    referralSource: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}
