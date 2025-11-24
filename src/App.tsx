import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import {
  Download, Link, Type, Mail, Palette, Settings, QrCode, Sparkles,
  FileText, Star, Phone, Upload, Image as ImageIcon, Shapes, Menu, Share2,
  Check, Copy, X, Info, LogOut, User as UserIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HelpPage } from "@/components/HelpPage"
import { Footer } from "@/components/Footer"
import { StickerSelector } from "@/components/StickerSelector"
import { AuthModal } from "@/components/auth/AuthModal"
import { getUser, logout, type User } from "@/lib/auth"
import { STICKERS } from "@/lib/stickers"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [content, setContent] = useState("https://example.com")
  const [color, setColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [size, setSize] = useState(500)
  const [margin, setMargin] = useState(1)
  const [format, setFormat] = useState("png")
  const [errorCorrection, setErrorCorrection] = useState("M")
  const [bodyStyle, setBodyStyle] = useState("square")
  const [eyeStyle, setEyeStyle] = useState("square")
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [showHelpPage, setShowHelpPage] = useState(false)
  const [authView, setAuthView] = useState<"login" | "register">("login")

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = getUser()
    if (savedUser) {
      setUser(savedUser)
    }
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Auto-generate when inputs change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        generateQRCode()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [content, color, bgColor, size, margin, format, errorCorrection, logoUrl, bodyStyle, eyeStyle, selectedSticker])

  const generateQRCode = async () => {
    if (!content) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/qrcode/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          color,
          background: bgColor,
          size,
          margin,
          // Always request PNG for preview if PDF is selected
          format: format === 'pdf' ? 'png' : format,
          error_correction: errorCorrection,
          logo_url: logoUrl,
          body_style: bodyStyle,
          eye_style: eyeStyle,
          sticker_type: selectedSticker,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to generate QR code")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setQrCodeUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      toast.error("Erreur de génération", { description: err instanceof Error ? err.message : "Une erreur est survenue" })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isLogo: boolean = false) => {
    const file = e.target.files?.[0]
    if (!file) return


    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/upload/`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      if (isLogo) {
        setLogoUrl(data.url)
        toast.success("Logo uploadé", { description: "Votre logo a été ajouté avec succès." })
      } else {
        setContent(data.url)
        toast.success("Fichier uploadé", { description: "Le fichier a été traité avec succès." })
      }
    } catch (err) {
      setError("Failed to upload file")
      toast.error("Erreur d'upload", { description: "Impossible d'uploader le fichier." })
    }
  }

  const handleDownload = async () => {
    if (!qrCodeUrl) return

    const downloadWithRetry = async (url: string, options: RequestInit = {}, retries = 2): Promise<Response> => {
      try {
        const response = await fetch(url, { ...options, signal: AbortSignal.timeout(30000) }) // 30s timeout
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        return response
      } catch (err) {
        if (retries > 0) {
          console.warn(`Download failed, retrying... (${retries} attempts left)`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          return downloadWithRetry(url, options, retries - 1)
        }
        throw err
      }
    }

    try {
      const extension = format === 'jpeg' ? 'jpg' : format
      const filename = `qrcode.${extension}`

      // Helper to download blob directly
      const downloadBlob = async (blobUrl: string, name: string) => {
        // Verify blob validity by fetching it
        const response = await fetch(blobUrl)
        if (!response.ok) throw new Error("Invalid blob URL")
        const blob = await response.blob()

        // Check for valid size (arbitrary small limit to detect empty files)
        if (blob.size < 100) throw new Error("File too small, possible corruption")

        const link = document.createElement("a")
        link.href = blobUrl
        link.download = name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      if (format === 'svg' && selectedSticker) {
        toast.warning("Le format SVG ne supporte pas les stickers", { description: "Le QR Code sera téléchargé sans sticker." })
      }

      // Special handling for PDF download
      if (format === 'pdf') {
        toast.info("Génération du PDF en cours...", { duration: 2000 })

        const response = await downloadWithRetry(`${API_BASE_URL}/api/v1/qrcode/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            color,
            background: bgColor,
            size,
            margin,
            format: 'pdf', // Explicitly request PDF
            error_correction: errorCorrection,
            logo_url: logoUrl,
            body_style: bodyStyle,
            eye_style: eyeStyle,
            sticker_type: selectedSticker,
          }),
        })

        const blob = await response.blob()
        if (blob.size < 100) throw new Error("PDF generated is too small")

        const pdfUrl = URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(pdfUrl)

        toast.success("Téléchargement lancé")
        return
      }

      await downloadBlob(qrCodeUrl, filename)
      toast.success("Téléchargement lancé")

    } catch (err) {
      console.error("Download error:", err)
      toast.error("Erreur de téléchargement", { description: "Impossible de télécharger le fichier. Veuillez réessayer." })
    }
  }

  const handleCopyLink = () => {
    if (qrCodeUrl) {
      navigator.clipboard.writeText(qrCodeUrl)
      toast.success("Lien copié", { description: "Le lien du QR Code a été copié dans le presse-papier." })
      setIsShareOpen(false)
    }
  }

  const handleShareFacebook = () => {
    if (qrCodeUrl) {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(qrCodeUrl)}`
      window.open(shareUrl, '_blank', 'width=600,height=400')
      toast.success("Partage Facebook", { description: "Ouverture de Facebook pour partager votre QR Code" })
    }
  }

  const handleShareLinkedIn = () => {
    if (qrCodeUrl) {
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(qrCodeUrl)}`
      window.open(shareUrl, '_blank', 'width=600,height=600')
      toast.success("Partage LinkedIn", { description: "Ouverture de LinkedIn pour partager votre QR Code" })
    }
  }

  const handleShareX = () => {
    if (qrCodeUrl) {
      const text = "Découvrez mon QR Code personnalisé !"
      const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(qrCodeUrl)}&text=${encodeURIComponent(text)}`
      window.open(shareUrl, '_blank', 'width=600,height=400')
      toast.success("Partage X", { description: "Ouverture de X pour partager votre QR Code" })
    }
  }

  const handleSharePinterest = () => {
    if (qrCodeUrl) {
      const description = "Mon QR Code personnalisé"
      const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(qrCodeUrl)}&description=${encodeURIComponent(description)}`
      window.open(shareUrl, '_blank', 'width=750,height=550')
      toast.success("Partage Pinterest", { description: "Ouverture de Pinterest pour partager votre QR Code" })
    }
  }

  const handleShareGmail = () => {
    if (qrCodeUrl) {
      const subject = "Mon QR Code personnalisé"
      const body = `Découvrez mon QR Code : ${qrCodeUrl}`
      const shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(shareUrl, '_blank', 'width=800,height=600')
      toast.success("Partage Gmail", { description: "Ouverture de Gmail" })
    }
  }

  const handleShareInstagram = async () => {
    if (qrCodeUrl) {
      // Instagram doesn't support web sharing API for direct posts
      // We'll use native share if available, or copy link
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Mon QR Code',
            text: 'Découvrez mon QR Code personnalisé !',
            url: qrCodeUrl,
          })
          toast.success("Partage réussi", { description: "QR Code partagé avec succès" })
        } catch (err) {
          if ((err as Error).name !== 'AbortError') {
            navigator.clipboard.writeText(qrCodeUrl)
            toast.info("Lien copié", { description: "Collez le lien dans votre story Instagram" })
          }
        }
      } else {
        navigator.clipboard.writeText(qrCodeUrl)
        toast.info("Lien copié", { description: "Collez le lien dans votre story Instagram" })
      }
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    setUser(null)
    toast.success("Déconnexion réussie", { description: "À bientôt !" })
  }

  // Handle auth success
  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser)
    toast.success("Connexion réussie", { description: `Bienvenue ${newUser.first_name} !` })
  }

  // Show Help Page if active
  if (showHelpPage) {
    return <HelpPage onClose={() => setShowHelpPage(false)} />
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      <Toaster />
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
              <QrCode className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              QR Code Gratuit
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {/* <NavigationMenuItem>
                  <NavigationMenuTrigger>Fonctionnalités</NavigationMenuTrigger>
                  <NavigationMenuContent className="max-w-full overflow-x-hidden right-0">
                    <ul className="grid gap-3 p-6 w-full md:w-[400px] lg:w-[min(500px,100%)] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-indigo-600 p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <QrCode className="h-6 w-6 text-white" />
                            <div className="mb-2 mt-4 text-lg font-medium text-white break-words overflow-hidden text-ellipsis">
                              Générateur Pro
                            </div>
                            <p className="text-sm leading-tight text-white/90 break-words overflow-hidden text-ellipsis">
                              Créez des QR codes uniques avec notre outil professionnel.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li className="col-span-1">
                        <NavigationMenuLink asChild>
                          <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                            <div className="text-sm font-medium leading-none">Personnalisation</div>
                            <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                              Couleurs, formes, logos et plus encore.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li className="col-span-1">
                        <NavigationMenuLink asChild>
                          <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
                            <div className="text-sm font-medium leading-none">Formats</div>
                            <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                              Export en PNG, JPEG, SVG et PDF.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem> */}
                <NavigationMenuItem>
                  <button
                    className={cn(navigationMenuTriggerStyle(), "cursor-pointer")}
                    onClick={() => setShowHelpPage(true)}
                  >
                    Aide
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth Buttons / User Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">{user.first_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.info("Profil", { description: "Fonctionnalité à venir" })}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Mes QR Codes", { description: "Fonctionnalité à venir" })}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Mes QR Codes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2">
                <Button variant="ghost" className="text-slate-600" onClick={() => { setAuthView("login"); setAuthModalOpen(true); }}>Connexion</Button>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all" onClick={() => { setAuthView("register"); setAuthModalOpen(true); }}>
                  S'inscrire
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Naviguez dans l'application
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <Button variant="ghost" className="justify-start">Fonctionnalités</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => setShowHelpPage(true)}>Aide</Button>
                  <Separator />
                  {user ? (
                    <>
                      <div className="px-2 py-2 text-sm">
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <Button variant="outline" className="justify-start text-red-600" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Se déconnecter
                      </Button>
                    </>
                  ) : (
                    <div className="hidden">
                      <Button variant="outline" className="justify-start" onClick={() => { setAuthView("login"); setAuthModalOpen(true); }}>Connexion</Button>
                      <Button className="justify-start" onClick={() => { setAuthView("register"); setAuthModalOpen(true); }}>S'inscrire</Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-white">
            Générez des QR Codes <span className="text-blue-600">Gratuit</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Créez, personnalisez et téléchargez vos QR codes en haute qualité. Gratuit, rapide et sans inscription.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Step 1: Content */}
          <Card className="h-full border-none shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/50 border-b border-blue-100/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 text-lg">1</div>
                <div>
                  <CardTitle className="text-blue-950 dark:text-blue-100 text-xl">Type de contenu</CardTitle>
                  <CardDescription className="text-blue-600/80 dark:text-blue-300/80 mt-1">
                    Choisissez ce que votre QR Code doit ouvrir
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <Tabs defaultValue="url" onValueChange={(v) => {
                if (v === 'url') setContent("https://example.com")
                else if (v === 'email') setContent("contact@example.com")
                else if (v === 'pdf') setContent("")
                else if (v === 'phone') setContent("tel:")
                else if (v === 'rating') setContent("")
                else setContent("Mon texte ici")
              }} className="w-full">
                <TabsList className="grid w-full grid-cols-3 gap-2 mb-8 p-1.5 bg-slate-100/80 dark:bg-slate-800 rounded-xl h-auto">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <TabsTrigger value="url" className="rounded-lg py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <Link className="h-4 w-4 mr-2" /> Site
                      </TabsTrigger>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Site Web (URL)</h4>
                          <p className="text-sm text-muted-foreground">
                            Redirige vers n'importe quelle page web. Idéal pour votre site vitrine, boutique ou portfolio.
                          </p>
                          <div className="flex items-center pt-2">
                            <Badge variant="secondary" className="text-xs">Populaire</Badge>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <TabsTrigger value="text" className="rounded-lg py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <Type className="h-4 w-4 mr-2" /> Texte
                      </TabsTrigger>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Texte Simple</h4>
                        <p className="text-sm text-muted-foreground">
                          Affiche un message texte brut sans connexion internet requise.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <TabsTrigger value="email" className="rounded-lg py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <Mail className="h-4 w-4 mr-2" /> Email
                      </TabsTrigger>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Email</h4>
                        <p className="text-sm text-muted-foreground">
                          Ouvre l'application de messagerie avec un destinataire pré-rempli.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <TabsTrigger value="pdf" className="rounded-lg py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <FileText className="h-4 w-4 mr-2" /> PDF
                      </TabsTrigger>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Fichier PDF</h4>
                        <p className="text-sm text-muted-foreground">
                          Hébergez et partagez vos documents PDF (menus, brochures, CV).
                        </p>
                        <div className="flex items-center pt-2">
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Nouveau</Badge>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <TabsTrigger value="rating" className="rounded-lg py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <Star className="h-4 w-4 mr-2" /> Avis
                      </TabsTrigger>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Avis & Notes</h4>
                        <p className="text-sm text-muted-foreground">
                          Encouragez vos clients à laisser un avis sur Google, TripAdvisor, etc.
                        </p>
                        <div className="flex items-center pt-2">
                          <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Recommandé</Badge>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <TabsTrigger value="phone" className="rounded-lg py-3 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <Phone className="h-4 w-4 mr-2" /> Tél
                      </TabsTrigger>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Téléphone</h4>
                        <p className="text-sm text-muted-foreground">
                          Compose automatiquement un numéro de téléphone lors du scan.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TabsList>

                <TabsContent value="url" className="space-y-4 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-3">
                    <Label htmlFor="url-input" className="text-base font-medium">URL du site web</Label>
                    <div className="relative">
                      <Link className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="url-input"
                        placeholder="https://www.exemple.com"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="h-12 pl-10 text-lg bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                    <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg flex items-start gap-2">
                      <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>Conseil : Assurez-vous que votre lien commence par https:// pour une meilleure sécurité.</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-3">
                    <Label htmlFor="text-input" className="text-base font-medium">Votre texte</Label>
                    <div className="relative">
                      <Type className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="text-input"
                        placeholder="Entrez votre texte..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="h-12 pl-10 text-lg bg-slate-50 border-slate-200 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-4 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-3">
                    <Label htmlFor="email-input" className="text-base font-medium">Email du destinataire</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="email-input"
                        type="email"
                        placeholder="contact@exemple.com"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="h-12 pl-10 text-lg bg-slate-50 border-slate-200 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pdf" className="space-y-4 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Fichier PDF</Label>
                    <div
                      className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 hover:bg-blue-50/50 hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 to-blue-100/0 group-hover:from-blue-100/20 group-hover:to-indigo-100/20 transition-all" />
                      <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-sm text-slate-700 font-semibold">Cliquez pour uploader un PDF</p>
                      <p className="text-xs text-slate-500 mt-1">Max 5MB • PDF uniquement</p>
                    </div>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e)}
                    />
                    {content && content.includes("/uploads/") && (
                      <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 border border-green-100 animate-in fade-in zoom-in-95">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">Fichier PDF prêt !</span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="rating" className="space-y-4 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-3">
                    <Label htmlFor="rating-input" className="text-base font-medium">Lien d'avis</Label>
                    <div className="relative">
                      <Star className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="rating-input"
                        placeholder="https://g.page/r/..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="h-12 pl-10 text-lg bg-slate-50 border-slate-200 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Collez le lien "Demander des avis" de votre fiche Google Business.</p>
                  </div>
                </TabsContent>

                <TabsContent value="phone" className="space-y-4 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-3">
                    <Label htmlFor="phone-input" className="text-base font-medium">Numéro de téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="phone-input"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={content.replace("tel:", "")}
                        onChange={(e) => setContent(`tel:${e.target.value}`)}
                        className="h-12 pl-10 text-lg bg-slate-50 border-slate-200 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Step 2: Customization */}
          <Card className="h-full border-none shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50/50 dark:from-slate-800 dark:to-slate-800/50 border-b border-purple-100/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/20 text-lg">2</div>
                <div>
                  <CardTitle className="text-purple-950 dark:text-purple-100 text-xl">Personnalisation</CardTitle>
                  <CardDescription className="text-purple-600/80 dark:text-purple-300/80 mt-1">
                    Rendez votre QR Code unique
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1">
              <Tabs defaultValue="style" className="w-full">
                <TabsList className="grid w-full grid-cols-3 gap-2 mb-8 p-1.5 bg-slate-100/80 dark:bg-slate-800 rounded-xl h-auto">
                  <TabsTrigger value="style" className="rounded-lg py-2.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all"><Palette className="h-4 w-4 mr-2" /> Style</TabsTrigger>
                  <TabsTrigger value="logo" className="rounded-lg py-2.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all"><ImageIcon className="h-4 w-4 mr-2" /> Logo</TabsTrigger>
                  <TabsTrigger value="settings" className="rounded-lg py-2.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all"><Settings className="h-4 w-4 mr-2" /> Options</TabsTrigger>
                </TabsList>

                <TabsContent value="style" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Accordion type="single" collapsible defaultValue="colors" className="w-full">
                    <AccordionItem value="colors" className="border-slate-200 dark:border-slate-800">
                      <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                          <Palette className="h-4 w-4 text-purple-600" />
                          <span>Couleurs</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-4 pb-2">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="color" className="text-xs font-medium text-slate-500 uppercase tracking-wider">Couleur principale</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal h-12 border-slate-200 hover:bg-slate-50"
                                >
                                  <div className="w-6 h-6 rounded-full mr-2 border border-slate-200 shadow-sm" style={{ backgroundColor: color }} />
                                  <span className="font-mono text-xs">{color}</span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-3">
                                <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                    {['#000000', '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'].map((c) => (
                                      <div
                                        key={c}
                                        className="w-8 h-8 rounded-full cursor-pointer border border-slate-200 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: c }}
                                        onClick={() => setColor(c)}
                                      />
                                    ))}
                                  </div>
                                  <Input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="h-10 w-full cursor-pointer"
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-3">
                            <Label htmlFor="bgColor" className="text-xs font-medium text-slate-500 uppercase tracking-wider">Arrière-plan</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal h-12 border-slate-200 hover:bg-slate-50"
                                >
                                  <div className="w-6 h-6 rounded-full mr-2 border border-slate-200 shadow-sm" style={{ backgroundColor: bgColor }} />
                                  <span className="font-mono text-xs">{bgColor}</span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-3">
                                <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                    {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#fee2e2', '#dbeafe'].map((c) => (
                                      <div
                                        key={c}
                                        className="w-8 h-8 rounded-full cursor-pointer border border-slate-200 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: c }}
                                        onClick={() => setBgColor(c)}
                                      />
                                    ))}
                                  </div>
                                  <Input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="h-10 w-full cursor-pointer"
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="shapes" className="border-slate-200 dark:border-slate-800 border-b-0">
                      <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                          <Shapes className="h-4 w-4 text-purple-600" />
                          <span>Formes</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-4 pb-2">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Points</Label>
                            <Select value={bodyStyle} onValueChange={setBodyStyle}>
                              <SelectTrigger className="h-12 border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="square">Carré (Classique)</SelectItem>
                                <SelectItem value="circle">Points</SelectItem>
                                <SelectItem value="rounded">Arrondi</SelectItem>
                                <SelectItem value="gapped">Espacé</SelectItem>
                                <SelectItem value="vertical">Barres Vert.</SelectItem>
                                <SelectItem value="horizontal">Barres Horiz.</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Coins</Label>
                            <Select value={eyeStyle} onValueChange={setEyeStyle}>
                              <SelectTrigger className="h-12 border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="square">Carré</SelectItem>
                                <SelectItem value="circle">Rond</SelectItem>
                                <SelectItem value="rounded">Arrondi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="stickers" className="hidden border-slate-200 dark:border-slate-800 border-b-0">
                      <AccordionTrigger className="hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                          <span>Autocollants</span>
                          {selectedSticker && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              1 sélectionné
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pt-4 pb-2">
                        <StickerSelector
                          selectedSticker={selectedSticker}
                          onSelect={setSelectedSticker}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                <TabsContent value="logo" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-4">
                    <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 mb-4">
                      <h3 className="text-sm font-semibold text-purple-900 flex items-center gap-2 mb-2">
                        <ImageIcon className="h-4 w-4" /> Logo personnalisé
                      </h3>
                      <p className="text-xs text-purple-700/80">Ajoutez votre logo au centre du QR Code pour renforcer votre image de marque.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          className="flex-1 h-14 border-dashed border-2 hover:border-purple-500 hover:bg-purple-50 transition-all group"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded-full group-hover:bg-white transition-colors">
                              <Upload className="h-4 w-4 text-slate-600 group-hover:text-purple-600" />
                            </div>
                            <span className="text-slate-600 group-hover:text-purple-700 font-medium">
                              {logoUrl ? "Changer le logo" : "Importer un fichier"}
                            </span>
                          </div>
                        </Button>
                        {logoUrl && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-14 w-14 shrink-0 shadow-sm hover:shadow-md transition-all"
                            onClick={() => setLogoUrl(null)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                      <Input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, true)}
                      />

                      {/* Predefined Logos */}
                      <div className="pt-4 border-t border-slate-100">
                        <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4 block">Logos populaires</Label>
                        <div className="flex gap-3 flex-wrap">
                          {[
                            { name: 'Instagram', domain: 'instagram.com' },
                            { name: 'Facebook', domain: 'facebook.com' },
                            { name: 'LinkedIn', domain: 'linkedin.com' },
                            { name: 'X (Twitter)', domain: 'twitter.com' },
                            { name: 'YouTube', domain: 'youtube.com' },
                            { name: 'TikTok', domain: 'tiktok.com' },
                            { name: 'Pinterest', domain: 'pinterest.com' },
                            { name: 'Apple', domain: 'apple.com' },
                            { name: 'Email', domain: 'gmail.com' }
                          ].map((item) => {
                            const itemUrl = `https://logo.clearbit.com/${item.domain}`
                            const isSelected = logoUrl === itemUrl

                            return (
                              <HoverCard key={item.domain} openDelay={200}>
                                <HoverCardTrigger asChild>
                                  <button
                                    onClick={() => setLogoUrl(itemUrl)}
                                    className={cn(
                                      "relative group p-2.5 rounded-xl border transition-all duration-300",
                                      isSelected
                                        ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200 shadow-md scale-105"
                                        : "border-slate-200 bg-white hover:border-purple-300 hover:shadow-md hover:-translate-y-0.5"
                                    )}
                                  >
                                    <Avatar className="h-8 w-8 rounded-none bg-transparent">
                                      <AvatarImage
                                        src={itemUrl}
                                        className="object-contain"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = `https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`;
                                        }}
                                      />
                                      <AvatarFallback className="bg-slate-100 text-[10px]">{item.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    {isSelected && (
                                      <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-0.5 shadow-sm">
                                        <Check className="h-3 w-3" />
                                      </div>
                                    )}
                                  </button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-auto p-2">
                                  <p className="text-xs font-medium">{item.name}</p>
                                </HoverCardContent>
                              </HoverCard>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-slate-700">Taille du QR Code</Label>
                            <Badge variant="outline" className="font-mono text-xs">{size}px</Badge>
                          </div>
                          <Slider
                            value={[size]}
                            onValueChange={(v) => setSize(v[0])}
                            min={100}
                            max={1000}
                            step={50}
                            className="py-2"
                          />
                        </div>
                        <Separator />
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium text-slate-700">Marge (Zone de silence)</Label>
                            <Badge variant="outline" className="font-mono text-xs">{margin}</Badge>
                          </div>
                          <Slider
                            value={[margin]}
                            onValueChange={(v) => setMargin(v[0])}
                            min={0}
                            max={20}
                            step={1}
                            className="py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">Niveau de correction d'erreur</Label>
                      <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                        <SelectTrigger className="h-12 border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">
                            <div className="flex flex-col">
                              <span className="font-medium">Faible (7%)</span>
                              <span className="text-xs text-muted-foreground">Idéal pour les QR simples</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="M">
                            <div className="flex flex-col">
                              <span className="font-medium">Moyenne (15%)</span>
                              <span className="text-xs text-muted-foreground">Standard recommandé</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Q">
                            <div className="flex flex-col">
                              <span className="font-medium">Haute (25%)</span>
                              <span className="text-xs text-muted-foreground">Pour QR avec logo</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="H">
                            <div className="flex flex-col">
                              <span className="font-medium">Maximale (30%)</span>
                              <span className="text-xs text-muted-foreground">Haute résistance aux dommages</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Step 3: Preview */}
          <Card className="h-full border-none shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col sticky top-24 ring-1 ring-slate-200 dark:ring-slate-800">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50/50 dark:from-slate-800 dark:to-slate-800/50 border-b border-emerald-100/50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 text-lg">3</div>
                <div>
                  <CardTitle className="text-emerald-950 dark:text-emerald-100 text-xl">Aperçu</CardTitle>
                  <CardDescription className="text-emerald-600/80 dark:text-emerald-300/80 mt-1">
                    Visualisez et téléchargez
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col items-center justify-center gap-8 min-h-[400px] bg-slate-50/50 dark:bg-slate-900/50">

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-transform duration-300 group-hover:scale-[1.02]">
                  {loading ? (
                    <div className="w-[250px] h-[250px] flex flex-col items-center justify-center gap-4">
                      <Skeleton className="h-[200px] w-[200px] rounded-xl" />
                      <div className="space-y-2 w-full px-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ) : qrCodeUrl ? (
                    selectedSticker ? (
                      (() => {
                        const stickerConfig = STICKERS.find(s => s.id === selectedSticker)
                        if (!stickerConfig) return <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto max-w-[280px] rounded-lg" />
                        return (
                          <div className="relative w-full max-w-[280px]" style={{ aspectRatio: `${stickerConfig.aspectRatio}` }}>
                            <img src={stickerConfig.preview} alt="Sticker" className="absolute inset-0 w-full h-full object-contain" />
                            <div className="absolute" style={{
                              top: `${stickerConfig.qrPos.top}%`,
                              left: `${stickerConfig.qrPos.left}%`,
                              width: `${stickerConfig.qrPos.width}%`,
                            }}>
                              <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto" />
                            </div>
                          </div>
                        )
                      })()
                    ) : (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code généré"
                        className="w-full h-auto max-w-[280px] rounded-lg"
                      />
                    )
                  ) : (
                    <div className="w-[250px] h-[250px] flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                      <QrCode className="h-12 w-12 mb-2 opacity-50" />
                      <span className="text-sm">Aperçu du QR Code</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full space-y-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                        onClick={handleDownload}
                        disabled={!qrCodeUrl || loading}
                      >
                        <Download className="mr-2 h-5 w-5" /> Télécharger
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Télécharger le QR Code en format {format.toUpperCase()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="grid grid-cols-2 gap-2">
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="h-10 bg-white border-slate-200">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (Image)</SelectItem>
                      <SelectItem value="jpeg">JPEG (Image)</SelectItem>
                      <SelectItem value="svg">SVG (Vectoriel)</SelectItem>
                      <SelectItem value="pdf">PDF (Document)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-10 bg-white hover:bg-slate-50 border-slate-200">
                        <Share2 className="h-4 w-4 mr-2" /> Partager
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Share2 className="h-5 w-5 text-blue-600" />
                          Partager le QR Code
                        </DialogTitle>
                        <DialogDescription>
                          Partagez votre QR Code sur vos réseaux sociaux préférés
                        </DialogDescription>
                      </DialogHeader>

                      {/* Copy Link Section */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="link" className="text-sm mb-2 block">
                            Lien du QR Code
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="link"
                              value={qrCodeUrl || ""}
                              readOnly
                              className="h-10 font-mono text-sm"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="px-3 shrink-0"
                              onClick={handleCopyLink}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        {/* Social Media Buttons */}
                        <div>
                          <Label className="text-sm mb-3 block">Partager sur les réseaux sociaux</Label>
                          <div className="grid grid-cols-3 gap-3">
                            {/* Facebook */}
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={handleShareFacebook}
                              className="flex-col h-auto py-4 hover:bg-blue-50 hover:border-blue-300 transition-all"
                              disabled={!qrCodeUrl}
                            >
                              <div className="bg-[#1877F2] text-white p-2.5 rounded-full mb-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                              </div>
                              <span className="text-xs font-medium">Facebook</span>
                            </Button>

                            {/* LinkedIn */}
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={handleShareLinkedIn}
                              className="flex-col h-auto py-4 hover:bg-blue-50 hover:border-blue-600 transition-all"
                              disabled={!qrCodeUrl}
                            >
                              <div className="bg-[#0A66C2] text-white p-2.5 rounded-full mb-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                              </div>
                              <span className="text-xs font-medium">LinkedIn</span>
                            </Button>

                            {/* X (Twitter) */}
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={handleShareX}
                              className="flex-col h-auto py-4 hover:bg-black hover:text-white hover:border-black transition-all"
                              disabled={!qrCodeUrl}
                            >
                              <div className="bg-black text-white p-2.5 rounded-full mb-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                              </div>
                              <span className="text-xs font-medium">X</span>
                            </Button>

                            {/* Pinterest */}
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={handleSharePinterest}
                              className="flex-col h-auto py-4 hover:bg-red-50 hover:border-red-400 transition-all"
                              disabled={!qrCodeUrl}
                            >
                              <div className="bg-[#E60023] text-white p-2.5 rounded-full mb-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                                </svg>
                              </div>
                              <span className="text-xs font-medium">Pinterest</span>
                            </Button>

                            {/* Gmail */}
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={handleShareGmail}
                              className="flex-col h-auto py-4 hover:bg-red-50 hover:border-red-400 transition-all"
                              disabled={!qrCodeUrl}
                            >
                              <div className="bg-[#EA4335] text-white p-2.5 rounded-full mb-2">
                                <Mail className="h-5 w-5" />
                              </div>
                              <span className="text-xs font-medium">Gmail</span>
                            </Button>

                            {/* Instagram */}
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={handleShareInstagram}
                              className="flex-col h-auto py-4 hover:bg-pink-50 hover:border-pink-400 transition-all"
                              disabled={!qrCodeUrl}
                            >
                              <div className="bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] text-white p-2.5 rounded-full mb-2">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                </svg>
                              </div>
                              <span className="text-xs font-medium">Instagram</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 w-full text-center animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-center gap-2">
                    <Info className="h-4 w-4" />
                    {error}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sommaire</h3>
              <nav className="space-y-2">
                <a href="#faq-definition" className="block text-slate-600 hover:text-blue-600 transition-colors text-sm">Qu'est-ce qu'un QR Code ?</a>
                <a href="#faq-security" className="block text-slate-600 hover:text-blue-600 transition-colors text-sm">Les QR Codes sont-ils sûrs ?</a>
                <a href="#faq-static-dynamic" className="block text-slate-600 hover:text-blue-600 transition-colors text-sm">Statique vs Dynamique</a>
                <a href="#faq-reviews" className="block text-slate-600 hover:text-blue-600 transition-colors text-sm">Pourquoi pour les avis ?</a>
                <a href="#faq-optimization" className="block text-slate-600 hover:text-blue-600 transition-colors text-sm">Optimiser le scan</a>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-12">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-8 text-slate-900">Questions Fréquentes</h2>

              <div id="faq-definition" className="scroll-mt-28">
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Qu'est-ce qu'un QR Code ?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Un QR Code (“Quick Response Code”) est un code-barres bidimensionnel que vous pouvez scanner avec votre smartphone. Il peut contenir des informations comme une URL, un texte, un email, un numéro de téléphone ou un lien direct vers vos pages d’avis. Par exemple, un restaurant peut créer un QR Code qui mène directement à son formulaire d’avis Google. Une fois scanné, l’utilisateur est redirigé automatiquement, simplifiant l’expérience et augmentant la probabilité qu’il laisse un retour.
                </p>
              </div>

              <div id="faq-security" className="scroll-mt-28">
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Les QR Codes sont-ils sûrs ?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Oui, mais la sécurité dépend de la source et du lien associé. Des QR Codes malveillants peuvent rediriger vers des sites frauduleux (“quishing”). Pour garantir la sécurité : utilisez des générateurs fiables, vérifiez l’URL avant de scanner, et évitez les QR Codes provenant de sources inconnues. Par exemple, un QR Code trouvé sur un flyer inconnu peut être risqué, alors qu’un QR Code généré par votre propre site est sûr.
                </p>
              </div>

              <div id="faq-static-dynamic" className="scroll-mt-28">
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Quelle est la différence entre un QR Code statique et un QR Code dynamique ?</h3>
                <div className="text-slate-600 leading-relaxed">
                  <p className="mb-2"><strong>Statique :</strong> le QR Code encode un lien fixe et ne peut pas être modifié après création. Idéal pour des informations permanentes comme l’URL d’un site web.</p>
                  <p><strong>Dynamique :</strong> le QR Code redirige vers un lien intermédiaire, ce qui permet de changer la destination même après sa création. Pratique pour mettre à jour vos pages d’avis ou rediriger les utilisateurs vers différentes plateformes sans générer un nouveau QR Code.</p>
                </div>
              </div>

              <div id="faq-reviews" className="scroll-mt-28">
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Pourquoi utiliser un QR Code pour les avis ?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Un QR Code simplifie la collecte d’avis clients. Plus besoin de taper manuellement l’URL de votre page d’avis. Par exemple, un café peut placer un QR Code sur chaque table : les clients scannent et accèdent directement au formulaire Google. Cela augmente le taux de réponse, améliore le référencement local (SEO) et renforce la crédibilité en ligne.
                </p>
              </div>

              <div id="faq-optimization" className="scroll-mt-28">
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Comment optimiser un QR Code pour qu’il soit facilement scanné ?</h3>
                <div className="text-slate-600 leading-relaxed">
                  <p className="mb-2">Pour maximiser la lisibilité :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Taille :</strong> minimum 2 × 2 cm pour les supports imprimés.</li>
                    <li><strong>Placement :</strong> zones bien éclairées et facilement accessibles.</li>
                    <li><strong>Design :</strong> éviter de surcharger le code avec des logos ou des formes trop complexes.</li>
                  </ul>
                  <p className="mt-2">Exemple : un QR Code placé sur l’enseigne d’un magasin à hauteur des yeux, avec un contraste élevé et un fond clair, sera scanné facilement par tous les visiteurs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer onNavigateToHelp={() => setShowHelpPage(true)} />

      {/* Authentication Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onSuccess={handleAuthSuccess}
        defaultView={authView}
      />
    </div>
  )
}

export default App
