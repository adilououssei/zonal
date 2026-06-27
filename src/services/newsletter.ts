import { api } from './api'

export interface SubscribeResponse {
  message: string
}

export async function subscribeToNewsletter(email: string, name?: string): Promise<SubscribeResponse> {
  return api.post<SubscribeResponse>('/api/newsletter/subscribe', { email, name }, false)
}
