const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
  authenticated?: boolean
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getToken(): string | null {
    return localStorage.getItem('zonal_token')
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, authenticated = true } = options

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    }

    if (authenticated) {
      const token = this.getToken()
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }))
      throw new ApiError(errorData.error || `Erreur ${response.status}`, response.status)
    }

    return response.json() as Promise<T>
  }

  get<T>(path: string, authenticated = true): Promise<T> {
    return this.request<T>(path, { method: 'GET', authenticated })
  }

  post<T>(path: string, body?: unknown, authenticated = true): Promise<T> {
    return this.request<T>(path, { method: 'POST', body, authenticated })
  }

  put<T>(path: string, body?: unknown, authenticated = true): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body, authenticated })
  }

  delete<T>(path: string, authenticated = true): Promise<T> {
    return this.request<T>(path, { method: 'DELETE', authenticated })
  }

  patch<T>(path: string, body?: unknown, authenticated = true): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body, authenticated })
  }

  async upload<T>(path: string, formData: FormData, authenticated = true): Promise<T> {
    const headers: Record<string, string> = {}

    if (authenticated) {
      const token = this.getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erreur serveur' }))
      throw new ApiError(errorData.error || `Erreur ${response.status}`, response.status)
    }

    return response.json() as Promise<T>
  }
}

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const api = new ApiService(API_BASE_URL)
export { ApiError }
export type { RequestOptions }
