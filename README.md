# ShotKit

Screenshot beautifier. Paste a screenshot, style it, copy it back.

## Features

- Paste (Ctrl+V), drag-drop, or file upload
- Rounded corners, shadow, 3D rotation/tilt
- macOS / Windows browser frames
- Gradient, solid, or transparent backgrounds
- Adjustable padding and scale
- Copy to clipboard or download as PNG (2x resolution)
- Right-click image to quick-copy

## Setup

```bash
bun install
bun dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun run build` | Type-check + production build |
| `bun run lint` | Lint with Biome |
| `bun run format` | Format with Biome |
| `bun run knip` | Check for unused code/deps |

## Stack

React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand, html-to-image
