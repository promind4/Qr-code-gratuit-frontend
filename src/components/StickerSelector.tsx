import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { STICKERS } from "@/lib/stickers"
import { useState } from "react"

interface StickerSelectorProps {
    selectedSticker: string | null
    onSelect: (stickerId: string | null) => void
}

export function StickerSelector({ selectedSticker, onSelect }: StickerSelectorProps) {
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

    const handleImageError = (id: string) => {
        setImageErrors(prev => ({ ...prev, [id]: true }))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">Autocollant "Scan Me"</Label>
                {selectedSticker && (
                    <button
                        onClick={() => onSelect(null)}
                        className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Retirer l'autocollant
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STICKERS.map((sticker) => {
                    const isSelected = selectedSticker === sticker.id
                    const hasError = imageErrors[sticker.id]

                    return (
                        <button
                            key={sticker.id}
                            onClick={() => onSelect(isSelected ? null : sticker.id)}
                            className={cn(
                                "relative group p-3 rounded-xl border-2 transition-all duration-200",
                                "hover:border-purple-300 hover:shadow-md hover:scale-105",
                                isSelected
                                    ? "border-purple-600 bg-purple-50 shadow-lg ring-2 ring-purple-200"
                                    : "border-slate-200 bg-white hover:bg-purple-50/50"
                            )}
                        >
                            {/* Preview */}
                            <div className="aspect-video bg-slate-50 rounded-lg mb-2 p-2 flex items-center justify-center overflow-hidden">
                                {hasError ? (
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <ImageOff className="h-6 w-6 mb-1" />
                                        <span className="text-[10px]">Image manquante</span>
                                    </div>
                                ) : (
                                    <img
                                        src={sticker.preview}
                                        alt={sticker.name}
                                        className="w-full h-full object-contain"
                                        onError={() => handleImageError(sticker.id)}
                                    />
                                )}
                            </div>

                            {/* Name and description */}
                            <div className="text-left">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <p className="text-sm font-semibold text-slate-900">{sticker.name}</p>
                                    {sticker.popular && (
                                        <Sparkles className="h-3 w-3 text-amber-500" />
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">{sticker.description}</p>
                            </div>

                            {/* Selected indicator */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1 shadow-md">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}

                            {/* Popular badge */}
                            {sticker.popular && !isSelected && (
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="text-xs py-0 px-1.5 bg-amber-100 text-amber-700 border-amber-200">
                                        Populaire
                                    </Badge>
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>

            {selectedSticker && (
                <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-700">
                        <strong>Info:</strong> L'autocollant sera appliqué sous votre QR Code lors du téléchargement.
                    </p>
                </div>
            )}
        </div>
    )
}
