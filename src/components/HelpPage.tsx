import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    BookOpen,
    Palette,
    UserCircle,
    Shield,
    ArrowLeft,
    HelpCircle,
    Sparkles,
    Heart,
    Smile,
    Meh,
    Frown,
    CheckCircle2,
} from "lucide-react"

interface HelpPageProps {
    onClose: () => void
}

export function HelpPage({ onClose }: HelpPageProps) {
    const [feedback, setFeedback] = useState<'sad' | 'neutral' | 'happy' | null>(null)

    const handleFeedback = (value: 'sad' | 'neutral' | 'happy') => {
        setFeedback(value)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
                            <HelpCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Centre d'aide</h1>
                            <p className="text-xs text-slate-500">Tout ce que vous devez savoir</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Introduction */}
                <div className="text-center mb-12 space-y-4">
                    <Badge variant="outline" className="mb-4">
                        <Sparkles className="h-3 w-3 mr-1" /> Guide complet
                    </Badge>
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                        Comment pouvons-nous vous aider ?
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Découvrez tout ce que vous devez savoir sur les QR Codes, leur personnalisation et l'utilisation de notre plateforme.
                    </p>
                </div>

                {/* Section 1: Guide sur les QR Codes */}
                <Card className="mb-8 border-none shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 text-white p-2 rounded-lg">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Guide sur les QR Codes</CardTitle>
                                <CardDescription>Comprendre les bases des codes QR</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="faq-what-is-qr" id="faq-what-is-qr">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Qu'est-ce qu'un QR Code ? Définition et Fonctionnement
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Un <strong>QR Code</strong> (Quick Response Code) est un code-barres bidimensionnel qui peut être scanné à l'aide d'un smartphone ou d'une tablette. Inventé en 1994 par l'entreprise japonaise Denso Wave, il permet de stocker une grande quantité d'informations (texte, URL, coordonnées, etc.) dans un espace réduit. Les QR Codes sont devenus essentiels pour partager rapidement des informations sans avoir à les saisir manuellement.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-static-vs-dynamic" id="faq-static-vs-dynamic">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    QR Code Statique vs Dynamique : Quelle différence ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">QR Code Statique :</strong> L'information est encodée directement dans le code. Une fois généré, le contenu ne peut pas être modifié. Idéal pour des informations permanentes (carte de visite, menu, etc.).
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">QR Code Dynamique :</strong> Le QR Code contient un lien court qui redirige vers une URL modifiable. Vous pouvez changer la destination sans regénérer le code. Il permet également de suivre les statistiques de scan (nombre de scans, localisation, appareil utilisé).
                                    </div>
                                    <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-lg mt-2">
                                        <strong>Notre plateforme</strong> génère des QR Codes statiques, parfaits pour une utilisation simple et gratuite.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-qr-uses" id="faq-qr-uses">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    À quoi sert un QR Code ? Exemples d'utilisation
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Les QR Codes ont de multiples usages :
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li><strong>Marketing :</strong> Rediriger vers un site web, une page de promotion ou un formulaire</li>
                                        <li><strong>Restauration :</strong> Afficher des menus numériques</li>
                                        <li><strong>Événements :</strong> Billets électroniques, invitations</li>
                                        <li><strong>Réseaux sociaux :</strong> Lien direct vers vos profils Instagram, LinkedIn, Facebook</li>
                                        <li><strong>Avis clients :</strong> Redirection vers Google Reviews, TripAdvisor</li>
                                        <li><strong>Contact :</strong> Partager vos coordonnées (téléphone, email, adresse)</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-content-types" id="faq-content-types">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Quel type de contenu partager avec un QR Code ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Notre générateur de QR Code vous permet de créer des codes pour :
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li><strong>URL :</strong> Liens vers des sites web, pages de produits, portfolios</li>
                                        <li><strong>Texte simple :</strong> Messages, citations, informations</li>
                                        <li><strong>Email :</strong> Adresse email pré-remplie pour faciliter le contact</li>
                                        <li><strong>Téléphone :</strong> Numéro de téléphone pour appel direct</li>
                                        <li><strong>Fichiers PDF :</strong> Documents, menus, brochures (après upload)</li>
                                        <li><strong>Avis :</strong> Liens vers vos pages d'évaluation (Google, TripAdvisor, etc.)</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Comment fonctionne le scan d'un QR Code ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
                                    <div>
                                        Le scan d'un QR Code est très simple et ne nécessite aucune application tierce sur la plupart des smartphones modernes :
                                    </div>
                                    <ol className="list-decimal list-inside space-y-2 ml-4">
                                        <li><strong>Ouvrez l'appareil photo</strong> de votre smartphone (iOS ou Android)</li>
                                        <li><strong>Pointez l'appareil</strong> vers le QR Code</li>
                                        <li><strong>Une notification apparaît</strong> automatiquement en haut de l'écran</li>
                                        <li><strong>Cliquez sur la notification</strong> pour accéder au contenu</li>
                                    </ol>
                                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mt-2">
                                        <strong>Astuce :</strong> Si votre appareil ne détecte pas automatiquement le QR Code, téléchargez une application gratuite de lecture de QR Code depuis votre magasin d'applications.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-6">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Peut-on suivre combien de personnes ont scanné un QR Code ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Les <strong>QR Codes statiques</strong> (comme ceux générés sur notre plateforme) ne permettent pas de suivre les statistiques de scan. L'information est encodée directement dans le code, sans passer par un serveur intermédiaire.
                                    <div className="mt-3">
                                        Pour suivre les statistiques (nombre de scans, localisation, appareil, date), vous devez utiliser un <strong>QR Code dynamique</strong> via un service payant qui redirige vers une URL modifiable et collecte les données analytiques.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-instagram" id="faq-instagram">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Comment créer un QR Code pour Instagram ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
                                    <div>
                                        Créer un QR Code pour votre profil Instagram est très simple et permet à vos followers de vous retrouver instantanément :
                                    </div>
                                    <ol className="list-decimal list-inside space-y-2 ml-4">
                                        <li>Copiez l'URL de votre profil Instagram (exemple: https://instagram.com/votre_nom)</li>
                                        <li>Collez-la dans l'onglet <strong>"URL"</strong> du générateur</li>
                                        <li>Ajoutez le logo Instagram depuis l'onglet <strong>"Logo"</strong> pour le rendre reconnaissable</li>
                                        <li>Personnalisez les couleurs (rose/violet pour rappeler Instagram)</li>
                                        <li>Téléchargez et partagez votre QR Code</li>
                                    </ol>
                                    <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg mt-2">
                                        <strong>Astuce :</strong> Utilisez ce QR Code sur vos cartes de visite, flyers, ou emballages de produits pour augmenter votre nombre de followers.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-facebook" id="faq-facebook">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Générer un QR Code pour une page Facebook
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
                                    <div>
                                        Un QR Code Facebook facilite l'accès à votre page ou profil professionnel :
                                    </div>
                                    <ol className="list-decimal list-inside space-y-2 ml-4">
                                        <li>Récupérez l'URL de votre page Facebook (exemple: https://facebook.com/votre_page)</li>
                                        <li>Entrez cette URL dans notre générateur</li>
                                        <li>Sélectionnez le logo Facebook dans la galerie de logos populaires</li>
                                        <li>Appliquez les couleurs de votre marque ou le bleu Facebook (#1877F2)</li>
                                        <li>Générez et téléchargez votre QR Code</li>
                                    </ol>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-2">
                                        <strong>Usage recommandé :</strong> Parfait pour les événements, points de vente, ou supports marketing pour augmenter vos j'aime et votre engagement.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-linkedin" id="faq-linkedin">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Créer un QR Code pour votre profil LinkedIn
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
                                    <div>
                                        Un QR Code LinkedIn est idéal pour le networking professionnel et les conférences :
                                    </div>
                                    <ol className="list-decimal list-inside space-y-2 ml-4">
                                        <li>Copiez l'URL de votre profil LinkedIn (exemple: https://linkedin.com/in/votre-nom)</li>
                                        <li>Collez-la dans le champ URL de notre générateur</li>
                                        <li>Ajoutez le logo LinkedIn pour une reconnaissance immédiate</li>
                                        <li>Choisissez des couleurs professionnelles (bleu LinkedIn #0A66C2)</li>
                                        <li>Téléchargez au format PNG pour impression haute qualité</li>
                                    </ol>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-2">
                                        <strong>Pro tip :</strong> Ajoutez ce QR Code à votre CV, signature email, ou badge de conférence pour faciliter les connexions professionnelles.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Section 2: Personnalisation du QR Code */}
                <Card className="mb-8 border-none shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-600 text-white p-2 rounded-lg">
                                <Palette className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Personnalisation du QR Code</CardTitle>
                                <CardDescription>Rendez votre QR Code unique</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="faq-customize-design" id="faq-customize-design">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Comment personnaliser les couleurs et la forme d'un QR Code ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
                                    <div>
                                        Notre générateur vous permet de personnaliser entièrement les couleurs de votre QR Code :
                                    </div>
                                    <ol className="list-decimal list-inside space-y-2 ml-4">
                                        <li>Accédez à l'onglet <strong>"Style"</strong> dans la section Personnalisation</li>
                                        <li>Cliquez sur <strong>"Couleurs"</strong> dans l'accordéon</li>
                                        <li>Choisissez votre <strong>couleur principale</strong> (par défaut noir) en cliquant sur le bouton de couleur</li>
                                        <li>Sélectionnez une couleur de <strong>fond</strong> (par défaut blanc)</li>
                                        <li>Utilisez les palettes pré-définies ou le sélecteur de couleur personnalisé</li>
                                    </ol>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mt-2">
                                        <strong>Important :</strong> Assurez-vous d'un bon contraste entre la couleur principale et le fond pour garantir la lisibilité du QR Code par les scanners.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-add-logo" id="faq-add-logo">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Peut-on ajouter un logo au centre d'un QR Code ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
                                    <div>
                                        Oui ! Ajouter un logo renforce votre image de marque et rend votre QR Code plus reconnaissable :
                                    </div>
                                    <ol className="list-decimal list-inside space-y-2 ml-4">
                                        <li>Allez dans l'onglet <strong>"Logo"</strong> de la section Personnalisation</li>
                                        <li><strong>Option 1 :</strong> Cliquez sur "Importer un fichier" pour uploader votre propre logo</li>
                                        <li><strong>Option 2 :</strong> Choisissez un logo populaire parmi Instagram, Facebook, LinkedIn, etc.</li>
                                        <li>Le logo sera automatiquement redimensionné et centré dans le QR Code</li>
                                    </ol>
                                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mt-2">
                                        <strong>Astuce :</strong> Utilisez un niveau de correction d'erreur "Haute (25%)" ou "Maximale (30%)" dans les Options pour garantir que le QR Code reste scannable malgré la présence du logo.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="custom-3">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Quels formats de logos sont acceptés ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Notre plateforme accepte tous les formats d'images standards :
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li><strong>PNG</strong> (recommandé pour les logos avec transparence)</li>
                                        <li><strong>JPEG / JPG</strong></li>
                                        <li><strong>SVG</strong> (format vectoriel, idéal pour la qualité)</li>
                                        <li><strong>WebP</strong></li>
                                    </ul>
                                    <div className="mt-3">
                                        <strong>Taille recommandée :</strong> Nous recommandons des logos carrés d'au moins 200x200 pixels pour une qualité optimale. Le système redimensionnera automatiquement votre logo pour qu'il occupe environ 20% de la surface du QR Code.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="custom-4">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Puis-je modifier les bords ou la forme des QR Codes ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
                                    <div>
                                        Absolument ! Notre générateur propose plusieurs styles de design :
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Forme des points :</strong>
                                        <ul className="list-disc list-inside mt-1 space-y-1 ml-4">
                                            <li><strong>Carré (Classique) :</strong> Style traditionnel</li>
                                            <li><strong>Points :</strong> Points circulaires pour un look moderne</li>
                                            <li><strong>Arrondi :</strong> Coins arrondis pour un style doux</li>
                                            <li><strong>Espacé :</strong> Points avec espacement pour un effet aéré</li>
                                            <li><strong>Barres Verticales / Horizontales :</strong> Design unique</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Forme des coins :</strong>
                                        <ul className="list-disc list-inside mt-1 space-y-1 ml-4">
                                            <li><strong>Carré :</strong> Coins carrés classiques</li>
                                            <li><strong>Rond :</strong> Coins entièrement arrondis</li>
                                            <li><strong>Arrondi :</strong> Coins légèrement arrondis</li>
                                        </ul>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-make-it-unique" id="faq-make-it-unique">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Comment rendre mon QR Code unique et reconnaissable ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Voici nos meilleures pratiques pour créer un QR Code mémorable :
                                    <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
                                        <li><strong>Utilisez vos couleurs de marque :</strong> Appliquez les couleurs de votre entreprise pour renforcer votre identité visuelle</li>
                                        <li><strong>Ajoutez votre logo :</strong> Placez votre logo au centre pour une reconnaissance immédiate</li>
                                        <li><strong>Choisissez un style original :</strong> Testez différentes combinaisons de formes (points arrondis, coins ronds)</li>
                                        <li><strong>Jouez avec les contrastes :</strong> Un bon contraste assure la lisibilité tout en créant un impact visuel</li>
                                        <li><strong>Téléchargez en haute qualité :</strong> Sélectionnez une taille de 500px minimum pour l'impression</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Section 3: Gestion du compte */}
                <Card className="hidden mb-8 border-none shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-600 text-white p-2 rounded-lg">
                                <UserCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Gestion du compte</CardTitle>
                                <CardDescription>Tout sur votre compte utilisateur</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="account-1">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Comment créer un compte ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Actuellement, notre plateforme fonctionne <strong>sans inscription obligatoire</strong>. Vous pouvez générer gratuitement autant de QR Codes que vous le souhaitez sans créer de compte.
                                    <div className="mt-3">
                                        La fonctionnalité de création de compte est en cours de développement. Elle vous permettra à l'avenir de :
                                    </div>
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li>Sauvegarder vos QR Codes générés</li>
                                        <li>Accéder à un historique de vos créations</li>
                                        <li>Gérer vos designs favoris</li>
                                        <li>Recevoir des notifications de nouvelles fonctionnalités</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="account-2">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Puis-je me connecter avec Gmail ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    La connexion OAuth (Gmail, Google, Facebook) est prévue dans une future mise à jour. Cette fonctionnalité vous permettra de vous connecter rapidement et en toute sécurité avec vos comptes existants, sans avoir à créer un nouveau mot de passe.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="account-3">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Que faire si j'oublie mon mot de passe ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Une fois le système de compte activé, vous disposerez d'une option "Mot de passe oublié" sur la page de connexion. Vous recevrez un email avec un lien sécurisé pour réinitialiser votre mot de passe.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="account-4">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Comment modifier mes informations personnelles ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Une fois connecté, vous pourrez accéder à une page "Profil" ou "Paramètres" pour modifier :
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li>Votre nom et prénom</li>
                                        <li>Votre adresse email</li>
                                        <li>Votre mot de passe</li>
                                        <li>Vos préférences de notification</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="account-5">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Comment supprimer mon compte si nécessaire ?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Dans vos paramètres de compte, une option "Supprimer mon compte" sera disponible. La suppression est définitive et entraînera la perte de :
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li>Tous vos QR Codes sauvegardés</li>
                                        <li>Votre historique de génération</li>
                                        <li>Vos paramètres personnalisés</li>
                                    </ul>
                                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mt-3">
                                        <strong>Attention :</strong> Cette action est irréversible. Nous vous recommandons de télécharger vos QR Codes importants avant de supprimer votre compte.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Section 4: Conditions générales */}
                <Card className="mb-12 border-none shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-700 text-white p-2 rounded-lg">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Conditions générales d'utilisation</CardTitle>
                                <CardDescription>Vos droits et responsabilités</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="terms-1">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Politique de confidentialité et protection des données
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Collecte de données :</strong> Notre plateforme respecte votre vie privée. Nous ne collectons aucune donnée personnelle lors de l'utilisation du générateur de QR Code. Les QR Codes sont générés localement ou sur notre serveur puis immédiatement supprimés.
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Fichiers uploadés :</strong> Les fichiers PDF ou images que vous uploadez sont stockés temporairement pour générer le QR Code, puis automatiquement supprimés après 24 heures.
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Cookies et Publicité :</strong> Nous utilisons des cookies techniques nécessaires au bon fonctionnement du site. En outre, nous faisons appel à des régies publicitaires tierces, notamment Google AdSense, pour diffuser des annonces lorsque vous visitez notre site Web. Ces entreprises peuvent utiliser des données relatives à votre navigation sur notre site Web ou d'autres sites (à l'exception de votre nom, adresse postale, adresse e-mail ou numéro de téléphone) afin de vous proposer des annonces de produits ou services adaptées à vos centres d'intérêt (Cookies publicitaires et de tracking).
                                    </div>
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Vos droits (RGPD) :</strong> Conformément à la réglementation européenne, vous avez la possibilité d'accepter ou de refuser ces cookies publicitaires lors de votre première visite via notre bannière de consentement, et de modifier ce choix à tout moment.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="terms-2">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Utilisation acceptable du service
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    En utilisant notre plateforme, vous vous engagez à :
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li>Ne pas générer de QR Codes contenant du contenu illégal, diffamatoire, ou offensant</li>
                                        <li>Ne pas utiliser le service pour du spam ou du phishing</li>
                                        <li>Respecter les droits d'auteur pour les logos et images que vous uploadez</li>
                                        <li>Ne pas tenter de surcharger ou de compromettre notre infrastructure</li>
                                    </ul>
                                    <div className="mt-3">
                                        Nous nous réservons le droit de suspendre l'accès à tout utilisateur ne respectant pas ces conditions.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="terms-3">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Droits de propriété intellectuelle
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    <div>
                                        <strong className="text-slate-900 dark:text-white">Vos QR Codes :</strong> Les QR Codes que vous générez vous appartiennent. Vous êtes libre de les utiliser à des fins personnelles ou commerciales sans limitation.
                                    </div>
                                    <div className="mt-3">
                                        <strong className="text-slate-900 dark:text-white">Notre plateforme :</strong> Le code source, le design et la marque de notre générateur de QR Code sont protégés par les lois sur la propriété intellectuelle. Toute reproduction ou modification non autorisée est interdite.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="terms-4">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Limitation de responsabilité
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Notre service est fourni "tel quel". Nous mettons tout en œuvre pour garantir :
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li>La disponibilité continue du service (99% du temps)</li>
                                        <li>La qualité des QR Codes générés</li>
                                        <li>La sécurité de vos données</li>
                                    </ul>
                                    <div className="mt-3">
                                        Toutefois, nous ne pouvons être tenus responsables de :
                                    </div>
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li>Interruptions temporaires du service pour maintenance</li>
                                        <li>Problèmes de scan dus à un mauvais contraste ou une impression de mauvaise qualité</li>
                                        <li>Pertes de données en cas de défaillance technique majeure</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="terms-5">
                                <AccordionTrigger className="text-left hover:no-underline">
                                    Modifications des conditions d'utilisation
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les changements importants seront notifiés via :
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li>Une bannière d'information sur le site</li>
                                        <li>Un email si vous avez un compte utilisateur</li>
                                    </ul>
                                    <div className="mt-3">
                                        L'utilisation continue du service après modification constitue votre acceptation des nouvelles conditions.
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                <Separator className="my-12" />

                {/* Feedback Section */}
                <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <CardContent className="p-8">
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-3 rounded-full">
                                    <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    Cette page vous a-t-elle été utile ?
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Votre avis nous aide à améliorer notre documentation
                                </p>
                            </div>

                            {feedback === null ? (
                                <div className="flex justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-auto px-6 py-4 flex-col gap-2 hover:bg-red-50 hover:border-red-300 transition-all"
                                        onClick={() => handleFeedback('sad')}
                                    >
                                        <Frown className="h-8 w-8 text-slate-400" />
                                        <span className="text-xs">Pas vraiment</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-auto px-6 py-4 flex-col gap-2 hover:bg-amber-50 hover:border-amber-300 transition-all"
                                        onClick={() => handleFeedback('neutral')}
                                    >
                                        <Meh className="h-8 w-8 text-slate-400" />
                                        <span className="text-xs">Moyennement</span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-auto px-6 py-4 flex-col gap-2 hover:bg-green-50 hover:border-green-300 transition-all"
                                        onClick={() => handleFeedback('happy')}
                                    >
                                        <Smile className="h-8 w-8 text-slate-400" />
                                        <span className="text-xs">Très utile</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                    <div className="flex justify-center">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            Merci pour votre retour !
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            {feedback === 'happy' && "Nous sommes ravis d'avoir pu vous aider !"}
                                            {feedback === 'neutral' && "Merci ! Nous travaillons à améliorer nos réponses."}
                                            {feedback === 'sad' && "Désolé de ne pas avoir répondu à vos attentes. N'hésitez pas à nous contacter pour plus d'aide."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-slate-500">
                    <p>Vous avez d'autres questions ? Contactez-nous à <a href="mailto:support@qrcode.com" className="text-blue-600 hover:underline">support@qrcode.com</a></p>
                </div>
            </div>
        </div>
    )
}
