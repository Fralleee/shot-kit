# ShotKit

Screenshot beautifier. Paste a screenshot, style it, and copy it back.

<img width="1280" height="768" alt="image" src="https://github.com/user-attachments/assets/f8f520eb-fd29-4b7a-a229-4d9f38099e08" />


## Features

- Paste (Ctrl+V), drag-drop, or file upload
- Rounded corners, shadow, 3D rotation/tilt
- macOS / Windows browser frames
- Gradient, solid, or transparent backgrounds
- Adjustable padding and scale
- Copy to clipboard or download as PNG (2x resolution)
- Right-click the image to quickly copy

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
