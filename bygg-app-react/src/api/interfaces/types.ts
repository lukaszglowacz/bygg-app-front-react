export interface IProfileData {
    id: number;
    user_email: string;
    user_id: number; 
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

export interface IAddWorkPlaceData {
    street: string;
    street_number: string;
    postal_code: string;
    city: string;
}

export interface IWorkTimeData {
    id: number;
    user: number;
    user_first_name: string;
    user_last_name: string;
    user_personnummer: string;
    workplace: number;
    workplace_detail: string;
    start_time: string;
    end_time: string;
    total_time: string;
}

export interface IWorkTimesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IWorkTimeData[];
}

export interface Session {
    id: number;
    user: number;
    workplace: number;
    start_time: string;
    status: string;
    user_first_name: string;
    user_last_name: string;
    workplace_detail: string;
  }