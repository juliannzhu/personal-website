import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import { Card } from '../components/ds/Card'
import { Tag } from '../components/ds/Tag'
import { Tetromino } from '../components/ds/Tetromino'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
type DetailLayout = 'bento' | 'marquee' | 'polaroid' | 'filmstrip'
type MediaSize = 'xl' | 'hero' | 'wide' | 'tall' | 'sm'
// `number` is the badge shown on the tile — defaults to array position, but can be
// pinned explicitly so photos can be reordered (grouped, moved to the front/back to
// square off the bottom edge, etc.) without relabeling every caption reference to it.
// `fit: 'contain'` shows the whole photo uncropped (letterboxed inside its tile) —
// default is 'cover', which fills the tile and crops to match its aspect ratio.
interface BentoPhoto { src: string; size?: MediaSize; caption?: string; number?: number; fit?: 'cover' | 'contain' }
interface QuestVideo { src: string; poster: string }

interface QuestCard {
  id: string
  piece: Piece
  title: string
  sub: string
  tags: string[]
  placeholder: string
  images: string[]
  // overrides images[0] as the tile thumbnail — lets the cover differ from whatever
  // photo happens to be first in the gallery/reel without reordering it (which would
  // shift polaroid #N badges away from matching filenames)
  cover?: string
  layout?: DetailLayout
  // only used when layout === 'bento' — numbered, size-tagged photos for the collage
  gallery?: BentoPhoto[]
  // clickable video clips shown below the main gallery, opened in a lightbox
  videos?: QuestVideo[]
  // filmstrip only — overrides images[0] as the big hero frame, with its own caption
  filmstripHero?: { src: string; caption?: string; fit?: 'cover' | 'contain' }
  // filmstrip only — extra large photos shown in a row between the hero and the reel,
  // excluded from the reel itself
  filmstripFeatures?: { src: string; caption?: string }[]
  // filmstrip only — captions for individual reel frames, keyed by image src
  filmstripReelCaptions?: Record<string, string>
  // marquee only — overrides the default column height (any valid CSS height value)
  marqueeHeight?: string
  // polaroid only — 'square' (default) crops every photo to a square print; 'native'
  // sizes each print to its own photo's aspect ratio so nothing gets cropped
  polaroidFit?: 'square' | 'native'
  // polaroid only — per-photo overrides (keyed by src) for the scattered layout:
  // `width` sizes an individual print bigger/smaller than the default, `col` pins it
  // to a specific column (0-indexed) instead of the automatic loose-grid placement
  polaroidOverrides?: Record<string, { width?: number; col?: number }>
}

// images live in /public/assets/quests/ — replace with your own photos any time
const Q = (id: string) => `/assets/quests/${id}`

// Video clips live alongside their folder's photos as <prefix>-video-N.m4v with a
// matching <prefix>-video-N-poster.jpg thumbnail (generated from the video's first frame).
const videosFor = (prefix: string, count: number): QuestVideo[] =>
  Array.from({ length: count }, (_, i) => ({
    src: Q(`${prefix}/${prefix}-video-${i + 1}.m4v`),
    poster: Q(`${prefix}/${prefix}-video-${i + 1}-poster.jpg`),
  }))

// numbered 1-43 to match the photo numbers so captions/sizes are easy to reassign later —
// 1 is the cover photo (volleyballcoverphoto), also used as the tile thumbnail
const VOLLEYBALL_GALLERY: BentoPhoto[] = [
  { src: Q('volleyball/volleyball-1.jpg'), size: 'hero', caption: 'Merivale High School Senior Girls Volleyball Team 2025' },
  { src: Q('volleyball/volleyball-2.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-3.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-4.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-5.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-6.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-7.jpg'), size: 'wide', caption: 'Team bonding after a beach tournament' },
  { src: Q('volleyball/volleyball-8.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-9.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-10.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-11.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-12.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-13.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-14.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-15.jpg'), size: 'wide', caption: "Waterloo SERVE All Women's Tournament 2026" },
  { src: Q('volleyball/volleyball-16.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-17.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-18.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-19.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-20.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-21.jpg'), size: 'tall' },
  { src: Q('volleyball/volleyball-22.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-23.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-24.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-25.jpg'), size: 'tall' },
  { src: Q('volleyball/volleyball-26.jpg'), size: 'hero', caption: 'Beach volleyball in Cuba' },
  { src: Q('volleyball/volleyball-27.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-28.jpg'), size: 'tall', caption: 'Marauders Cup Champions' },
  { src: Q('volleyball/volleyball-29.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-30.jpg'), size: 'hero', caption: '16U Fusion Volleyball Competitive Team' },
  { src: Q('volleyball/volleyball-31.jpg'), size: 'tall' },
  { src: Q('volleyball/volleyball-32.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-33.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-34.jpg'), size: 'hero', caption: 'Post win celebration' },
  { src: Q('volleyball/volleyball-35.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-36.jpg'), size: 'wide', caption: 'Marauders Cup 2026 Finalists' },
  { src: Q('volleyball/volleyball-37.jpg'), size: 'sm', caption: '4x Marauders Cup Champions' },
  { src: Q('volleyball/volleyball-38.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-39.jpg'), size: 'sm' },
  { src: Q('volleyball/volleyball-40.jpg'), size: 'tall', caption: 'STANK 2025' },
  { src: Q('volleyball/volleyball-41.jpg'), size: 'tall' },
  { src: Q('volleyball/volleyball-42.jpg'), size: 'hero' },
  { src: Q('volleyball/volleyball-43.jpg'), size: 'wide' },
  { src: Q('volleyball/volleyball-44.jpg'), size: 'wide', caption: 'Bomu Volleyball' },
  { src: Q('volleyball/volleyball-45.jpg'), size: 'wide', caption: 'Waterloo SERVE 3Peas Tournament 2026' },
]

// Photos 8, 10, 12, 16, 19 are the only ones allowed to crop — they're what keeps the
// bottom of the collage flat. Everything else uses `fit: 'contain'` so it's resized to
// fit its tile without cropping.
const ART_GALLERY: BentoPhoto[] = [
  { src: Q('art/art-1.jpg'), size: 'wide', number: 1, caption: 'IB English Poster', fit: 'contain' },
  { src: Q('art/art-2.jpg'), size: 'sm', number: 2, fit: 'contain' },
  { src: Q('art/art-3.jpg'), size: 'wide', number: 3, caption: 'Clay crafts', fit: 'contain' },
  { src: Q('art/art-4.jpg'), size: 'tall', number: 4, fit: 'contain' },
  { src: Q('art/art-9.jpg'), size: 'wide', number: 9, caption: 'Clay crafts after the oven', fit: 'contain' },
  { src: Q('art/art-5.jpg'), size: 'wide', number: 5, caption: 'Chinese New Year whiteboard art', fit: 'contain' },
  { src: Q('art/art-6.jpg'), size: 'sm', number: 6, fit: 'contain' },
  { src: Q('art/art-7.jpg'), size: 'tall', number: 7, fit: 'contain' },
  { src: Q('art/art-8.jpg'), size: 'sm', number: 8 },
  { src: Q('art/art-10.jpg'), size: 'tall', number: 10 },
  { src: Q('art/art-11.jpg'), size: 'hero', number: 11, fit: 'contain' },
  { src: Q('art/art-12.jpg'), size: 'tall', number: 12 },
  { src: Q('art/art-13.jpg'), size: 'tall', number: 13, fit: 'contain' },
  { src: Q('art/art-14.jpg'), size: 'wide', number: 14, fit: 'contain' },
  { src: Q('art/art-15.jpg'), size: 'wide', number: 15, caption: "Valentine's Day paper bouquet", fit: 'contain' },
  { src: Q('art/art-16.jpg'), size: 'tall', number: 16 },
  { src: Q('art/art-17.jpg'), size: 'wide', number: 17, fit: 'contain' },
  { src: Q('art/art-18.jpg'), size: 'sm', number: 18, fit: 'contain' },
  { src: Q('art/art-19.jpg'), size: 'wide', number: 19 },
]

// Sized so the 6-column grid fills exactly 3 rows with no leftover gaps:
// row 1-2 = hero(2x2) + tall(1x2) + tall(1x2) + wide(2x1) top / wide(2x1) bottom,
// row 3 = wide(2x1) + wide(2x1) + sm(1x1) + sm(1x1).
const BAKING_GALLERY: BentoPhoto[] = [
  { src: Q('baking/baking-2.jpg'), size: 'hero', number: 2 },
  { src: Q('baking/baking-3.jpg'), size: 'tall', number: 3, caption: 'Canada Day Brunch' },
  { src: Q('baking/baking-4.jpg'), size: 'tall', number: 4, caption: 'Post strawberry picking meal' },
  { src: Q('baking/baking-8.jpg'), size: 'wide', number: 8, caption: 'Baking cookies at Waterloo' },
  { src: Q('baking/baking-9.jpg'), size: 'wide', number: 9, caption: 'Embroidery crafts and cookies' },
  { src: Q('baking/baking-5.jpg'), size: 'wide', number: 5 },
  { src: Q('baking/baking-7.jpg'), size: 'wide', number: 7 },
  { src: Q('baking/baking-1.jpg'), size: 'sm', number: 1 },
  { src: Q('baking/baking-6.jpg'), size: 'sm', number: 6 },
]

const MODELLING_GALLERY: BentoPhoto[] = [
  { src: Q('modelling/modelling-1.jpg'), size: 'hero', number: 1, caption: "Birthday photoshoot in China 2025" },
  { src: Q('modelling/modelling-69.jpg'), size: 'hero', number: 69 },
  { src: Q('modelling/modelling-70.jpg'), size: 'tall', number: 70 },
  { src: Q('modelling/modelling-72.jpg'), size: 'hero', number: 72, fit: 'contain' },
  { src: Q('modelling/modelling-73.jpg'), size: 'tall', number: 73 },
  { src: Q('modelling/modelling-74.jpg'), size: 'hero', number: 74 },
  { src: Q('modelling/modelling-71.jpg'), size: 'tall', number: 71, fit: 'contain' },
  { src: Q('modelling/modelling-2.jpg'), size: 'hero', number: 2 },
  { src: Q('modelling/modelling-3.jpg'), size: 'tall', number: 3 },
  { src: Q('modelling/modelling-4.jpg'), size: 'hero', number: 4 },
  { src: Q('modelling/modelling-5.jpg'), size: 'tall', number: 5 },
  { src: Q('modelling/modelling-6.jpg'), size: 'hero', number: 6 },
  { src: Q('modelling/modelling-7.jpg'), size: 'tall', number: 7, fit: 'contain' },
  { src: Q('modelling/modelling-8.jpg'), size: 'tall', number: 8 },
  { src: Q('modelling/modelling-9.jpg'), size: 'tall', number: 9 },
  { src: Q('modelling/modelling-10.jpg'), size: 'tall', number: 10, fit: 'contain' },
  { src: Q('modelling/modelling-11.jpg'), size: 'hero', number: 11 },
  { src: Q('modelling/modelling-12.jpg'), size: 'hero', number: 12 },
  { src: Q('modelling/modelling-13.jpg'), size: 'tall', number: 13, fit: 'contain' },
  { src: Q('modelling/modelling-14.jpg'), size: 'tall', number: 14 },
  { src: Q('modelling/modelling-15.jpg'), size: 'hero', number: 15, fit: 'contain' },
  { src: Q('modelling/modelling-16.jpg'), size: 'tall', number: 16 },
  { src: Q('modelling/modelling-17.jpg'), size: 'wide', number: 17, fit: 'contain' },
  { src: Q('modelling/modelling-18.jpg'), size: 'wide', number: 18 },
  { src: Q('modelling/modelling-19.jpg'), size: 'wide', number: 19 },
  { src: Q('modelling/modelling-20.jpg'), size: 'hero', number: 20, caption: "Fashion for Change Photoshoot 2025" },
  { src: Q('modelling/modelling-21.jpg'), size: 'wide', number: 21 },
  { src: Q('modelling/modelling-22.jpg'), size: 'wide', number: 22 },
  { src: Q('modelling/modelling-23.jpg'), size: 'wide', number: 23 },
  { src: Q('modelling/modelling-24.jpg'), size: 'wide', number: 24, fit: 'contain' },
  { src: Q('modelling/modelling-25.jpg'), size: 'hero', number: 25, fit: 'contain' },
  { src: Q('modelling/modelling-26.jpg'), size: 'wide', number: 26, fit: 'contain' },
  { src: Q('modelling/modelling-27.jpg'), size: 'wide', number: 27, fit: 'contain' },
  { src: Q('modelling/modelling-28.jpg'), size: 'wide', number: 28, fit: 'contain' },
  { src: Q('modelling/modelling-29.jpg'), size: 'tall', number: 29, fit: 'contain' },
  { src: Q('modelling/modelling-30.jpg'), size: 'wide', number: 30 },
  { src: Q('modelling/modelling-31.jpg'), size: 'tall', number: 31 },
  { src: Q('modelling/modelling-75.jpg'), size: 'tall', number: 75, caption: "Japan House in Illinois" },
  { src: Q('modelling/modelling-32.jpg'), size: 'wide', number: 32 },
  { src: Q('modelling/modelling-33.jpg'), size: 'tall', number: 33 },
  { src: Q('modelling/modelling-34.jpg'), size: 'tall', number: 34 },
  { src: Q('modelling/modelling-35.jpg'), size: 'tall', number: 35 },
  { src: Q('modelling/modelling-37.jpg'), size: 'wide', number: 37 },
  { src: Q('modelling/modelling-38.jpg'), size: 'wide', number: 38 },
  { src: Q('modelling/modelling-39.jpg'), size: 'wide', number: 39 },
  { src: Q('modelling/modelling-40.jpg'), size: 'tall', number: 40 },
  { src: Q('modelling/modelling-41.jpg'), size: 'tall', number: 41 },
  { src: Q('modelling/modelling-42.jpg'), size: 'wide', number: 42 },
  { src: Q('modelling/modelling-43.jpg'), size: 'tall', number: 43 },
  { src: Q('modelling/modelling-44.jpg'), size: 'wide', number: 44, fit: 'contain' },
  { src: Q('modelling/modelling-45.jpg'), size: 'wide', number: 45 },
  { src: Q('modelling/modelling-47.jpg'), size: 'tall', number: 47 },
  { src: Q('modelling/modelling-48.jpg'), size: 'wide', number: 48 },
  { src: Q('modelling/modelling-49.jpg'), size: 'wide', number: 49, caption: "Prom photoshoot" },
  { src: Q('modelling/modelling-50.jpg'), size: 'hero', number: 50, caption: "The Louvre in Paris" },
  { src: Q('modelling/modelling-51.jpg'), size: 'tall', number: 51 },
  { src: Q('modelling/modelling-52.jpg'), size: 'tall', number: 52 },
  { src: Q('modelling/modelling-53.jpg'), size: 'tall', number: 53 },
  { src: Q('modelling/modelling-54.jpg'), size: 'tall', number: 54 },
  { src: Q('modelling/modelling-55.jpg'), size: 'wide', number: 55, fit: 'contain' },
  { src: Q('modelling/modelling-56.jpg'), size: 'wide', number: 56, fit: 'contain' },
  { src: Q('modelling/modelling-57.jpg'), size: 'tall', number: 57 },
  { src: Q('modelling/modelling-59.jpg'), size: 'wide', number: 59, fit: 'contain' },
  { src: Q('modelling/modelling-60.jpg'), size: 'hero', number: 60, caption: "China photoshoot makeup" },
  { src: Q('modelling/modelling-61.jpg'), size: 'tall', number: 61 },
  { src: Q('modelling/modelling-62.jpg'), size: 'tall', number: 62 },
  { src: Q('modelling/modelling-63.jpg'), size: 'wide', number: 63 },
  { src: Q('modelling/modelling-64.jpg'), size: 'tall', number: 64 },
  { src: Q('modelling/modelling-65.jpg'), size: 'wide', number: 65 },
  { src: Q('modelling/modelling-66.jpg'), size: 'tall', number: 66 },
  { src: Q('modelling/modelling-67.jpg'), size: 'tall', number: 67 },
  { src: Q('modelling/modelling-36.jpg'), size: 'sm', number: 36, caption: "Recreating poses in Paris" },
  { src: Q('modelling/modelling-46.jpg'), size: 'sm', number: 46 },
  { src: Q('modelling/modelling-58.jpg'), size: 'sm', number: 58 },
  { src: Q('modelling/modelling-68.jpg'), size: 'sm', number: 68 },
]


const ROBOTICS_GALLERY: BentoPhoto[] = [
  { src: Q('robotics/robotics-1.jpg'), size: 'hero', number: 1, caption: "DCMP 2025" },
  { src: Q('robotics/robotics-2.jpg'), size: 'wide', number: 2 },
  { src: Q('robotics/robotics-3.jpg'), size: 'hero', number: 3, caption: "Garage sale sign for good luck" },
  { src: Q('robotics/robotics-4.jpg'), size: 'wide', number: 4 },
  { src: Q('robotics/robotics-5.jpg'), size: 'hero', number: 5, caption: "Cheering on 8729" },
  { src: Q('robotics/robotics-6.jpg'), size: 'wide', number: 6 },
  { src: Q('robotics/robotics-7.jpg'), size: 'wide', number: 7, caption: "Spark Youth Robotics pins" },
  { src: Q('robotics/robotics-8.jpg'), size: 'wide', number: 8 },
  { src: Q('robotics/robotics-9.jpg'), size: 'tall', number: 9, caption: "Built the coral reef game pieces" },
  { src: Q('robotics/robotics-12.jpg'), size: 'wide', number: 12 },
  { src: Q('robotics/robotics-14.jpg'), size: 'wide', number: 14 },
  { src: Q('robotics/robotics-15.jpg'), size: 'wide', number: 15 },
  { src: Q('robotics/robotics-16.jpg'), size: 'wide', number: 16 },
  { src: Q('robotics/robotics-17.jpg'), size: 'hero', number: 17 },
  { src: Q('robotics/robotics-18.jpg'), size: 'hero', number: 18 },
  { src: Q('robotics/robotics-19.jpg'), size: 'hero', number: 19 },
  { src: Q('robotics/robotics-20.jpg'), size: 'hero', number: 20 },
  { src: Q('robotics/robotics-22.jpg'), size: 'wide', number: 22 },
  { src: Q('robotics/robotics-23.jpg'), size: 'tall', number: 23 },
  { src: Q('robotics/robotics-24.jpg'), size: 'wide', number: 24 },
  { src: Q('robotics/robotics-21.jpg'), size: 'sm', number: 21, caption: "KCSSC Demo 2024" },
  { src: Q('robotics/robotics-11.jpg'), size: 'sm', number: 11 },
  { src: Q('robotics/robotics-13.jpg'), size: 'wide', number: 13 },
  { src: Q('robotics/robotics-10.jpg'), size: 'wide', number: 10 },
]

const LEGO_GALLERY: BentoPhoto[] = [
  { src: Q('lego/lego-1.jpg'), size: 'wide' },
  { src: Q('lego/lego-2.jpg'), size: 'wide' },
  { src: Q('lego/lego-3.jpg'), size: 'wide' },
  { src: Q('lego/lego-4.jpg'), size: 'wide' },
  { src: Q('lego/lego-5.jpg'), size: 'wide' },
  { src: Q('lego/lego-6.jpg'), size: 'hero', caption: 'Hard at work building' },
  { src: Q('lego/lego-7.jpg'), size: 'wide', caption: 'Final Presentations' },
  { src: Q('lego/lego-8.jpg'), size: 'wide', caption: 'Our team' },
  { src: Q('lego/lego-9.jpg'), size: 'wide' },
  { src: Q('lego/lego-10.jpg'), size: 'wide' },
  { src: Q('lego/lego-11.jpg'), size: 'wide' },
]

const MUSIC_GALLERY: BentoPhoto[] = [
  { src: Q('music/music-2.jpg'), size: 'hero', number: 2 },
  { src: Q('music/music-1.jpg'), size: 'wide', number: 1 },
  { src: Q('music/music-3.jpg'), size: 'sm', number: 3 },
  { src: Q('music/music-4.jpg'), size: 'wide', number: 4, caption: 'Oscar Peterson statue in Ottawa' },
  { src: Q('music/music-5.jpg'), size: 'wide', number: 5, caption: 'Piano before prom' },
]

// Only photos 3, 4, 5 are allowed to crop — everything else is `fit: 'contain'`.
// Sizes fill the 6-column grid exactly flat over 3 rows: xl(3x2) + three tall(1x2)
// fill rows 1-2, two wide(2x1) + two sm(1x1) fill row 3.
const POOL_GALLERY: BentoPhoto[] = [
  { src: Q('pool/pool-6.jpg'), size: 'xl', number: 6, fit: 'contain' },
  { src: Q('pool/pool-1.jpg'), size: 'tall', number: 1, fit: 'contain' },
  { src: Q('pool/pool-2.jpg'), size: 'tall', number: 2, fit: 'contain' },
  { src: Q('pool/pool-7.jpg'), size: 'tall', number: 7, fit: 'contain' },
  { src: Q('pool/pool-3.jpg'), size: 'wide', number: 3 },
  { src: Q('pool/pool-4.jpg'), size: 'wide', number: 4 },
  { src: Q('pool/pool-5.jpg'), size: 'sm', number: 5 },
  { src: Q('pool/pool-8.jpg'), size: 'sm', number: 8, fit: 'contain' },
]

const QUESTS: QuestCard[] = [
  {
    id: 'volleyball',
    piece: 's',
    title: 'VOLLEYBALL',
    sub: 'Team Captain at Merivale HS (2021-2025). Led the team to NCSSAA Tier 1 finals, won 7 regional tournaments, 4 consecutive Marauders Cups, and MVP in 2021 and 2023.',
    tags: ['Team Captain', 'NCSSAA', 'MVP x2', 'Marauders Cup'],
    placeholder: '🏐',
    images: [VOLLEYBALL_GALLERY[0].src],
    layout: 'bento',
    gallery: VOLLEYBALL_GALLERY,
    videos: videosFor('volleyball', 4),
  },
  {
    id: 'music',
    piece: 'l',
    title: 'PIANO',
    sub: 'A different kind of keyboard layout than what most developers know. I recently completed my RCM Level 10 Certificate. 13 years of weekly lessons, 10 hours of practice per week, and 6 recitals annually.',
    tags: ['RCM Level 10', 'Classical', 'Technique', 'Ear Training'],
    placeholder: '🎹',
    images: [Q('music/music-5.jpg')],
    layout: 'bento',
    gallery: MUSIC_GALLERY,
    videos: videosFor('music', 7),
  },
  {
    id: 'pool',
    piece: 't',
    title: 'POOL',
    sub: 'Games of 8-ball whenever there is a table free. Still working on my bank shots.',
    tags: ['8-Ball', 'Cue Sports', 'Casual'],
    placeholder: '🎱',
    images: [Q('pool/pool-2.jpg')],
    layout: 'bento',
    gallery: POOL_GALLERY,
    videos: videosFor('pool', 1),
  },
  {
    id: 'baking',
    piece: 'l',
    title: 'BAKING',
    sub: 'Flour, sugar, and oven-baked experiments. A great way to relax and enjoy good food with others.',
    tags: ['Macarons', 'Cookies', 'Stress Relief'],
    placeholder: '🧁',
    images: [Q('baking/baking-3.jpg')],
    layout: 'bento',
    gallery: BAKING_GALLERY,
  },
  {
    id: 'art',
    piece: 's',
    title: 'ART',
    sub: 'CSS is great, but sometimes I need real arts and crafts. Here lies all the sketches, paints, and messy creative outlets.',
    tags: ['Pixel Art', 'UI/UX', 'Sketching'],
    placeholder: '🎨',
    images: [Q('art/art-11.jpg')],
    layout: 'bento',
    gallery: ART_GALLERY,
  },
  {
    id: 'travel',
    piece: 'i',
    title: 'TRAVELLING',
    sub: 'New cities, new food, new perspectives. Every trip comes back with way too many photos.',
    tags: ['Explore', 'Food', 'Photography'],
    placeholder: '✈️',
    images: Array.from({ length: 124 }, (_, i) => Q(`travel/travel-${i + 1}.jpg`)),
    layout: 'marquee',
    marqueeHeight: 'calc(100vh - 260px)',
  },
  {
    id: 'modelling',
    piece: 'z',
    title: 'MODELLING',
    sub: 'Posing, lighting, angles, mixed in with photos of myself that I just genuinely like. Most end up in my camera roll but some make it to Instagram.',
    tags: ['Photography', 'Portraits', 'Creative'],
    placeholder: '📸',
    images: [MODELLING_GALLERY[0].src],
    layout: 'bento',
    gallery: MODELLING_GALLERY,
  },
  {
    id: 'poker',
    piece: 'z',
    title: 'POKER',
    sub: 'Game theory, probability, and reading patterns under pressure.',
    tags: ['Strategy', 'Game Theory', "Texas Hold'em"],
    placeholder: '♠️',
    images: [Q('poker/poker-1.jpg'), Q('poker/poker-3.jpg'), Q('poker/poker-4.jpg'), Q('poker/poker-5.jpg'), Q('poker/poker-7.jpg')],
    cover: Q('poker/poker-6.jpg'),
    layout: 'filmstrip',
    filmstripHero: { src: Q('poker/poker-6.jpg'), caption: 'I was the pocket 10s' },
    filmstripFeatures: [
      { src: Q('poker/poker-8.jpg'), caption: 'University of Waterloo Poker Studies Club tournament' },
      { src: Q('poker/poker-2.jpg') },
    ],
    filmstripReelCaptions: { [Q('poker/poker-7.jpg')]: 'a huge run at Waterloo' },
    videos: videosFor('poker', 4),
  },
  {
    id: 'hackathons',
    piece: 'i',
    title: 'HACKATHONS',
    sub: 'Late nights, bad coffee, and building something from nothing in 24 hours flat.',
    tags: ['Devpost', 'Team Projects', 'Late Nights'],
    placeholder: '💻',
    images: Array.from({ length: 12 }, (_, i) => Q(`hackathons/hackathons-${i + 1}.jpg`)),
    cover: Q('hackathons/hackathons-10.jpg'),
    layout: 'polaroid',
    polaroidFit: 'native',
    // 11 pinned to the leftmost column so its height (it's an extreme 1:3 portrait
    // crop) reads as an edge accent instead of colliding with the rest of the scatter.
    polaroidOverrides: {
      [Q('hackathons/hackathons-1.jpg')]: { width: 257 },
      [Q('hackathons/hackathons-2.jpg')]: { width: 285 },
      [Q('hackathons/hackathons-4.jpg')]: { width: 216 },
      [Q('hackathons/hackathons-8.jpg')]: { width: 210 },
      [Q('hackathons/hackathons-9.jpg')]: { width: 248 },
      [Q('hackathons/hackathons-10.jpg')]: { width: 270 },
      [Q('hackathons/hackathons-11.jpg')]: { col: 0 },
    },
  },
  {
    id: 'people',
    piece: 'j',
    title: 'FRIENDS',
    sub: 'Quality time is my love language. My dog is a Shiba Inu named Pompom and he is a menace.',
    tags: ['Friends', 'Shiba Inu', 'Pompom', 'Quality Time'],
    placeholder: '🐾',
    images: Array.from({ length: 97 }, (_, i) => i + 1).filter((n) => n !== 40).map((n) => Q(`people/people-${n}.jpg`)),
    cover: Q('people/people-38.jpg'),
    layout: 'polaroid',
  },
  {
    id: 'robotics',
    piece: 'i',
    title: 'ROBOTICS',
    sub: 'Mechanical Member of Spark Youth FIRST Robotics Club (2024-2025) in Kanata, ON. Built drive components and autonomous systems for the 2023 FIRST Robotics Competition.',
    tags: ['FRC', 'Mechanical', 'Autonomous', 'Kanata'],
    placeholder: '🤖',
    images: [ROBOTICS_GALLERY[0].src],
    layout: 'bento',
    gallery: ROBOTICS_GALLERY,
    videos: videosFor('robotics', 1),
  },
  {
    id: 'photography',
    piece: 'o',
    title: 'PHOTOGRAPHY',
    sub: 'Candid shots, travel photos, and life through a lens. Instagram: @juliann.zhu',
    tags: ['Candid', 'Travel', 'Film'],
    placeholder: '📷',
    images: Array.from({ length: 40 }, (_, i) => Q(`photography/photography-${i + 1}.jpg`)),
    layout: 'marquee',
    marqueeHeight: 'calc(100vh - 260px)',
  },
  {
    id: 'shad',
    piece: 'j',
    title: 'SHAD',
    sub: 'A month of hands-on STEM and entrepreneurship, and way too many late-night talks with people who now feel like lifelong friends.',
    tags: ['STEM', 'Entrepreneurship', 'Summer Program'],
    placeholder: '🎓',
    images: Array.from({ length: 55 }, (_, i) => Q(`shad/shad-${i + 1}.jpg`)),
    cover: Q('shad/shad-7.jpg'),
    layout: 'polaroid',
    videos: videosFor('shad', 4),
  },
  {
    id: 'relay',
    piece: 'z',
    title: 'RELAY FOR LIFE',
    sub: 'Team Captain for Relay For Life in Nepean, ON (2023-2025). Raised over $700 for cancer research, contributing to a total of $29,000 raised by our community.',
    tags: ['Team Captain', 'Fundraising', 'Cancer Research', 'Community'],
    placeholder: '🎗️',
    images: Array.from({ length: 6 }, (_, i) => Q(`relay/relay-${[2, 3, 5, 6, 7, 9][i]}.jpg`)),
    cover: Q('relay/relay-4.jpg'),
    layout: 'filmstrip',
    filmstripHero: { src: Q('relay/relay-1.jpg'), caption: 'Bake sale fundraiser' },
    filmstripFeatures: [
      { src: Q('relay/relay-4.jpg'), caption: 'Merivale Relay for Life Event 2024' },
      { src: Q('relay/relay-8.jpg') },
    ],
  },
  {
    id: 'lego',
    piece: 'o',
    title: 'FIRST LEGO LEAGUE',
    sub: 'Instructor and Logistics Lead (2024-2025) in Kanata, ON. Introduced kids to STEM through robotics, supervised budgeting and construction, and delivered bi-weekly coding lessons using LEGO SPIKE.',
    tags: ['Instructor', 'STEM', 'LEGO SPIKE', 'Logistics Lead'],
    placeholder: '🧱',
    images: [Q('lego/lego-4.jpg')],
    layout: 'bento',
    gallery: LEGO_GALLERY,
  },
]

// ---- CSS ----
const CSS = `
.tj-quest-card {
  cursor: pointer;
}

/* image container */
.tj-quest-media {
  width: 100%; aspect-ratio: 16/9;
  background: var(--bg-well); border: 2px dashed var(--border-hairline);
  border-radius: var(--radius-1); margin-bottom: 16px;
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center; font-size: 48px;
}
/* Ken Burns zoom on hover */
.tj-quest-img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  transition: transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.tj-quest-card:hover .tj-quest-img { transform: scale(1.06); }

/* click hint overlay */
.tj-quest-hint {
  position: absolute; inset: 0;
  background: rgba(10,10,18,0.52);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 160ms;
  font-family: var(--font-pixel); font-size: 9px; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.tj-quest-card:hover .tj-quest-hint { opacity: 1; }

/* detail page slide-in */
@keyframes tj-slide-in-left {
  from { transform: translateX(-24px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
.tj-quest-detail { animation: tj-slide-in-left 240ms var(--ease-snap) both; }

/* ---- Bento collage ---- */
.tj-bento-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 150px;
  grid-auto-flow: dense;
  gap: 10px;
  margin-bottom: 8px;
}
@media (max-width: 720px) {
  .tj-bento-grid { grid-template-columns: repeat(3, 1fr); }
}
.tj-bento-tile {
  position: relative;
  display: flex; flex-direction: column;
  border-radius: var(--radius-1);
  overflow: hidden;
  background: var(--bg-well);
}
.tj-bento-img { width: 100%; flex: 1; min-height: 0; object-fit: cover; display: block; }
.tj-bento-number {
  position: absolute; top: 6px; left: 6px; z-index: 2;
  min-width: 20px; height: 20px; padding: 0 4px; border-radius: 4px;
  background: rgba(10,10,18,0.72); border: 1.5px solid;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-size: 11px; font-weight: 600;
}
.tj-bento-caption {
  flex-shrink: 0; padding: 6px 10px 6px 0; min-height: 20px;
  font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
  background: var(--bg-well); border-top: 2px dashed var(--border-hairline);
}
.tj-bento-caption-placeholder { color: var(--text-faint); font-style: italic; }

/* ---- Filmstrip reel ---- */
.tj-filmstrip-sprockets {
  height: 10px;
  background-image: repeating-linear-gradient(to right, var(--border-strong) 0 6px, transparent 6px 16px);
  opacity: 0.5;
}
.tj-filmstrip-reel {
  display: flex; gap: 12px; padding: 12px 2px;
  overflow-x: auto; scroll-snap-type: x mandatory;
}
.tj-filmstrip-frame {
  flex: 0 0 220px; aspect-ratio: 4/3; scroll-snap-align: center;
  border: 3px solid var(--border-strong); border-radius: var(--radius-1);
  overflow: hidden;
}
`

let cssInjected = false
function ensureCSS() {
  if (!cssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); cssInjected = true
  }
}

function BackButton({ c, onBack, style }: { c: string; onBack: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onBack}
      onMouseEnter={(e) => { e.currentTarget.style.color = c }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)' }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: 0, transition: 'color 140ms', ...style }}>
      <Icon icon="pixelarticons:arrow-left" style={{ fontSize: 14 }} />
      Back to Side Quests
    </button>
  )
}

// Shared kicker + title + sub + tags block used at the top of every detail layout.
function QuestDetailHeader({ quest, c }: { quest: QuestCard; c: string }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
        <Tetromino piece={quest.piece} size={18} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: c, marginBottom: 6 }}>{'// Side Quest'}</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 22, color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{quest.title}</h2>
        </div>
      </div>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.7, marginBottom: 24 }}>{quest.sub}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 40 }}>
        {quest.tags.map((t) => <Tag key={t} piece={quest.piece}>{t}</Tag>)}
      </div>
    </>
  )
}

function StockNote({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bg-well)', border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>{text}</span>
    </div>
  )
}

// Thumbnail strip of video clips + a click-to-open lightbox. Shared across every detail
// layout so any quest can attach videos regardless of its photo layout.
function VideoStrip({ videos }: { videos?: QuestVideo[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  if (!videos || videos.length === 0) return null
  return (
    <>
      <div style={{ marginTop: 32 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{'// Video clips'}</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {videos.map((v, i) => (
            <button key={i} onClick={() => setOpenIdx(i)} aria-label={`Play video ${i + 1}`} style={{
              position: 'relative', width: 168, aspectRatio: '16/9', padding: 0, cursor: 'pointer',
              border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)', overflow: 'hidden', background: 'var(--bg-well)',
            }}>
              <img src={v.poster} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(10,10,18,0.4)', fontSize: 28, color: '#fff',
              }}>▶</span>
            </button>
          ))}
        </div>
      </div>
      {openIdx !== null && createPortal(
        <div onClick={() => setOpenIdx(null)} style={{
          position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(5,5,9,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
        }}>
          <video src={videos[openIdx].src} controls autoPlay style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 4 }} onClick={(e) => e.stopPropagation()} />
          <button onClick={() => setOpenIdx(null)} aria-label="Close video" style={{
            position: 'absolute', top: 24, right: 32, width: 40, height: 40, borderRadius: 4,
            background: 'var(--bg-well)', border: '2px solid var(--border-strong)', color: 'var(--text-strong)',
            fontSize: 18, cursor: 'pointer',
          }}>✕</button>
        </div>,
        document.body
      )}
    </>
  )
}

// ---- Marquee: three columns auto-scrolling in alternating directions, masked fade ----
const MARQUEE_MASK = 'linear-gradient(to bottom, transparent 0, black 36px, black calc(100% - 36px), transparent 100%)'

function MarqueeColumn({ items, direction }: { items: string[]; direction: 'up' | 'down' }) {
  const colRef = useRef<HTMLDivElement>(null)
  const offset = useRef(direction === 'down' ? -50 : 0)
  const raf = useRef<number>(0)

  useEffect(() => {
    let last = 0
    const tick = (ts: number) => {
      const delta = ts - last; last = ts
      if (colRef.current) {
        offset.current += (direction === 'up' ? -1 : 1) * delta * 0.022
        const h = colRef.current.scrollHeight / 2
        if (offset.current <= -h) offset.current += h
        if (offset.current >= 0) offset.current -= h
        colRef.current.style.transform = `translateY(${offset.current}px)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [direction])

  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', flex: 1, borderRadius: 'var(--radius-1)' }}>
      <div ref={colRef} style={{ display: 'flex', flexDirection: 'column', gap: 10, willChange: 'transform' }}>
        {doubled.map((src, i) => (
          <div key={i} style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-1)', overflow: 'hidden', flexShrink: 0 }}>
            <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function MarqueeDetail({ quest, onBack }: { quest: QuestCard; onBack: () => void }) {
  const c = `var(--piece-${quest.piece})`
  const items = quest.images
  const col1 = items.filter((_, i) => i % 3 === 0)
  const col2 = items.filter((_, i) => i % 3 === 1)
  const col3 = items.filter((_, i) => i % 3 === 2)

  return (
    <section className="tj-quest-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <BackButton c={c} onBack={onBack} style={{ marginBottom: 32 }} />
      <QuestDetailHeader quest={quest} c={c} />

      <div style={{ height: quest.marqueeHeight ?? 480, display: 'flex', gap: 12, WebkitMaskImage: MARQUEE_MASK, maskImage: MARQUEE_MASK }}>
        <MarqueeColumn items={col1} direction="down" />
        <MarqueeColumn items={col2} direction="up" />
        <MarqueeColumn items={col3} direction="down" />
      </div>

      <VideoStrip videos={quest.videos} />
      <BackButton c={c} onBack={onBack} style={{ marginTop: 40 }} />
    </section>
  )
}

// ---- Polaroid: scattered, overlapping tilted prints with scroll parallax ----
// Deterministic "random" (same seed always gives the same jitter, so layout doesn't
// reshuffle on re-render) — cheap hash of the index plus a salt, folded into 0..1.
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const POLA_COLS = 4
const POLA_ROW_H = 172 // less than a card's own rendered height, so rows overlap
const POLA_CARD_W = 180

type ScatterSpot = { x: number; y: number; rot: number; w: number; speed: number }

// Cards are laid out in a loose grid, then knocked around with per-card jitter on
// position, rotation and size — that's what makes rows overlap and lets neighbours
// bleed into each other instead of sitting in tidy, evenly-spaced cells.
function polaroidSpot(i: number, total: number, override?: { width?: number; col?: number }): ScatterSpot {
  const cols = Math.min(POLA_COLS, Math.max(1, total))
  const col = override?.col ?? (i % cols)
  const row = Math.floor(i / cols)
  const colWidth = 100 / cols
  const baseX = col * colWidth + colWidth / 2
  // Kept well inside the cell (not the full width/row) so a card can partially
  // overlap its neighbours without ever landing squarely on top of one — the
  // overlap should read as clutter, not as a photo that's completely hidden.
  const xJitter = (seeded(i, 1) - 0.5) * colWidth * 0.5
  const yJitter = (seeded(i, 2) - 0.5) * POLA_ROW_H * 0.35
  const rot = (seeded(i, 3) - 0.5) * 24
  const w = override?.width ?? (POLA_CARD_W + (seeded(i, 4) - 0.5) * 30)
  const speed = 0.02 + seeded(i, 5) * 0.045
  return { x: Math.max(2, Math.min(96, baseX + xJitter - w / 200 * 5)), y: Math.max(0, row * POLA_ROW_H + yJitter), rot, w, speed }
}

function polaroidHeight(total: number, fit: 'square' | 'native' = 'square') {
  const cols = Math.min(POLA_COLS, Math.max(1, total))
  const rows = Math.ceil(total / cols)
  // Native-fit prints vary in height (some portrait shots run much taller than a
  // square print), so pad extra room to keep the reel below from overlapping them.
  return rows * POLA_ROW_H + POLA_CARD_W * 1.3 + 60 + (fit === 'native' ? 240 : 0)
}

function PolaroidCard({ src, spot, scrollRef, i, containerRef, onDragEnd, fit = 'square' }: {
  src: string; spot: ScatterSpot; scrollRef: React.RefObject<number>; i: number
  containerRef: React.RefObject<HTMLDivElement | null>; onDragEnd: (xPct: number, yPx: number) => void
  fit?: 'square' | 'native'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; dx: number; dy: number; dragging: boolean }>({ startX: 0, startY: 0, dx: 0, dy: 0, dragging: false })

  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (ref.current) {
        const { dx, dy } = dragRef.current
        ref.current.style.transform = `translate(${dx}px, ${dy}px) rotate(${spot.rot}deg) translateY(${scrollRef.current * spot.speed}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [spot])

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, dx: 0, dy: 0, dragging: true }
    if (ref.current) ref.current.style.cursor = 'grabbing'
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return
    dragRef.current.dx = e.clientX - dragRef.current.startX
    dragRef.current.dy = e.clientY - dragRef.current.startY
  }
  const onPointerUp = () => {
    if (!dragRef.current.dragging) return
    const { dx, dy } = dragRef.current
    dragRef.current.dragging = false
    if (ref.current) ref.current.style.cursor = 'grab'
    const containerWidth = containerRef.current?.clientWidth || 1000
    onDragEnd(spot.x + (dx / containerWidth) * 100, spot.y + dy)
    dragRef.current.dx = 0
    dragRef.current.dy = 0
  }

  return (
    <div ref={ref} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} style={{
      position: 'absolute', left: `${spot.x}%`, top: spot.y, width: spot.w, zIndex: i,
      background: '#f3ede0', padding: '10px 10px 26px', borderRadius: 2, cursor: 'grab', touchAction: 'none',
      boxShadow: '0 10px 24px rgba(0,0,0,0.45)', willChange: 'transform',
    }}>
      {fit === 'native' ? (
        <img src={src} alt="" loading="lazy" draggable={false} style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }} />
      ) : (
        <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: 'var(--bg-well)' }}>
          <img src={src} alt="" loading="lazy" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
        </div>
      )}
      <span style={{ position: 'absolute', bottom: 6, right: 10, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#8a8270' }}>#{i + 1}</span>
    </div>
  )
}

function PolaroidDetail({ quest, onBack }: { quest: QuestCard; onBack: () => void }) {
  const c = `var(--piece-${quest.piece})`
  const scrollValue = useRef(0)
  const baseline = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragOverrides, setDragOverrides] = useState<Record<number, { x: number; y: number }>>({})

  useEffect(() => {
    const scroller = document.querySelector('.tj-scrollpane') as HTMLElement | null
    if (!scroller) return
    const onScroll = () => {
      if (baseline.current === null) baseline.current = scroller.scrollTop
      scrollValue.current = scroller.scrollTop - baseline.current
    }
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="tj-quest-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <BackButton c={c} onBack={onBack} style={{ marginBottom: 32 }} />
      <QuestDetailHeader quest={quest} c={c} />

      <div ref={containerRef} style={{ position: 'relative', height: polaroidHeight(quest.images.length, quest.polaroidFit), marginTop: 12 }}>
        {quest.images.map((src, i) => {
          const baseSpot = polaroidSpot(i, quest.images.length, quest.polaroidOverrides?.[src])
          const drag = dragOverrides[i]
          const spot = drag ? { ...baseSpot, x: drag.x, y: drag.y } : baseSpot
          return (
            <PolaroidCard key={i} src={src} spot={spot} scrollRef={scrollValue} i={i} containerRef={containerRef} fit={quest.polaroidFit}
              onDragEnd={(x, y) => setDragOverrides((prev) => ({ ...prev, [i]: { x, y } }))} />
          )
        })}
      </div>

      <VideoStrip videos={quest.videos} />
      <BackButton c={c} onBack={onBack} style={{ marginTop: 40 }} />
    </section>
  )
}

// ---- Filmstrip: one hero frame + a snapping horizontal reel ----
function FilmstripCaption({ text }: { text?: string }) {
  if (!text) return null
  return (
    <div style={{ padding: '6px 10px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-well)', border: '2px solid var(--border-hairline)', borderTop: 'none', borderBottomLeftRadius: 'var(--radius-1)', borderBottomRightRadius: 'var(--radius-1)' }}>
      {'// '}{text}
    </div>
  )
}

function FilmstripDetail({ quest, onBack }: { quest: QuestCard; onBack: () => void }) {
  const c = `var(--piece-${quest.piece})`
  const heroSrc = quest.filmstripHero?.src ?? quest.images[0]
  const features = quest.filmstripFeatures ?? []
  // images[0] can double as the tile cover even when it's really the hero/a feature —
  // filter those back out here so the reel never shows the same photo twice.
  const excluded = new Set([quest.filmstripHero?.src, ...features.map((f) => f.src)])
  const reel = (quest.filmstripHero ? quest.images : quest.images.slice(1)).filter((src) => !excluded.has(src))

  return (
    <section className="tj-quest-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <BackButton c={c} onBack={onBack} style={{ marginBottom: 32 }} />
      <QuestDetailHeader quest={quest} c={c} />

      {heroSrc && (
        <div style={{ marginBottom: features.length ? 12 : 4 }}>
          <div style={{ aspectRatio: '16/9', borderRadius: quest.filmstripHero?.caption ? '2px 2px 0 0' : 'var(--radius-1)', overflow: 'hidden', border: '2px solid var(--border-strong)', background: 'var(--bg-well)' }}>
            <img src={heroSrc} alt="" style={{ width: '100%', height: '100%', objectFit: quest.filmstripHero?.fit ?? 'cover' }} />
          </div>
          <FilmstripCaption text={quest.filmstripHero?.caption} />
        </div>
      )}

      {features.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
          {features.map((f, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ aspectRatio: '4/3', borderRadius: f.caption ? '2px 2px 0 0' : 'var(--radius-1)', overflow: 'hidden', border: '2px solid var(--border-strong)' }}>
                <img src={f.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <FilmstripCaption text={f.caption} />
            </div>
          ))}
        </div>
      )}

      <div className="tj-filmstrip-sprockets" />
      <div className="tj-filmstrip-reel">
        {reel.map((src, i) => {
          const caption = quest.filmstripReelCaptions?.[src]
          return (
            <div key={i} style={{ flex: '0 0 220px' }}>
              <div className="tj-filmstrip-frame" style={caption ? { borderRadius: '2px 2px 0 0' } : undefined}>
                <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <FilmstripCaption text={caption} />
            </div>
          )
        })}
      </div>
      <div className="tj-filmstrip-sprockets" />

      <VideoStrip videos={quest.videos} />
      <BackButton c={c} onBack={onBack} style={{ marginTop: 40 }} />
    </section>
  )
}

// ---- Bento: numbered collage tiles, sized hero/wide/tall/sm, captions on select tiles ----
const BENTO_SPAN: Record<MediaSize, { col: number; row: number }> = {
  xl: { col: 3, row: 2 },
  hero: { col: 2, row: 2 },
  wide: { col: 2, row: 1 },
  tall: { col: 1, row: 2 },
  sm: { col: 1, row: 1 },
}

function BentoDetail({ quest, onBack }: { quest: QuestCard; onBack: () => void }) {
  const c = `var(--piece-${quest.piece})`
  const photos = quest.gallery ?? []

  return (
    <section className="tj-quest-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <BackButton c={c} onBack={onBack} style={{ marginBottom: 32 }} />
      <QuestDetailHeader quest={quest} c={c} />

      <div className="tj-bento-grid">
        {photos.map((p, i) => {
          const span = BENTO_SPAN[p.size ?? 'sm']
          return (
            <div key={i} className="tj-bento-tile" style={{ gridColumn: `span ${span.col}`, gridRow: `span ${span.row}` }}>
              <span className="tj-bento-number" style={{ borderColor: c, color: c }}>{p.number ?? i + 1}</span>
              <img src={p.src} alt="" loading="lazy" className="tj-bento-img" style={{ objectFit: p.fit ?? 'cover' }} />
              {p.caption !== undefined && (
                <div className="tj-bento-caption">
                  {p.caption ? <>{'// '}{p.caption}</> : <span className="tj-bento-caption-placeholder">Add a caption…</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <StockNote text={'// Numbers match the order in the gallery array in SideQuests.tsx — reassign `size` (hero/wide/tall/sm) or add a `caption` to any photo there'} />
      <VideoStrip videos={quest.videos} />
      <BackButton c={c} onBack={onBack} style={{ marginTop: 40 }} />
    </section>
  )
}

// ---- Generic detail sub-page ----
function MediaSlot({ src, index }: { src?: string; index: number }) {
  return (
    <div style={{
      aspectRatio: index === 0 ? '16/9' : '4/3',
      gridColumn: index === 0 ? 'span 2' : undefined,
      borderRadius: 'var(--radius-1)', overflow: 'hidden',
      background: src ? 'transparent' : 'var(--bg-well)',
      border: src ? 'none' : '2px dashed var(--border-hairline)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
      cursor: src ? 'default' : 'pointer',
    }}
    onMouseEnter={(e) => { if (!src) e.currentTarget.style.borderColor = 'var(--border-strong)' }}
    onMouseLeave={(e) => { if (!src) e.currentTarget.style.borderColor = 'var(--border-hairline)' }}>
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <>
          <span style={{ fontSize: 28, opacity: 0.35 }}>+</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {index === 0 ? 'Add featured media' : 'Add photo or video'}
          </span>
        </>
      )}
    </div>
  )
}

function QuestDetail({ quest, onBack }: { quest: QuestCard; onBack: () => void }) {
  if (quest.layout === 'bento') return <BentoDetail quest={quest} onBack={onBack} />
  if (quest.layout === 'marquee') return <MarqueeDetail quest={quest} onBack={onBack} />
  if (quest.layout === 'polaroid') return <PolaroidDetail quest={quest} onBack={onBack} />
  if (quest.layout === 'filmstrip') return <FilmstripDetail quest={quest} onBack={onBack} />
  const c = `var(--piece-${quest.piece})`
  return (
    <section className="tj-quest-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <BackButton c={c} onBack={onBack} style={{ marginBottom: 32 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
        <Tetromino piece={quest.piece} size={18} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: c, marginBottom: 6 }}>{'// Side Quest'}</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 22, color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{quest.title}</h2>
        </div>
      </div>

      <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.7, marginBottom: 32 }}>{quest.sub}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 40 }}>
        {quest.tags.map((t) => <Tag key={t} piece={quest.piece}>{t}</Tag>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <MediaSlot key={i} src={quest.images[i]} index={i} />
        ))}
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bg-well)', border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)' }}>
          {'// Add your own photos to public/assets/quests/ to populate this page'}
        </span>
      </div>

      <VideoStrip videos={quest.videos} />
      <BackButton c={c} onBack={onBack} style={{ marginTop: 40 }} />
    </section>
  )
}

// ---- Scroll-jacked horizontal carousel ----
const TILE_W = 280
const TILE_H = 400
const GAP = 24
const TITLE_W = 300
const TITLE_GUTTER = 40
const HEADER_H = 58
const FOOTER_H = 84
const ENGAGE_OFFSET = 90
const WHEEL_TO_PROGRESS = 3200
const TOUCH_TO_PROGRESS = 900

function QuestCarousel({ onOpen, progressRef }: { onOpen: (id: string) => void; progressRef: React.RefObject<number> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const applyFrame = () => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return
    const maxScroll = Math.max(0, track.scrollWidth - container.clientWidth)
    const p = progressRef.current
    track.style.transform = `translateY(-50%) translateX(${-p * maxScroll}px)`

    const title = titleRef.current
    if (title) {
      const titleOpacity = Math.max(0, 1 - p / 0.18)
      title.style.opacity = String(titleOpacity)
      title.style.pointerEvents = titleOpacity < 0.05 ? 'none' : 'auto'
    }

    const viewportCenter = container.getBoundingClientRect().left + container.clientWidth / 2
    let closestIdx = 0
    let closestDist = Infinity
    tileRefs.current.forEach((el, i) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const dist = Math.abs(center - viewportCenter)
      const norm = Math.min(1, dist / (container.clientWidth / 2))
      const scale = 1.08 - norm * 0.22
      const opacity = 1 - norm * 0.75
      el.style.transform = `scale(${scale})`
      el.style.opacity = String(Math.max(0.15, opacity))
      if (dist < closestDist) { closestDist = dist; closestIdx = i }
    })
    setActiveIndex((prev) => (prev === closestIdx ? prev : closestIdx))
  }

  const scheduleFrame = () => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => { rafRef.current = 0; applyFrame() })
  }

  useEffect(() => { scheduleFrame() }, [])

  useEffect(() => {
    const onResize = () => scheduleFrame()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Wheel-jacking: once the section's top has scrolled up near the header, further
  // scroll (in either axis) drives the track horizontally instead of the page vertically,
  // until the carousel is exhausted in that direction — then normal scroll resumes.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const container = containerRef.current
      if (!container) return
      const rectTop = container.getBoundingClientRect().top
      // Bounded symmetrically around 0 so re-engaging while scrolling back up only
      // happens once the carousel is actually back in view, not from a full
      // container-height away while it's still completely off-screen (that let
      // scrolling up from the next section silently rewind an invisible carousel).
      const nearTop = rectTop <= ENGAGE_OFFSET && rectTop >= -ENGAGE_OFFSET
      if (!nearTop) return

      // Cursor below the pagination dots reads as "done browsing, let me scroll on" —
      // don't hijack that scroll, let the page move to the next section normally.
      const dots = dotsRef.current
      if (dots && e.clientY >= dots.getBoundingClientRect().top) return

      const delta = e.deltaY + e.deltaX
      const atStart = progressRef.current <= 0
      const atEnd = progressRef.current >= 1
      if ((atStart && delta < 0) || (atEnd && delta > 0)) return

      e.preventDefault()
      progressRef.current = Math.min(1, Math.max(0, progressRef.current + delta / WHEEL_TO_PROGRESS))
      scheduleFrame()
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  // Touch swipe fallback: horizontal drags move the carousel; vertical drags pass through.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let startX = 0, startY = 0, dragging = false, horizontal = false
    const onStart = (e: TouchEvent) => {
      const rectTop = container.getBoundingClientRect().top
      if (rectTop > ENGAGE_OFFSET || rectTop < -ENGAGE_OFFSET) return
      const dots = dotsRef.current
      if (dots && e.touches[0].clientY >= dots.getBoundingClientRect().top) return
      startX = e.touches[0].clientX; startY = e.touches[0].clientY
      dragging = true; horizontal = false
    }
    const onMove = (e: TouchEvent) => {
      if (!dragging) return
      const dx = e.touches[0].clientX - startX
      const dy = e.touches[0].clientY - startY
      if (!horizontal && Math.abs(dx) > Math.abs(dy) + 6) horizontal = true
      if (!horizontal) return
      const atStart = progressRef.current <= 0
      const atEnd = progressRef.current >= 1
      if ((atStart && dx > 0) || (atEnd && dx < 0)) { dragging = false; return }
      e.preventDefault()
      progressRef.current = Math.min(1, Math.max(0, progressRef.current - dx / TOUCH_TO_PROGRESS))
      startX = e.touches[0].clientX; startY = e.touches[0].clientY
      scheduleFrame()
    }
    const onEnd = () => { dragging = false }
    container.addEventListener('touchstart', onStart, { passive: true })
    container.addEventListener('touchmove', onMove, { passive: false })
    container.addEventListener('touchend', onEnd)
    return () => {
      container.removeEventListener('touchstart', onStart)
      container.removeEventListener('touchmove', onMove)
      container.removeEventListener('touchend', onEnd)
    }
  }, [])

  const jumpTo = (i: number) => {
    const container = containerRef.current
    const track = trackRef.current
    const tile = tileRefs.current[i]
    if (!container || !track || !tile) return
    const maxScroll = Math.max(1, track.scrollWidth - container.clientWidth)
    const tileCenter = tile.offsetLeft + tile.offsetWidth / 2
    const desiredX = tileCenter - container.clientWidth / 2
    progressRef.current = Math.min(1, Math.max(0, desiredX / maxScroll))
    scheduleFrame()
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', height: `calc(100vh - ${HEADER_H + FOOTER_H}px)`, overflow: 'hidden' }}>
      {/* height matches TILE_H and centers its content with flex, so the title block's
          vertical center lines up exactly with the tile cards' vertical center regardless
          of how many lines the copy wraps to. */}
      <div ref={titleRef} style={{
        position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', width: TITLE_W, height: TILE_H, zIndex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-j)' }}>{'// Beyond the code'}</div>
        <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 26, color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Side Quests</h2>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 16 }}>
          Every developer needs a break.<br></br>
          This space is dedicated to the passion <br></br>
          projects, creative experiments, <br></br>
          and random pieces that make up <br></br>
          my life outside the terminal. <br></br>
          Scroll to explore.
        </p>
      </div>

      <div ref={trackRef} style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', display: 'flex', gap: GAP, paddingLeft: 24 + TITLE_W + TITLE_GUTTER, paddingRight: 60, willChange: 'transform' }}>
        {QUESTS.map((q, i) => {
          const coverSrc = q.cover ?? q.images[0]
          return (
          <div key={q.id} ref={(el) => { tileRefs.current[i] = el }} className="tj-quest-card" onClick={() => onOpen(q.id)}
            style={{ width: TILE_W, height: TILE_H, flexShrink: 0 }}>
            <Card accent={q.piece} accentBar style={{ display: 'flex', flexDirection: 'column', height: '100%', userSelect: 'none' }}>
              <div className="tj-quest-media">
                {coverSrc && <img src={coverSrc} alt={q.title} className="tj-quest-img" />}
                {!coverSrc && <span style={{ fontSize: 48 }}>{q.placeholder}</span>}
                <div className="tj-quest-hint">Click to explore</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <Tetromino piece={q.piece} size={11} />
                <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 13, color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{q.title}</h3>
              </div>
              <p style={{
                fontSize: 14, color: 'var(--text-muted)', margin: '0 0 14px', lineHeight: 1.55, flex: 1,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{q.sub}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {q.tags.map((t) => <Tag key={t} piece={q.piece}>{t}</Tag>)}
              </div>
            </Card>
          </div>
          )
        })}
      </div>

      <div ref={dotsRef} style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 2 }}>
        {QUESTS.map((q, i) => (
          <button key={q.id} onClick={() => jumpTo(i)} aria-label={`Go to ${q.title}`}
            style={{
              width: i === activeIndex ? 20 : 7, height: 7, borderRadius: 4, padding: 0, border: 'none', cursor: 'pointer',
              background: i === activeIndex ? `var(--piece-${q.piece})` : 'var(--border-strong)',
              transition: 'width 200ms, background 200ms',
            }} />
        ))}
      </div>
    </div>
  )
}

// ---- Grid view ----
export function SideQuests({ resetSignal }: { resetSignal?: number } = {}) {
  ensureCSS()
  const [openId, setOpenId] = useState<string | null>(null)
  // Lives in the parent (not inside QuestCarousel) so it survives the carousel
  // unmounting while a quest detail page is open, letting scroll position pick
  // back up where it left off instead of resetting to the first tile.
  const progressRef = useRef(0)

  // Bumped by App.tsx when "Quests" is clicked again while already on this section —
  // closes whatever quest detail is open so the full tile grid is visible again.
  useEffect(() => { setOpenId(null) }, [resetSignal])

  if (openId) {
    const quest = QUESTS.find(q => q.id === openId)!
    return <QuestDetail quest={quest} onBack={() => setOpenId(null)} />
  }

  return <QuestCarousel onOpen={setOpenId} progressRef={progressRef} />
}
