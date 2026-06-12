import api from './config';

export interface FraudReport {
  id?: number;
  impostorDetails: string;
  contactInfo: string;
  comments: string;
  createdAt?: string;
}

export interface CreateFraudDto {
  impostorDetails: string;
  contactInfo: string;
  comments: string;
}

export const fraudService = {
  getAll: async (): Promise<FraudReport[]> => {
    const response = await api.get<FraudReport[]>('/fraud');
    return response.data;
  },

  create: async (data: CreateFraudDto): Promise<FraudReport> => {
    const response = await api.post<FraudReport>('/fraud', data);
    return response.data;
  },
};
