export interface IProfileData {
    id: number;
    user_email: string;
    first_name: string;
    last_name: string;
    personnummer: string;
    created_at: string;
    updated_at: string;
    image: string;
}

export interface IWorkPlacesData {
    id: number;
    street: string;
    street_number: string;
    postal_code: string;
    city: string;
}