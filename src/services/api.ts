// Client HTTP central utilisé par tous les services (services/*.ts) pour parler
// à l'API Symfony. Ajoute automatiquement le token JWT (Authorization: Bearer)
// et la langue courante (Accept-Language) à chaque requête, et normalise les
// erreurs serveur en ApiError.
import i18n from '../i18n/config'

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
      'Accept-Language': i18n.language,
      ...headers,
    }

    // authenticated=false pour les endpoints publics (login, contact, contenu
    // public...) qui n'ont pas besoin/pas encore de token
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

  // Upload de fichier : ne pas fixer Content-Type ici, le navigateur doit le
  // définir lui-même avec la bonne "boundary" multipart pour un FormData
  async upload<T>(path: string, formData: FormData, authenticated = true): Promise<T> {
    const headers: Record<string, string> = {
      'Accept-Language': i18n.language,
    }

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

// Erreur typée portant le code HTTP, pour permettre aux pages d'adapter leur
// message selon le status (ex: 409 = conflit, 403 = interdit...)
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
