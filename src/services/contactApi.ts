import api from "@/service/api";

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const contactApi = {
  async submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    const response = await api.post('/contact', data);
    return response.data.data; // Extract data from the response interceptor
  },
};
