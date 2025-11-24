import { QrCode, Instagram, Facebook, Linkedin, Shield, Lock } from "lucide-react"

interface FooterProps {
    onNavigateToHelp?: (section?: string) => void
}

export function Footer({ onNavigateToHelp }: FooterProps) {
    const handleSectionClick = (sectionId: string) => {
        if (onNavigateToHelp) {
            onNavigateToHelp()
            // Wait for page to load, then scroll to section
            setTimeout(() => {
                const element = document.getElementById(sectionId)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
            }, 300)
        }
    }

    return (
        <footer className="mt-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">

                    {/* Column 1: QR Code Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <QrCode className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold tracking-tight">QR Code</h3>
                        </div>
                        <nav className="space-y-3">
                            <button
                                onClick={() => handleSectionClick('qr-instagram')}
                                className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 w-full text-left"
                            >
                                <Instagram className="h-4 w-4 text-pink-400 group-hover:scale-110 transition-transform" />
                                <span className="group-hover:translate-x-1 transition-transform">Générateur QR Code Instagram</span>
                            </button>
                            <button
                                onClick={() => handleSectionClick('qr-facebook')}
                                className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 w-full text-left"
                            >
                                <Facebook className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                <span className="group-hover:translate-x-1 transition-transform">Générateur QR Code Facebook</span>
                            </button>
                            <button
                                onClick={() => handleSectionClick('qr-linkedin')}
                                className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 w-full text-left"
                            >
                                <Linkedin className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="group-hover:translate-x-1 transition-transform">Générateur QR Code LinkedIn</span>
                            </button>
                        </nav>
                    </div>

                    {/* Column 2: Support Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <Shield className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold tracking-tight">Support</h3>
                        </div>
                        <nav className="space-y-3">
                            <button
                                onClick={() => handleSectionClick('terms-1')}
                                className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 w-full text-left"
                            >
                                <Lock className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <span className="group-hover:translate-x-1 transition-transform">Politique de confidentialité</span>
                            </button>
                            <button
                                onClick={() => handleSectionClick('terms-2')}
                                className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-200 w-full text-left"
                            >
                                <Shield className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                                <span className="group-hover:translate-x-1 transition-transform">Termes et Conditions</span>
                            </button>
                        </nav>
                    </div>

                    {/* Column 3: About / CTA */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-3 tracking-tight">Générateur de QR Code</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Créez des QR Codes professionnels et personnalisés en quelques secondes. Gratuit, rapide, et sans inscription.
                            </p>
                        </div>
                        <div className="pt-4">
                            <p className="text-xs text-slate-500">
                                © {new Date().getFullYear()} QR Code Generator. Tous droits réservés.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-slate-700/50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                        <p>
                            Fait avec <span className="text-red-400 inline-block animate-pulse">❤</span> par les créateurs
                        </p>
                        <div className="flex gap-6">
                            <button
                                onClick={() => onNavigateToHelp?.()}
                                className="hover:text-white transition-colors"
                            >
                                Centre d'aide
                            </button>
                            <a href="mailto:support@qrcode.com" className="hover:text-white transition-colors">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
