// Authentication utilities for frontend

const API_URL = "http://127.0.0.1:8000/api/v1/auth"

export interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    email_verified: boolean
    oauth_provider: string | null
    created_at: string
}

export interface RegisterData {
    email: string
    first_name: string
    last_name: string
    password: string
}

export interface LoginData {
    email: string
    password: string
}

export interface TokenResponse {
    access_token: string
    token_type: string
}

// Local storage keys
const TOKEN_KEY = "qr_auth_token"
const USER_KEY = "qr_user"

// Store token in localStorage
export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
}

// Get token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
}

// Remove token from localStorage
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
}

// Store user in localStorage
export const setUser = (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Get user from localStorage
export const getUser = (): User | null => {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null
    try {
        return JSON.parse(userStr)
    } catch {
        return null
    }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getToken()
}

// Register new user
export const register = async (data: RegisterData): Promise<User> => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erreur lors de l'inscription")
    }

    return response.json()
}

// Login user
export const login = async (data: LoginData): Promise<{ token: string; user: User }> => {
    // First, get token
    const tokenResponse = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!tokenResponse.ok) {
        const error = await tokenResponse.json()
        throw new Error(error.detail || "Erreur lors de la connexion")
    }

    const { access_token } = await tokenResponse.json()

    // Then get user info
    const user = await getCurrentUser(access_token)

    return { token: access_token, user }
}

// Get current user from token
export const getCurrentUser = async (token?: string): Promise<User> => {
    const authToken = token || getToken()
    if (!authToken) {
        throw new Error("Pas de token d'authentification")
    }

    const response = await fetch(`${API_URL}/me?token=${authToken}`, {
        method: "GET",
    })

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'utilisateur")
    }

    return response.json()
}

// Logout user
export const logout = () => {
    removeToken()
}

// Request password reset
export const forgotPassword = async (email: string): Promise<void> => {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erreur lors de la demande de réinitialisation")
    }
}

// Reset password with token
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, new_password: newPassword }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Erreur lors de la réinitialisation du mot de passe")
    }
}
