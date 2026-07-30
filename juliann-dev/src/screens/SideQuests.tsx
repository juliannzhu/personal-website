import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import { Card } from '../components/ds/Card'
import { Tag } from '../components/ds/Tag'
import { Tetromino } from '../components/ds/Tetromino'
import { IconButton } from '../components/ds/IconButton'
import { Button } from '../components/ds/Button'

type Piece = 'i' | 'o' | 't' | 's' | 'z' | 'j' | 'l'
type DetailLayout = 'bento' | 'marquee' | 'polaroid'
interface BentoPhoto { src: string; caption?: string }
interface QuestVideo { src: string; poster: string; caption?: string }

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
  // only used when layout === 'bento' — the photos for the collage
  gallery?: BentoPhoto[]
  // clickable video clips shown below the main gallery, opened in a lightbox
  videos?: QuestVideo[]
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
// `nums` is either a count (1..N) or an explicit list of clip numbers — the latter lets a
// quest skip a removed clip (e.g. poker keeps 1, 2, 4 after 3 was deleted).
const videosFor = (prefix: string, nums: number | number[], captions: Record<number, string> = {}): QuestVideo[] =>
  (typeof nums === 'number' ? Array.from({ length: nums }, (_, i) => i + 1) : nums).map((n) => ({
    src: Q(`${prefix}/${prefix}-video-${n}.m4v`),
    poster: Q(`${prefix}/${prefix}-video-${n}-poster.jpg`),
    caption: captions[n],
  }))

// volleyball-1 is the cover photo (volleyballcoverphoto), also used as the tile thumbnail
const VOLLEYBALL_GALLERY: BentoPhoto[] = [
  { src: Q('volleyball/volleyball-1.jpg'), caption: 'Merivale High School Senior Girls Volleyball Team 2025' },
  { src: Q('volleyball/volleyball-2.jpg') },
  { src: Q('volleyball/volleyball-3.jpg') },
  { src: Q('volleyball/volleyball-4.jpg') },
  { src: Q('volleyball/volleyball-5.jpg') },
  { src: Q('volleyball/volleyball-6.jpg') },
  { src: Q('volleyball/volleyball-7.jpg'), caption: 'Team bonding after a beach tournament' },
  { src: Q('volleyball/volleyball-8.jpg') },
  { src: Q('volleyball/volleyball-9.jpg') },
  { src: Q('volleyball/volleyball-10.jpg') },
  { src: Q('volleyball/volleyball-11.jpg') },
  { src: Q('volleyball/volleyball-12.jpg') },
  { src: Q('volleyball/volleyball-13.jpg') },
  { src: Q('volleyball/volleyball-14.jpg') },
  { src: Q('volleyball/volleyball-15.jpg'), caption: "Waterloo SERVE All Women's Tournament 2026" },
  { src: Q('volleyball/volleyball-16.jpg') },
  { src: Q('volleyball/volleyball-17.jpg') },
  { src: Q('volleyball/volleyball-18.jpg') },
  { src: Q('volleyball/volleyball-19.jpg') },
  { src: Q('volleyball/volleyball-20.jpg') },
  { src: Q('volleyball/volleyball-21.jpg') },
  { src: Q('volleyball/volleyball-22.jpg'), caption: 'Last high school game' },
  { src: Q('volleyball/volleyball-23.jpg') },
  { src: Q('volleyball/volleyball-24.jpg') },
  { src: Q('volleyball/volleyball-25.jpg') },
  { src: Q('volleyball/volleyball-26.jpg'), caption: 'Beach volleyball in Cuba' },
  { src: Q('volleyball/volleyball-27.jpg') },
  { src: Q('volleyball/volleyball-28.jpg'), caption: 'Marauders Cup Champions' },
  { src: Q('volleyball/volleyball-29.jpg') },
  { src: Q('volleyball/volleyball-30.jpg'), caption: '16U Fusion Volleyball Competitive Team' },
  { src: Q('volleyball/volleyball-31.jpg') },
  { src: Q('volleyball/volleyball-32.jpg') },
  { src: Q('volleyball/volleyball-33.jpg') },
  { src: Q('volleyball/volleyball-34.jpg'), caption: 'Post win celebration' },
  { src: Q('volleyball/volleyball-35.jpg') },
  { src: Q('volleyball/volleyball-36.jpg'), caption: 'Marauders Cup 2026 Finalists' },
  { src: Q('volleyball/volleyball-37.jpg'), caption: '4x Marauders Cup Champions' },
  { src: Q('volleyball/volleyball-38.jpg') },
  { src: Q('volleyball/volleyball-39.jpg') },
  { src: Q('volleyball/volleyball-40.jpg'), caption: 'STANK 2025' },
  { src: Q('volleyball/volleyball-41.jpg') },
  { src: Q('volleyball/volleyball-42.jpg') },
  { src: Q('volleyball/volleyball-43.jpg') },
  { src: Q('volleyball/volleyball-44.jpg'), caption: 'Bomu Volleyball' },
  { src: Q('volleyball/volleyball-45.jpg'), caption: 'Waterloo SERVE 3Peas Tournament 2026' },
]

const ART_GALLERY: BentoPhoto[] = [
  { src: Q('art/art-1.jpg'), caption: 'IB English Poster' },
  { src: Q('art/art-2.jpg') },
  { src: Q('art/art-3.jpg'), caption: 'Clay crafts' },
  { src: Q('art/art-4.jpg') },
  { src: Q('art/art-9.jpg'), caption: 'Clay crafts after the oven' },
  { src: Q('art/art-5.jpg'), caption: 'Chinese New Year whiteboard art' },
  { src: Q('art/art-6.jpg') },
  { src: Q('art/art-7.jpg') },
  { src: Q('art/art-8.jpg'), caption: 'IB art technique practice' },
  { src: Q('art/art-10.jpg') },
  { src: Q('art/art-11.jpg') },
  { src: Q('art/art-12.jpg') },
  { src: Q('art/art-14.jpg') },
  { src: Q('art/art-15.jpg'), caption: "Valentine's Day paper bouquet" },
  { src: Q('art/art-16.jpg'), caption: 'Painting tote bags in Waterloo' },
  { src: Q('art/art-17.jpg') },
  { src: Q('art/art-18.jpg') },
  { src: Q('art/art-19.jpg'), caption: 'Homemade stamps for Halloween 2025' },
  { src: Q('art/art-20.jpg'), caption: '3D wooden puzzle piano build' },
  { src: Q('art/art-21.jpg') },
  { src: Q('art/art-22.jpg') },
]

const BAKING_GALLERY: BentoPhoto[] = [
  { src: Q('baking/baking-2.jpg') },
  { src: Q('baking/baking-3.jpg'), caption: 'Canada Day Brunch' },
  { src: Q('baking/baking-4.jpg'), caption: 'Post strawberry picking meal' },
  { src: Q('baking/baking-8.jpg'), caption: 'Baking cookies at Waterloo' },
  { src: Q('baking/baking-9.jpg'), caption: 'Embroidery crafts and cookies' },
  { src: Q('baking/baking-5.jpg') },
  { src: Q('baking/baking-7.jpg') },
  { src: Q('baking/baking-1.jpg') },
  { src: Q('baking/baking-6.jpg') },
]

const MODELLING_GALLERY: BentoPhoto[] = [
  { src: Q('modelling/modelling-1.jpg'), caption: "Birthday photoshoot in China 2025" },
  { src: Q('modelling/modelling-69.jpg') },
  { src: Q('modelling/modelling-70.jpg') },
  { src: Q('modelling/modelling-72.jpg') },
  { src: Q('modelling/modelling-73.jpg') },
  { src: Q('modelling/modelling-74.jpg') },
  { src: Q('modelling/modelling-71.jpg') },
  { src: Q('modelling/modelling-2.jpg') },
  { src: Q('modelling/modelling-3.jpg') },
  { src: Q('modelling/modelling-4.jpg') },
  { src: Q('modelling/modelling-5.jpg') },
  { src: Q('modelling/modelling-6.jpg') },
  { src: Q('modelling/modelling-7.jpg') },
  { src: Q('modelling/modelling-8.jpg') },
  { src: Q('modelling/modelling-9.jpg') },
  { src: Q('modelling/modelling-10.jpg') },
  { src: Q('modelling/modelling-11.jpg') },
  { src: Q('modelling/modelling-12.jpg') },
  { src: Q('modelling/modelling-13.jpg') },
  { src: Q('modelling/modelling-14.jpg') },
  { src: Q('modelling/modelling-15.jpg') },
  { src: Q('modelling/modelling-16.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-17.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-18.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-19.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-20.jpg'), caption: "Fashion for Change Photoshoot 2025 · 📸 @dr.k.bear" },
  { src: Q('modelling/modelling-21.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-22.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-23.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-24.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-25.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-26.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-27.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-28.jpg'), caption: '📸 @dr.k.bear' },
  { src: Q('modelling/modelling-29.jpg'), caption: '📸 @alexanderjacobiphotography' },
  { src: Q('modelling/modelling-30.jpg'), caption: '📸 @alexanderjacobiphotography' },
  { src: Q('modelling/modelling-31.jpg'), caption: '📸 @alexanderjacobiphotography' },
  { src: Q('modelling/modelling-75.jpg'), caption: "Japan House in Illinois" },
  { src: Q('modelling/modelling-32.jpg'), caption: '📸 @alexanderjacobiphotography' },
  { src: Q('modelling/modelling-33.jpg'), caption: '📸 @alexanderjacobiphotography' },
  { src: Q('modelling/modelling-34.jpg'), caption: '📸 @alexanderjacobiphotography' },
  { src: Q('modelling/modelling-35.jpg'), caption: '📸 @alexanderjacobiphotography' },
  { src: Q('modelling/modelling-37.jpg') },
  { src: Q('modelling/modelling-38.jpg') },
  { src: Q('modelling/modelling-39.jpg') },
  { src: Q('modelling/modelling-40.jpg') },
  { src: Q('modelling/modelling-41.jpg') },
  { src: Q('modelling/modelling-42.jpg') },
  { src: Q('modelling/modelling-43.jpg') },
  { src: Q('modelling/modelling-44.jpg') },
  { src: Q('modelling/modelling-45.jpg') },
  { src: Q('modelling/modelling-47.jpg') },
  { src: Q('modelling/modelling-48.jpg') },
  { src: Q('modelling/modelling-49.jpg'), caption: "Prom photoshoot" },
  { src: Q('modelling/modelling-50.jpg'), caption: "The Louvre in Paris" },
  { src: Q('modelling/modelling-51.jpg') },
  { src: Q('modelling/modelling-52.jpg') },
  { src: Q('modelling/modelling-54.jpg') },
  { src: Q('modelling/modelling-55.jpg') },
  { src: Q('modelling/modelling-56.jpg') },
  { src: Q('modelling/modelling-57.jpg') },
  { src: Q('modelling/modelling-59.jpg') },
  { src: Q('modelling/modelling-60.jpg'), caption: "China photoshoot makeup" },
  { src: Q('modelling/modelling-61.jpg') },
  { src: Q('modelling/modelling-63.jpg') },
  { src: Q('modelling/modelling-64.jpg') },
  { src: Q('modelling/modelling-65.jpg') },
  { src: Q('modelling/modelling-66.jpg') },
  { src: Q('modelling/modelling-67.jpg'), caption: '📸 @alexanderjacobiphotography' },
  { src: Q('modelling/modelling-36.jpg'), caption: "Recreating poses in Paris" },
  { src: Q('modelling/modelling-46.jpg') },
  { src: Q('modelling/modelling-58.jpg') },
  { src: Q('modelling/modelling-68.jpg') },
]


const ROBOTICS_GALLERY: BentoPhoto[] = [
  { src: Q('robotics/robotics-1.jpg'), caption: "DCMP 2025" },
  { src: Q('robotics/robotics-2.jpg') },
  { src: Q('robotics/robotics-3.jpg'), caption: "Garage sale sign for good luck" },
  { src: Q('robotics/robotics-4.jpg') },
  { src: Q('robotics/robotics-5.jpg'), caption: "Cheering on 8729" },
  { src: Q('robotics/robotics-6.jpg') },
  { src: Q('robotics/robotics-7.jpg'), caption: "Spark Youth Robotics pins" },
  { src: Q('robotics/robotics-8.jpg') },
  { src: Q('robotics/robotics-9.jpg'), caption: "Built the coral reef game pieces" },
  { src: Q('robotics/robotics-12.jpg') },
  { src: Q('robotics/robotics-14.jpg') },
  { src: Q('robotics/robotics-15.jpg') },
  { src: Q('robotics/robotics-16.jpg') },
  { src: Q('robotics/robotics-17.jpg') },
  { src: Q('robotics/robotics-18.jpg') },
  { src: Q('robotics/robotics-19.jpg') },
  { src: Q('robotics/robotics-20.jpg') },
  { src: Q('robotics/robotics-22.jpg') },
  { src: Q('robotics/robotics-23.jpg') },
  { src: Q('robotics/robotics-24.jpg') },
  { src: Q('robotics/robotics-21.jpg'), caption: "KCSSC Demo 2024" },
  { src: Q('robotics/robotics-11.jpg') },
  { src: Q('robotics/robotics-13.jpg') },
  { src: Q('robotics/robotics-10.jpg') },
]

const LEGO_GALLERY: BentoPhoto[] = [
  { src: Q('lego/lego-1.jpg') },
  { src: Q('lego/lego-2.jpg') },
  { src: Q('lego/lego-3.jpg') },
  { src: Q('lego/lego-4.jpg') },
  { src: Q('lego/lego-5.jpg') },
  { src: Q('lego/lego-6.jpg'), caption: 'Hard at work building' },
  { src: Q('lego/lego-7.jpg'), caption: 'Final Presentations' },
  { src: Q('lego/lego-8.jpg'), caption: 'Our team' },
  { src: Q('lego/lego-9.jpg') },
  { src: Q('lego/lego-10.jpg') },
  { src: Q('lego/lego-11.jpg') },
]

const MUSIC_GALLERY: BentoPhoto[] = [
  { src: Q('music/music-2.jpg'), caption: 'Performing at Taikang retirement center' },
  { src: Q('music/music-1.jpg') },
  { src: Q('music/music-3.jpg') },
  { src: Q('music/music-4.jpg'), caption: 'Oscar Peterson statue in Ottawa' },
  { src: Q('music/music-5.jpg'), caption: 'Piano before prom' },
]

const POOL_GALLERY: BentoPhoto[] = [
  { src: Q('pool/pool-6.jpg') },
  { src: Q('pool/pool-1.jpg'), caption: 'Teamwork' },
  { src: Q('pool/pool-2.jpg') },
  { src: Q('pool/pool-7.jpg') },
  { src: Q('pool/pool-3.jpg') },
  { src: Q('pool/pool-4.jpg') },
  { src: Q('pool/pool-5.jpg') },
  { src: Q('pool/pool-8.jpg') },
]

const QUESTS: QuestCard[] = [
  {
    id: 'volleyball',
    piece: 'i',
    title: 'VOLLEYBALL',
    sub: 'Team Captain at Merivale High School (2021-2025), leading the team to NCSSAA Tier 1 Finalist standing, four consecutive Marauders Cup wins, and Most Valuable Player (MVP) honours in 2021 and 2023.',
    tags: ['Team Captain', 'NCSSAA', 'MVP', 'Athletics'],
    placeholder: '🏐',
    images: [VOLLEYBALL_GALLERY[0].src],
    layout: 'bento',
    gallery: VOLLEYBALL_GALLERY,
    videos: videosFor('volleyball', 4),
  },
  {
    id: 'music',
    piece: 'o',
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
    sub: "Playing games of pool whenever there's a table free. Still chasing my first 7-0 run.",
    tags: ['8-Ball', 'Cue Sports', 'Casual'],
    placeholder: '🎱',
    images: [Q('pool/pool-2.jpg')],
    layout: 'bento',
    gallery: POOL_GALLERY,
    videos: videosFor('pool', 1, { 1: 'A trickshot' }),
  },
  {
    id: 'baking',
    piece: 's',
    title: 'BAKING',
    sub: 'Flour, sugar, and oven-baked experiments. A great way to relax, get a little messy, and enjoy good food with the people around me.',
    tags: ['Cookies', 'Sweets', 'Stress Relief'],
    placeholder: '🧁',
    images: [Q('baking/baking-3.jpg')],
    layout: 'bento',
    gallery: BAKING_GALLERY,
  },
  {
    id: 'art',
    piece: 'z',
    title: 'ART',
    sub: 'CSS is great, but sometimes I need real paper. Here are all my arts, crafts, and other messy creative outlets.',
    tags: ['Sketching', 'Paint', 'Creativity'],
    placeholder: '🎨',
    images: [Q('art/art-11.jpg')],
    layout: 'bento',
    gallery: ART_GALLERY,
  },
  {
    id: 'travel',
    piece: 'j',
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
    piece: 'l',
    title: 'MODELLING',
    sub: 'Posing, lighting, angles, mixed in with photos of myself that I just genuinely like taking. Most end up buried in my camera roll, but a few make it all the way to Instagram.',
    tags: ['Portraits', 'Photoshoot', 'Dress Up'],
    placeholder: '📸',
    images: [MODELLING_GALLERY[0].src],
    layout: 'bento',
    gallery: MODELLING_GALLERY,
  },
  {
    id: 'poker',
    piece: 'i',
    title: 'POKER',
    sub: 'Calculating pot odds, realizing equity, and trying my best to play GTO under pressure.',
    tags: ["Texas Hold'em", 'Pot Limit Omaha', 'Fun'],
    placeholder: '♠️',
    images: [Q('poker/poker-1.jpg'), Q('poker/poker-3.jpg'), Q('poker/poker-4.jpg'), Q('poker/poker-5.jpg'), Q('poker/poker-7.jpg')],
    cover: Q('poker/poker-6.jpg'),
    layout: 'bento',
    gallery: [
      { src: Q('poker/poker-6.jpg'), caption: 'I was the pocket 10s' },
      { src: Q('poker/poker-8.jpg'), caption: 'University of Waterloo Poker Studies Club tournament' },
      { src: Q('poker/poker-2.jpg') },
      { src: Q('poker/poker-1.jpg') },
      { src: Q('poker/poker-3.jpg') },
      { src: Q('poker/poker-4.jpg'), caption: 'Sequence Holdings Poker Tournament' },
      { src: Q('poker/poker-5.jpg') },
      { src: Q('poker/poker-7.jpg'), caption: 'a huge run at Waterloo' },
    ],
    videos: videosFor('poker', [1, 2, 4]),
  },
  {
    id: 'people',
    piece: 't',
    title: 'FRIENDS',
    sub: 'Quality time is my love language. My dog is a Shiba Inu named Pompom and he is a menace.',
    tags: ['Friends', 'Shiba Inu', 'Pompom', 'Quality Time'],
    placeholder: '🐾',
    // Numbers absent from public/assets/quests/people/ (removed photos, plus 22 which moved
    // to the photography quest). Keep this list in sync when photos are added/removed there.
    images: Array.from({ length: 97 }, (_, i) => i + 1)
      .filter((n) => ![1, 7, 11, 15, 22, 24, 33, 35, 40, 47, 49, 56, 72, 74, 77, 78].includes(n))
      .map((n) => Q(`people/people-${n}.jpg`)),
    cover: Q('people/people-38.jpg'),
    layout: 'polaroid',
  },
  {
    id: 'robotics',
    piece: 's',
    title: 'ROBOTICS',
    sub: 'Mechanical Member of Spark Youth FIRST Robotics Club (2024-2025) in Kanata, ON. Built game pieces for the 2025 DCMP (District Championship).',
    tags: ['FRC', 'Mechanical', 'Autonomous', 'SYRC'],
    placeholder: '🤖',
    images: [ROBOTICS_GALLERY[0].src],
    layout: 'bento',
    gallery: ROBOTICS_GALLERY,
    videos: videosFor('robotics', 1, { 1: 'World record set in Canada' }),
  },
  {
    id: 'photography',
    piece: 'z',
    title: 'PHOTOGRAPHY',
    sub: 'Candid shots, travel photos, and life through a lens. Instagram: @juliann.zhu',
    tags: ['Candid', 'Travel', 'Film'],
    placeholder: '📷',
    images: Array.from({ length: 41 }, (_, i) => Q(`photography/photography-${i + 1}.jpg`)),
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
    // Numbers absent from public/assets/quests/shad/ after cleanup.
    images: Array.from({ length: 55 }, (_, i) => i + 1)
      .filter((n) => ![27, 35, 46].includes(n))
      .map((n) => Q(`shad/shad-${n}.jpg`)),
    cover: Q('shad/shad-7.jpg'),
    layout: 'polaroid',
    videos: videosFor('shad', 4),
  },
  {
    id: 'relay',
    piece: 'l',
    title: 'RELAY FOR LIFE',
    sub: 'Team Captain for Relay for Life (2023-2025). Raised over $700 for cancer research, contributing to a total of $29,000 raised by our community.',
    tags: ['Fundraising', 'Cancer Research', 'Community'],
    placeholder: '🎗️',
    images: Array.from({ length: 6 }, (_, i) => Q(`relay/relay-${[2, 3, 5, 6, 7, 9][i]}.jpg`)),
    cover: Q('relay/relay-4.jpg'),
    layout: 'bento',
    gallery: [
      { src: Q('relay/relay-1.jpg'), caption: 'Bake sale fundraiser' },
      { src: Q('relay/relay-4.jpg'), caption: 'Merivale Relay for Life Event 2024' },
      { src: Q('relay/relay-8.jpg') },
      { src: Q('relay/relay-2.jpg') },
      { src: Q('relay/relay-3.jpg') },
      { src: Q('relay/relay-5.jpg') },
      { src: Q('relay/relay-6.jpg') },
      { src: Q('relay/relay-7.jpg') },
      { src: Q('relay/relay-9.jpg') },
    ],
  },
  {
    id: 'lego',
    piece: 'i',
    title: 'FIRST LEGO LEAGUE',
    sub: 'FIRST LEGO League instructor (2024-2025), introducing kids to STEM through robotics and teaching weekly coding lessons using LEGO SPIKE.',
    tags: ['Instructor', 'STEM', 'LEGO SPIKE'],
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
  display: flex; align-items: center; justify-content: center; font-size:3rem;
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
  font-family: var(--font-pixel); font-size:0.5625rem; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.tj-quest-card:hover .tj-quest-hint { opacity: 1; }

/* detail page slide-in */
@keyframes tj-slide-in-left {
  from { transform: translateX(-24px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
.tj-quest-detail { animation: tj-slide-in-left 240ms var(--ease-snap) both; }

/* ---- Bento collage: justified rows ----
   Photos are packed into full-width rows that all share a height, each photo scaled by its
   own aspect ratio, so nothing is cropped and the top, bottom and sides all stay flat. The
   per-tile widths/heights are computed in JS from each image's measured aspect ratio. */
.tj-bento-tile {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-1);
  background: var(--bg-well);
  padding: 0; border: none; text-align: left; /* reset for <button> video tiles */
}
/* tile is sized to the photo's exact aspect ratio, so cover never actually crops — it just
   soaks up sub-pixel rounding instead of leaving hairline letterbox gaps */
.tj-bento-img { width: 100%; height: 100%; object-fit: cover; display: block; }
/* caption overlays the bottom of the photo so every tile stays exactly image-height, which
   is what keeps the rows aligned — a caption bar below would make captioned tiles taller */
.tj-bento-caption {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;
  padding: 18px 10px 7px;
  font-family: var(--font-mono); font-size:0.6875rem; color: #f3ede0;
  background: linear-gradient(to top, rgba(10,10,18,0.85), rgba(10,10,18,0));
  pointer-events: none;
}
/* video clip tiles mixed into the collage */
.tj-bento-video { cursor: pointer; }
.tj-bento-play {
  position: absolute; inset: 0; z-index: 1; display: flex; align-items: center; justify-content: center;
  background: rgba(10,10,18,0.34); color: #fff; font-size: 2.25rem;
  transition: background 160ms;
}
.tj-bento-video:hover .tj-bento-play { background: rgba(10,10,18,0.12); }
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
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: 0, transition: 'color 140ms', ...style }}>
      <Icon icon="pixelarticons:arrow-left" style={{ fontSize: '0.875rem' }} />
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: c, marginBottom: 6 }}>{'// Side Quest'}</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.375rem', color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{quest.title}</h2>
        </div>
      </div>
      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>{quest.sub}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 40 }}>
        {quest.tags.map((t) => <Tag key={t} piece={quest.piece}>{t}</Tag>)}
      </div>
    </>
  )
}

function StockNote({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bg-well)', border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)' }}>{text}</span>
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
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{'// Video clips'}</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {videos.map((v, i) => (
            <button key={i} onClick={() => setOpenIdx(i)} aria-label={`Play video ${i + 1}`} style={{
              position: 'relative', width: 168, aspectRatio: '16/9', padding: 0, cursor: 'pointer',
              border: '2px solid var(--border-strong)', borderRadius: 'var(--radius-1)', overflow: 'hidden', background: 'var(--bg-well)',
            }}>
              <img src={v.poster} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(10,10,18,0.4)', fontSize: '1.75rem', color: '#fff',
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
            fontSize: '1.125rem', cursor: 'pointer',
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

// ---- Bento: collage tiles in justified rows, captions overlaid on select tiles ----
// Justified-rows packing (Flickr / Google-Photos style): greedily fill each row until the
// height needed to span the full width drops to the target, so every row is full-width and
// its photos share a height — nothing is cropped, and the top, bottom and sides stay flat.
function justifyRows(ratios: number[], containerW: number, targetH: number, gap: number) {
  const rows: { index: number; w: number; h: number }[][] = []
  const push = (idx: number[], h: number) => rows.push(idx.map((i) => ({ index: i, w: h * ratios[i], h })))
  let row: number[] = []
  let sumR = 0
  for (let i = 0; i < ratios.length; i++) {
    row.push(i); sumR += ratios[i]
    // height at which this many photos exactly span the available width
    const h = (containerW - gap * (row.length - 1)) / sumR
    if (h <= targetH) { push(row, h); row = []; sumR = 0 }
  }
  if (row.length) {
    // trailing row: fill the width if that keeps a sane height, otherwise leave the photos
    // at the target height and left-align them (avoids blowing up one or two leftovers)
    const hFill = (containerW - gap * (row.length - 1)) / sumR
    push(row, hFill <= targetH * 1.5 ? hFill : targetH)
  }
  return rows
}

function BentoDetail({ quest, onBack }: { quest: QuestCard; onBack: () => void }) {
  const c = `var(--piece-${quest.piece})`
  const photos = quest.gallery ?? []
  const videos = quest.videos ?? []
  const [openVideo, setOpenVideo] = useState<number | null>(null)

  // Interleave the video clips evenly through the photos so they spread across the rows
  // instead of clumping at the end.
  type Item = { kind: 'photo'; photo: BentoPhoto } | { kind: 'video'; vi: number }
  const items: Item[] = []
  const step = videos.length ? Math.max(1, Math.floor(photos.length / (videos.length + 1))) : 0
  let vi = 0
  photos.forEach((photo, i) => {
    items.push({ kind: 'photo', photo })
    if (step && vi < videos.length && (i + 1) % step === 0) { items.push({ kind: 'video', vi }); vi++ }
  })
  while (vi < videos.length) { items.push({ kind: 'video', vi }); vi++ }

  // Justified rows need every tile's aspect ratio up front. Measure each image as it loads
  // (guessing 3:2 until then), recompute the packing on each new ratio while the collage is
  // held hidden, then fade it in once everything is measured (or a fallback elapses).
  // Measuring before revealing is what stops the rows from reflowing on screen.
  const GAP = 12
  const total = items.length
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(0)
  const ratioRef = useRef<number[]>([])
  if (ratioRef.current.length !== total) ratioRef.current = new Array(total).fill(0)
  const loadedRef = useRef(0)
  const [ready, setReady] = useState(false)
  const [, bump] = useState(0)

  const onMeasure = (i: number, w: number, h: number) => {
    if (ratioRef.current[i] !== 0) return
    ratioRef.current[i] = h > 0 ? w / h : 1.5
    loadedRef.current += 1
    if (loadedRef.current >= total) setReady(true)
    bump((t) => t + 1)
  }
  useEffect(() => { const t = setTimeout(() => setReady(true), 1200); return () => clearTimeout(t) }, [])
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setContainerW(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure); ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const ratios = items.map((_, i) => ratioRef.current[i] || 1.5)
  const targetH = containerW > 0 && containerW < 560 ? 150 : 220
  const rows = containerW > 0 ? justifyRows(ratios, containerW, targetH, GAP) : []

  return (
    <section className="tj-quest-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <BackButton c={c} onBack={onBack} style={{ marginBottom: 32 }} />
      <QuestDetailHeader quest={quest} c={c} />

      <div ref={containerRef} style={{ opacity: ready ? 1 : 0, transition: 'opacity 260ms ease' }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: GAP, marginBottom: GAP }}>
            {row.map(({ index, w, h }) => {
              const item = items[index]
              return item.kind === 'photo' ? (
                <div key={index} className="tj-bento-tile" style={{ width: w, height: h, flex: '0 0 auto' }}>
                  <img src={item.photo.src} alt="" className="tj-bento-img"
                    onLoad={(e) => onMeasure(index, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)} onError={() => onMeasure(index, 3, 2)} />
                  {item.photo.caption && <div className="tj-bento-caption">{'// '}{item.photo.caption}</div>}
                </div>
              ) : (
                <button key={index} type="button" className="tj-bento-tile tj-bento-video" style={{ width: w, height: h, flex: '0 0 auto' }}
                  onClick={() => setOpenVideo(item.vi)} aria-label={`Play video ${item.vi + 1}`}>
                  <img src={videos[item.vi].poster} alt="" className="tj-bento-img"
                    onLoad={(e) => onMeasure(index, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)} onError={() => onMeasure(index, 3, 2)} />
                  <span className="tj-bento-play">▶</span>
                  {videos[item.vi].caption && <div className="tj-bento-caption">{'// '}{videos[item.vi].caption}</div>}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {openVideo !== null && createPortal(
        <div onClick={() => setOpenVideo(null)} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(5,5,9,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <video src={videos[openVideo].src} controls autoPlay style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 4 }} onClick={(e) => e.stopPropagation()} />
          <button onClick={() => setOpenVideo(null)} aria-label="Close video" style={{ position: 'absolute', top: 24, right: 32, width: 40, height: 40, borderRadius: 4, background: 'var(--bg-well)', border: '2px solid var(--border-strong)', color: 'var(--text-strong)', fontSize: '1.125rem', cursor: 'pointer' }}>✕</button>
        </div>,
        document.body
      )}

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
          <span style={{ fontSize: '1.75rem', opacity: 0.35 }}>+</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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
  const c = `var(--piece-${quest.piece})`
  return (
    <section className="tj-quest-detail" style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 72px' }}>
      <BackButton c={c} onBack={onBack} style={{ marginBottom: 32 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
        <Tetromino piece={quest.piece} size={18} />
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: c, marginBottom: 6 }}>{'// Side Quest'}</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.375rem', color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{quest.title}</h2>
        </div>
      </div>

      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.7, marginBottom: 32 }}>{quest.sub}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 40 }}>
        {quest.tags.map((t) => <Tag key={t} piece={quest.piece}>{t}</Tag>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <MediaSlot key={i} src={quest.images[i]} index={i} />
        ))}
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--bg-well)', border: '2px solid var(--border-hairline)', borderRadius: 'var(--radius-1)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-faint)' }}>
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
// Shorter tiles on narrow screens so the stacked title + tile + dots all fit in the visible
// band above the footer/scroll-fade instead of pushing the dots off the bottom edge.
const TILE_H_M = 340
const GAP = 24
const TITLE_W = 300
// The carousel has one extra tile past the last quest — a "cleared" summary card
// that loops back to the start — so anything keying off tile count uses this instead
// of QUESTS.length directly.
const CAROUSEL_LENGTH = QUESTS.length + 1
const TITLE_GUTTER = 40
const HEADER_H = 58
const FOOTER_H = 84
const AUTO_ROTATE_MS = 4000
const JUMP_TRANSITION_MS = 600
const JUMP_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)'
// At/below this container width the title stacks on top of the tiles (so it can never be
// overlapped by them); above it, the title sits on the left with tiles focused just to its
// right. Keyed off the *container* width, not the viewport, since the desktop sidebar eats
// ~300px and a narrow-but-desktop container still needs the stacked layout to breathe.
const NARROW_MAX = 760
// Where tile 0 rests in the wide (title-on-left) layout: right after the title block.
const DESKTOP_PAD = 24 + TITLE_W + TITLE_GUTTER

function QuestCarousel({ onOpen, progressRef, savedIndexRef, autoStoppedRef }: { onOpen: (id: string) => void; progressRef: React.RefObject<number>; savedIndexRef: React.RefObject<number>; autoStoppedRef: React.RefObject<boolean> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef(0)
  // Restore the tile we were last on (survives quest-detail remounts via the parent).
  const [activeIndex, setActiveIndex] = useState(savedIndexRef.current)
  const activeIndexRef = useRef(savedIndexRef.current)
  // Auto-rotate stays on until the user actually drives the carousel themselves
  // (arrow, dot, or swipe) — once that happens it's off for good (persisted across remounts).
  const autoRotateOnRef = useRef(!autoStoppedRef.current)
  const autoIntervalRef = useRef<number | undefined>(undefined)

  // Responsive layout, measured from the container width (see NARROW_MAX). `padLeft` is the
  // track's left padding (tile 0's rest position) and `focusX` is the x where the active tile
  // centers — all the scale/opacity/jump math keys off focusX instead of the viewport centre,
  // so tile 0 is the focused one from the very first frame on every screen size.
  const [isNarrow, setIsNarrow] = useState(false)
  const [padLeft, setPadLeft] = useState(DESKTOP_PAD)
  const isNarrowRef = useRef(false)
  const focusXRef = useRef(DESKTOP_PAD + TILE_W / 2)

  const applyFrame = () => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return
    const maxScroll = Math.max(0, track.scrollWidth - container.clientWidth)
    const p = progressRef.current
    // Narrow layout anchors the tiles to the top of their area (just below the stacked
    // title) so a tile taller than that area can only spill downward — never up into the
    // title text. Desktop keeps them vertically centred.
    const ty = isNarrowRef.current ? '0' : '-50%'
    track.style.transform = `translateY(${ty}) translateX(${-p * maxScroll}px)`

    // Target center in the track's own local layout coordinates (offsetLeft is a
    // static layout value untouched by the track's in-flight CSS transition) rather
    // than getBoundingClientRect (the live mid-slide paint position) — so a jump's
    // new center tile gets full scale/opacity immediately instead of lagging behind
    // until the slide animation finishes painting.
    const focusX = focusXRef.current
    const targetCenter = p * maxScroll + focusX
    let closestIdx = 0
    let closestDist = Infinity
    tileRefs.current.forEach((el, i) => {
      if (!el) return
      const center = el.offsetLeft + el.offsetWidth / 2
      const dist = Math.abs(center - targetCenter)
      const norm = Math.min(1, dist / (container.clientWidth / 2))
      const scale = 1.08 - norm * 0.22
      const opacity = 1 - norm * 0.75
      el.style.transform = `scale(${scale})`
      el.style.opacity = String(Math.max(0.15, opacity))
      if (dist < closestDist) { closestDist = dist; closestIdx = i }
    })
    activeIndexRef.current = closestIdx
    savedIndexRef.current = closestIdx
    setActiveIndex((prev) => (prev === closestIdx ? prev : closestIdx))

    const title = titleRef.current
    if (title) {
      if (isNarrowRef.current) {
        // Stacked on top — the tiles live below it and can never cover it, so it just
        // stays put instead of fading.
        title.style.opacity = '1'
        title.style.pointerEvents = 'auto'
      } else {
        // Title is only readable while the first tile is active — past that it'd sit
        // underneath the tiles that have scrolled into its space, so it fades out.
        const titleOpacity = closestIdx === 0 ? Math.max(0, 1 - p / 0.18) : 0
        title.style.opacity = String(titleOpacity)
        title.style.pointerEvents = titleOpacity < 0.05 ? 'none' : 'auto'
      }
    }
  }

  const scheduleFrame = () => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => { rafRef.current = 0; applyFrame() })
  }

  // Called from every manual navigation path (arrows, dots, touch swipe) — once the
  // user has driven the carousel themselves, auto-rotate stops for good.
  const stopAutoRotate = () => {
    autoRotateOnRef.current = false
    autoStoppedRef.current = true
    if (autoIntervalRef.current !== undefined) {
      window.clearInterval(autoIntervalRef.current)
      autoIntervalRef.current = undefined
    }
  }

  // Measure the container and pick the layout. On resize this also repaints the frame so
  // the track transform tracks the new width.
  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef.current
      if (!container) return
      const w = container.clientWidth
      const narrow = w <= NARROW_MAX
      let pl: number, fx: number
      if (narrow) { fx = w / 2; pl = Math.max(16, fx - TILE_W / 2) }
      else { pl = DESKTOP_PAD; fx = pl + TILE_W / 2 }
      isNarrowRef.current = narrow
      focusXRef.current = fx
      setIsNarrow(narrow)
      setPadLeft(pl)
      scheduleFrame()
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // When the layout switches (or padLeft changes), re-centre the active tile instantly on
  // the new focus point so nothing jumps to a half-off-screen position.
  useLayoutEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    const tile = tileRefs.current[activeIndexRef.current]
    if (container && track && tile) {
      track.style.transition = 'none'
      tileRefs.current.forEach((el) => { if (el) el.style.transition = 'none' })
      const maxScroll = Math.max(1, track.scrollWidth - container.clientWidth)
      const desiredX = (tile.offsetLeft + tile.offsetWidth / 2) - focusXRef.current
      progressRef.current = Math.min(1, Math.max(0, desiredX / maxScroll))
    }
    scheduleFrame()
  }, [padLeft, isNarrow])


  // Touch swipe fallback: horizontal drags move the carousel; vertical drags pass through.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let startX = 0, startY = 0, dragging = false, horizontal = false
    const onStart = (e: TouchEvent) => {
      // Don't hijack taps that land on the dots row (they're their own controls).
      const dots = dotsRef.current
      if (dots && e.touches[0].clientY >= dots.getBoundingClientRect().top) return
      startX = e.touches[0].clientX; startY = e.touches[0].clientY
      dragging = true; horizontal = false
      // A dragging finger should track 1:1 with zero lag — only jumpTo (arrows, dots,
      // auto-rotate) gets the eased slide. If a jump is still animating when the finger
      // lands, adopt the live on-screen position first so the drag picks up smoothly from
      // where the tiles actually are instead of snapping to the jump's target.
      const track = trackRef.current
      if (track) {
        const tf = getComputedStyle(track).transform
        if (tf && tf !== 'none') {
          try {
            const liveX = new DOMMatrixReadOnly(tf).m41
            const maxScroll = Math.max(1, track.scrollWidth - container.clientWidth)
            progressRef.current = Math.min(1, Math.max(0, -liveX / maxScroll))
          } catch { /* transform not parseable — keep current progress */ }
        }
        track.style.transition = 'none'
      }
      tileRefs.current.forEach((el) => { if (el) el.style.transition = 'none' })
      applyFrame()
    }
    const onMove = (e: TouchEvent) => {
      if (!dragging) return
      const dx = e.touches[0].clientX - startX
      const dy = e.touches[0].clientY - startY
      if (!horizontal && Math.abs(dx) > Math.abs(dy) + 6) { horizontal = true; stopAutoRotate() }
      if (!horizontal) return
      const atStart = progressRef.current <= 0
      const atEnd = progressRef.current >= 1
      if ((atStart && dx > 0) || (atEnd && dx < 0)) { dragging = false; return }
      e.preventDefault()
      // 1:1 tracking: convert the finger's pixel delta into progress using the
      // track's actual scrollable range, not a fixed constant — otherwise the
      // tiles move faster or slower than the finger depending on track length.
      const track = trackRef.current
      const maxScroll = track ? Math.max(1, track.scrollWidth - container.clientWidth) : 1
      progressRef.current = Math.min(1, Math.max(0, progressRef.current - dx / maxScroll))
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
    // Arrows, dots, and auto-rotate all land here — ease the slide over instead of
    // snapping straight to the new position, like the old scroll-driven motion did.
    // Tiles get the same duration/easing on their scale+opacity so the "grow into
    // center / shrink away" happens in lockstep with the slide, not as a separate snap.
    track.style.transition = `transform ${JUMP_TRANSITION_MS}ms ${JUMP_EASING}`
    tileRefs.current.forEach((el) => {
      if (el) el.style.transition = `transform ${JUMP_TRANSITION_MS}ms ${JUMP_EASING}, opacity ${JUMP_TRANSITION_MS}ms ${JUMP_EASING}`
    })
    const maxScroll = Math.max(1, track.scrollWidth - container.clientWidth)
    const tileCenter = tile.offsetLeft + tile.offsetWidth / 2
    const desiredX = tileCenter - focusXRef.current
    progressRef.current = Math.min(1, Math.max(0, desiredX / maxScroll))
    scheduleFrame()
  }

  const goPrev = () => { stopAutoRotate(); jumpTo(Math.max(0, activeIndexRef.current - 1)) }
  const goNext = () => { stopAutoRotate(); jumpTo(Math.min(CAROUSEL_LENGTH - 1, activeIndexRef.current + 1)) }

  // Auto-rotate: once the carousel scrolls into view, advance one tile every 4s —
  // wrapping back to the start at the end — until the user takes the wheel themselves.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && autoRotateOnRef.current) {
        if (autoIntervalRef.current === undefined) {
          autoIntervalRef.current = window.setInterval(() => {
            jumpTo((activeIndexRef.current + 1) % CAROUSEL_LENGTH)
          }, AUTO_ROTATE_MS)
        }
      } else if (autoIntervalRef.current !== undefined) {
        window.clearInterval(autoIntervalRef.current)
        autoIntervalRef.current = undefined
      }
    }, { threshold: 0.4 })
    io.observe(container)
    return () => {
      io.disconnect()
      if (autoIntervalRef.current !== undefined) {
        window.clearInterval(autoIntervalRef.current)
        autoIntervalRef.current = undefined
      }
    }
  }, [])

  const tileH = isNarrow ? TILE_H_M : TILE_H
  // Fixed height for the narrow tile area: the tile plus its 28px top offset and a little
  // room for the focused tile's scale growth, so the dots row that follows sits right under
  // the tile (not pinned to the bottom of a flex-1 filler).
  const narrowTrackH = TILE_H_M + 46

  return (
    <div ref={containerRef} className="tj-quest-carousel" style={{
      position: 'relative', height: `calc(100vh - ${HEADER_H + FOOTER_H}px)`, overflow: 'hidden',
      ...(isNarrow ? { display: 'flex', flexDirection: 'column' } : null),
    }}>
      {/* Desktop: title floats on the left, vertically centred, and fades as you scroll past
          the first tile. Narrow: it stacks on top as a static header so tiles can't overlap it. */}
      <div ref={titleRef} style={isNarrow ? {
        flexShrink: 0, zIndex: 1, width: '100%', maxWidth: 520, margin: '0 auto', padding: '20px 16px 6px', textAlign: 'center',
      } : {
        position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', width: TITLE_W, height: TILE_H, zIndex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'opacity 240ms',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--piece-j)' }}>{'// Beyond the code'}</div>
        <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.625rem', color: 'var(--text-strong)', margin: '14px 0 0', textTransform: 'uppercase' }}>Side Quests</h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 16, ...(isNarrow ? { maxWidth: 440, margin: '12px auto 0' } : null) }}>
          {isNarrow
            ? 'Passion projects and creative experiments from my life outside the terminal. Use the arrows to explore.'
            : 'Every developer needs a break. This space is dedicated to the passion projects, creative experiments, and random pieces that make up my life outside the terminal. Use the arrows to explore.'}
        </p>
      </div>

      {/* On narrow screens this wrapper is a fixed-height band that holds the tiles (anchored to
          its top so they never rise into the title); overflow:hidden clips the focused tile's
          scale growth, and because it isn't a flex-1 filler the dots row sits directly beneath it
          rather than at the bottom of the carousel. On desktop it collapses (display:contents) so
          the track positions against the container as before. */}
      <div style={isNarrow ? { position: 'relative', flexShrink: 0, height: narrowTrackH, overflow: 'hidden' } : { display: 'contents' }}>
      {/* 28px top offset on narrow: ~12px of it is the visible gap below the title, the
          other ~16px absorbs the focused tile's scale(1.08) growing its top edge upward so
          the accent bar can't reach back into the title text. */}
      <div ref={trackRef} style={{ position: 'absolute', top: isNarrow ? 28 : '50%', left: 0, transform: isNarrow ? 'translateY(0)' : 'translateY(-50%)', display: 'flex', gap: GAP, paddingLeft: padLeft, paddingRight: '50vw', willChange: 'transform' }}>
        {QUESTS.map((q, i) => {
          const coverSrc = q.cover ?? q.images[0]
          return (
          <div key={q.id} ref={(el) => { tileRefs.current[i] = el }} className="tj-quest-card" onClick={() => onOpen(q.id)}
            style={{ width: TILE_W, height: tileH, flexShrink: 0 }}>
            <Card accent={q.piece} accentBar style={{ display: 'flex', flexDirection: 'column', height: '100%', userSelect: 'none' }}>
              <div className="tj-quest-media">
                {coverSrc && <img src={coverSrc} alt={q.title} className="tj-quest-img" />}
                {!coverSrc && <span style={{ fontSize: '3rem' }}>{q.placeholder}</span>}
                <div className="tj-quest-hint">Click to explore</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <Tetromino piece={q.piece} size={11} />
                <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8125rem', color: 'var(--text-strong)', margin: 0, textTransform: 'uppercase' }}>{q.title}</h3>
              </div>
              <p style={{
                fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 14px', lineHeight: 1.55, flex: 1,
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{q.sub}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {q.tags.map((t) => <Tag key={t} piece={q.piece}>{t}</Tag>)}
              </div>
            </Card>
          </div>
          )
        })}

        {/* Final "cleared" tile — not a real quest, just a loop-back summary card */}
        <div ref={(el) => { tileRefs.current[QUESTS.length] = el }}
          style={{ width: TILE_W, height: tileH, flexShrink: 0 }}>
          <Card accent="s" accentBar style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 18, height: '100%', userSelect: 'none', padding: '32px 24px' }}>
            <Tetromino piece="s" size={13} bob />
            <div>
              <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.9375rem', color: 'var(--piece-s)', margin: 0, textTransform: 'uppercase', lineHeight: 1.5 }}>Quests Cleared!</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '14px 0 0', lineHeight: 1.6 }}>
                Congratulations, that's the whole board! Thanks for exploring. Run it back?
              </p>
            </div>
            <Button variant="success" size="sm" leftIcon={<Icon icon="pixelarticons:reload" />} onClick={() => { stopAutoRotate(); jumpTo(0) }}>
              Back to Start
            </Button>
          </Card>
        </div>
      </div>

      {activeIndex > 0 && (
        <IconButton size="md" variant="ghost" label="Previous quest" onClick={goPrev}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.85)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.6)' }}
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(5,5,9,0.6)', border: '2px solid var(--border-strong)', color: 'var(--text-strong)', backdropFilter: 'blur(4px)' }}>
          <Icon icon="pixelarticons:chevron-left" />
        </IconButton>
      )}
      {activeIndex < CAROUSEL_LENGTH - 1 && (
        <IconButton size="md" variant="ghost" label="Next quest" onClick={goNext}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.85)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'rgba(5,5,9,0.6)' }}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(5,5,9,0.6)', border: '2px solid var(--border-strong)', color: 'var(--text-strong)', backdropFilter: 'blur(4px)' }}>
          <Icon icon="pixelarticons:chevron-right" />
        </IconButton>
      )}
      </div>

      {/* Dots live outside the tile wrapper: on narrow screens they're a static flex row that
          claims its own space below the tiles (so a tall tile can never sit under them); on
          desktop they float at the bottom of the carousel as before. */}
      <div ref={dotsRef} style={isNarrow
        ? { flexShrink: 0, display: 'flex', justifyContent: 'center', gap: 8, padding: '14px 0 6px', zIndex: 2 }
        : { position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 2 }}>
        {QUESTS.map((q, i) => (
          <button key={q.id} onClick={() => { stopAutoRotate(); jumpTo(i) }} aria-label={`Go to ${q.title}`}
            style={{
              width: i === activeIndex ? 20 : 7, height: 7, borderRadius: 4, padding: 0, border: 'none', cursor: 'pointer',
              background: i === activeIndex ? `var(--piece-${q.piece})` : 'var(--border-strong)',
              transition: 'width 200ms, background 200ms',
            }} />
        ))}
        <button onClick={() => { stopAutoRotate(); jumpTo(QUESTS.length) }} aria-label="Go to quests cleared"
          style={{
            width: activeIndex === QUESTS.length ? 20 : 7, height: 7, borderRadius: 4, padding: 0, border: 'none', cursor: 'pointer',
            background: activeIndex === QUESTS.length ? 'var(--piece-s)' : 'var(--border-strong)',
            transition: 'width 200ms, background 200ms',
          }} />
      </div>
    </div>
  )
}

// ---- Grid view ----
export function SideQuests({ resetSignal }: { resetSignal?: number } = {}) {
  ensureCSS()
  const [openId, setOpenId] = useState<string | null>(null)
  // Both live in the parent (not inside QuestCarousel) so they survive the carousel
  // unmounting while a quest detail page is open — the carousel restores this scroll
  // position on remount instead of snapping back to the first tile. progressRef is the
  // fine-grained scroll offset; savedIndexRef is the tile the carousel re-centres on.
  const progressRef = useRef(0)
  const savedIndexRef = useRef(0)
  // Once the user has driven the carousel (swipe/arrow/dot), auto-rotate stays off across
  // remounts too — otherwise returning from a quest detail would let it drift off the tile
  // they left on.
  const autoStoppedRef = useRef(false)

  // Bumped by App.tsx when "Quests" is clicked again while already on this section —
  // closes whatever quest detail is open so the full tile grid is visible again.
  useEffect(() => { setOpenId(null) }, [resetSignal])

  // Opening a quest from partway down the carousel would otherwise land on its detail
  // page still scrolled to that position — snap back to the top of it. All QuestDetail
  // layout variants (bento/marquee/polaroid/default) share this class.
  useEffect(() => {
    if (openId) document.querySelector('.tj-quest-detail')?.scrollIntoView({ block: 'start' })
  }, [openId])

  // Likewise, scrolling down within a quest detail page and then hitting Back would
  // otherwise leave the scroll position wherever it was — which can land past the
  // carousel, in Now/Contact. Only fires on an actual detail-to-carousel transition,
  // not on first mount (prevOpenId starts null too, so the condition below stays false).
  const prevOpenId = useRef<string | null>(null)
  useEffect(() => {
    if (prevOpenId.current && !openId) document.querySelector('.tj-quest-carousel')?.scrollIntoView({ block: 'start' })
    prevOpenId.current = openId
  }, [openId])

  if (openId) {
    const quest = QUESTS.find(q => q.id === openId)!
    return <QuestDetail quest={quest} onBack={() => setOpenId(null)} />
  }

  return <QuestCarousel onOpen={setOpenId} progressRef={progressRef} savedIndexRef={savedIndexRef} autoStoppedRef={autoStoppedRef} />
}
