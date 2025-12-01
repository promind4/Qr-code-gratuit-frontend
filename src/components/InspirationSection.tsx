import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InspirationExample {
    id: string
    title: string
    color: string
    imagePath: string
}

const EXAMPLES: InspirationExample[] = [
    {
        id: "facebook",
        title: "Page Facebook",
        color: "#1877F2",
        imagePath: "/images/qr-facebook.png"
    },
    {
        id: "youtube",
        title: "Chaîne YouTube",
        color: "#FF0000",
        imagePath: "/images/qr-youtube.png"
    },
    {
        id: "whatsapp",
        title: "Contact WhatsApp",
        color: "#25D366",
        imagePath: "/images/qr-whatsapp.png"
    },
    {
        id: "tiktok",
        title: "Compte TikTok",
        color: "#BE185D", // Pink/Purple for TikTok
        imagePath: "/images/qr-tiktok.png"
    }
]

export function InspirationSection() {
    return (
        <div className="mt-24 mb-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Exemples de réalisations</h2>
                <p className="text-slate-600 mt-4">Inspirez-vous de ces designs pour créer le vôtre.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {EXAMPLES.map((example) => (
                    <Card key={example.id} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group bg-white overflow-hidden">
                        <CardHeader className="pb-2 p-4">
                            <CardTitle className="text-base flex items-center gap-2 justify-center" style={{ color: example.color }}>
                                {example.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0 pb-4 p-4">
                            <div className="relative w-32 h-32 bg-slate-50 rounded-xl p-2 mb-2 group-hover:scale-105 transition-transform duration-300">
                                <img
                                    src={example.imagePath}
                                    alt={`QR Code ${example.title}`}
                                    className="w-full h-full object-contain rounded-lg shadow-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
