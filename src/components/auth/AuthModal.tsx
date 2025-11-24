import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"
import { ForgotPasswordForm } from "./ForgotPasswordForm"
import type { User } from "@/lib/auth"

type AuthView = "login" | "register" | "forgot-password"

interface AuthModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (user: User) => void
    defaultView?: AuthView
}

export function AuthModal({ open, onOpenChange, onSuccess, defaultView = "login" }: AuthModalProps) {
    const [currentView, setCurrentView] = useState<AuthView>(defaultView)

    // Sync view when defaultView changes or modal opens
    useEffect(() => {
        if (open) {
            setCurrentView(defaultView)
        }
    }, [defaultView, open])

    const handleSuccess = (user: User) => {
        onSuccess(user)
        onOpenChange(false)
    }

    const handleRegisterSuccess = () => {
        // After successful registration, switch to login
        setCurrentView("login")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0">
                {currentView === "login" && (
                    <LoginForm
                        onSuccess={handleSuccess}
                        onSwitchToRegister={() => setCurrentView("register")}
                        onForgotPassword={() => setCurrentView("forgot-password")}
                    />
                )}

                {currentView === "register" && (
                    <RegisterForm
                        onSuccess={handleRegisterSuccess}
                        onSwitchToLogin={() => setCurrentView("login")}
                    />
                )}

                {currentView === "forgot-password" && (
                    <ForgotPasswordForm
                        onBack={() => setCurrentView("login")}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}
