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

// interfaces/Session.ts
export interface Profile {
    id: number;
    user_email: string;
    user_id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    personnummer: string;
    created_at: string;
    updated_at: string;
    image: string;
  }
  
  export interface Workplace {
    id: number;
    street: string;
    street_number: string;
    postal_code: string;
    city: string;
  }
  
  export interface Session {
    id: number;
    profile: Profile;
    workplace: Workplace;
    start_time: string;
    status: string;
  }

  export interface Employee {
    id: number;
    full_name: string;  // Format daty zależny od backendu, tutaj przyjęto string
    current_session_start_time: string;
    current_session_status: string;
    current_workplace: string;
    personnummer: number;
    user_email: string;
    image: string;
    work_session: WorkSession[];
  }

  export interface WorkSession {
    id: number;
    workplace: string;
    start_time: string;
    end_time: string;
    total_time: string;
  }
  
  