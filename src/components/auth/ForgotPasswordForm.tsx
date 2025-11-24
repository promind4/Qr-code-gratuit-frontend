import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle2, ArrowLeft } from "lucide-react"
import { forgotPassword } from "@/lib/auth"

interface ForgotPasswordFormProps {
    onBack: () => void
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await forgotPassword(email)
            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="pt-8">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold">Email envoyé !</h3>
                        <p className="text-slate-600">
                            Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
                        </p>
                        <Button onClick={onBack} variant="outline" className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour à la connexion
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
                </div>
                <CardDescription>
                    Entrez votre email pour recevoir un lien de réinitialisation
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="jean.dupont@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Mail className="mr-2 h-4 w-4" />
                                Envoyer le lien
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
