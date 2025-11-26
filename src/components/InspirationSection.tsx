import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

interface InspirationExample {
    id: string
    title: string
    color: string
    logoUrl: string
    content: string
    description: string
}

const EXAMPLES: InspirationExample[] = [
    {
        id: "facebook",
        title: "Page Facebook",
        color: "#1877F2",
        logoUrl: "https://logo.clearbit.com/facebook.com",
        content: "https://facebook.com",
        description: "Augmentez vos likes"
    },
    {
        id: "youtube",
        title: "Chaîne YouTube",
        color: "#FF0000",
        logoUrl: "https://logo.clearbit.com/youtube.com",
        content: "https://youtube.com",
        description: "Gagnez des abonnés"
    },
    {
        id: "whatsapp",
        title: "Contact WhatsApp",
        color: "#25D366",
        logoUrl: "https://logo.clearbit.com/whatsapp.com",
        content: "https://whatsapp.com",
        description: "Facilitez le contact"
    },
    {
        id: "twitter",
        title: "Compte X",
        color: "#000000",
        logoUrl: "https://logo.clearbit.com/twitter.com",
        content: "https://twitter.com",
        description: "Partagez votre profil"
    }
]

export function InspirationSection() {
    const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQRCodes = async () => {
            const promises = EXAMPLES.map(async (example) => {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/v1/qrcode/generate`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            content: example.content,
                            color: example.color,
                            background: "#ffffff",
                            size: 300,
                            margin: 1,
                            format: "png",
                            error_correction: "H",
                            logo_url: example.logoUrl,
                            body_style: "square",
                            eye_style: "square",
                        }),
                    })

                    if (!response.ok) throw new Error("Failed to generate")

                    const blob = await response.blob()
                    return { id: example.id, url: URL.createObjectURL(blob) }
                } catch (err) {
                    console.error(`Failed to generate QR for ${example.id}`, err)
                    return null
                }
            })

            const results = await Promise.all(promises)
            const newQrCodes: Record<string, string> = {}

            results.forEach(result => {
                if (result) {
                    newQrCodes[result.id] = result.url
                }
            })

            setQrCodes(newQrCodes)
            setLoading(false)
        }

        fetchQRCodes()

        // Cleanup URLs on unmount
        return () => {
            Object.values(qrCodes).forEach(url => URL.revokeObjectURL(url))
        }
    }, [])

    return (
        <div className="mt-24 mb-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Exemples de réalisations</h2>
                <p className="text-slate-600 mt-4">Inspirez-vous de ces designs pour créer le vôtre.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {EXAMPLES.map((example) => (
                    <Card key={example.id} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group bg-white dark:bg-slate-900 overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2" style={{ color: example.color }}>
                                {example.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-4 pb-8">
                            <div className="relative w-48 h-48 bg-slate-50 rounded-xl p-2 mb-4 group-hover:scale-105 transition-transform duration-300">
                                {loading ? (
                                    <Skeleton className="w-full h-full rounded-lg" />
                                ) : qrCodes[example.id] ? (
                                    <img
                                        src={qrCodes[example.id]}
                                        alt={`QR Code ${example.title}`}
                                        className="w-full h-full object-contain rounded-lg shadow-sm"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 rounded-lg">
                                        Erreur
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 font-medium">{example.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
