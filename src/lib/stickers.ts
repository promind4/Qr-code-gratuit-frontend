
export interface StickerConfig {
    id: string
    name: string
    description: string
    preview: string
    popular?: boolean
    // Positioning for frontend composition (percentages)
    qrPos: { top: number; left: number; width: number }
    aspectRatio: number // width/height of sticker
}

export const STICKERS: StickerConfig[] = [
    {
        id: "grid",
        name: "Quadrillé",
        description: "Motif quadrillé moderne",
        preview: "/stickers/grid.svg",
        popular: true,
        qrPos: { top: 17, left: 14, width: 72 },
        aspectRatio: 600 / 700
    },
    {
        id: "bubble",
        name: "Bulle",
        description: "Style message chat",
        preview: "/stickers/bubble.svg",
        popular: true,
        qrPos: { top: 17, left: 14, width: 72 },
        aspectRatio: 600 / 700
    },
    {
        id: "film",
        name: "Cinéma",
        description: "Clap de cinéma",
        preview: "/stickers/film.svg",
        qrPos: { top: 20, left: 14, width: 72 },
        aspectRatio: 600 / 700
    },
    {
        id: "book",
        name: "Livre",
        description: "Livre ouvert",
        preview: "/stickers/book.svg",
        qrPos: { top: 17, left: 55, width: 35 },
        aspectRatio: 1.4
    },
    {
        id: "beer",
        name: "Bière",
        description: "Pinte de bière",
        preview: "/stickers/beer.svg",
        qrPos: { top: 44, left: 33, width: 34 },
        aspectRatio: 0.8
    },
]
