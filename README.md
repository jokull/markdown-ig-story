# markdown-ig-story

Convert markdown to Instagram story-sized PNG images (1080x1920px) perfect for sharing on social media.

Includes both a **web UI** and a **CLI tool**.

## Requirements

- [Bun](https://bun.sh) (for web UI) or Node.js (for CLI only)
- [Pandoc](https://pandoc.org/installing.html) - For markdown to PDF conversion
- [Weasyprint](https://weasyprint.org/) - PDF engine for pandoc
- [Poppler](https://poppler.freedesktop.org/) - For PDF to image conversion (provides `pdftoppm`)

On macOS, you can install all requirements with Homebrew:

```bash
brew install bun pandoc weasyprint poppler
```

## Installation

```bash
bun install
# or
npm install
```

## Usage

### Web UI (Recommended)

Start the web server:

```bash
bun run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

Features:

- 🎨 Beautiful, modern interface
- 📝 Live markdown editing
- 📦 Downloads ZIP file with all images
- 🔄 Hot reloading during development

### CLI

Build and use the command-line tool:

```bash
npm run build:cli
cat example.md | npm start -- --output ./output --prefix my-story
```

## Options

- `-o, --output <directory>` - Output directory for PNG files (default: current directory)
- `-p, --prefix <prefix>` - Filename prefix for output images (default: "story")

## How it works

1. Takes markdown from stdin
2. Converts markdown to styled PDF using Pandoc + Weasyprint with Instagram story dimensions (1080x1920px)
3. PDF engine naturally handles page breaks at appropriate content boundaries
4. Each PDF page is converted to a PNG image using `pdftoppm`
5. Saves as numbered PNG files (story-01.png, story-02.png, etc.)

## Features

- ✅ Automatic content splitting for long markdown
- ✅ Clean, readable default styling
- ✅ Support for headings, paragraphs, lists, blockquotes, and code blocks
- ✅ Optimized for mobile viewing
- ✅ Simple CLI interface

## Styling

The tool uses a default CSS stylesheet optimized for social media consumption. Font sizes, spacing, and colors are carefully chosen for readability on mobile devices.

## Project Structure

```
markdown-ig-story/
├── src/              # Core library (CLI + shared code)
│   ├── index.ts      # CLI entry point
│   ├── renderer.ts   # Markdown → Image converter
│   └── styles.css    # Instagram story CSS styling
├── web/              # Web UI frontend (React)
│   ├── App.tsx       # Main React component
│   ├── main.tsx      # React entry point
│   └── styles.css    # Tailwind CSS
├── public/           # Static assets
│   └── index.html    # HTML template
├── server.ts         # Bun fullstack server
├── bunfig.toml       # Bun config (Tailwind plugin)
└── package.json      # Dependencies and scripts
```

## Development

```bash
# Start web UI dev server
bun run dev

# Build CLI tool
npm run build:cli

# Type check
npm run typecheck

# Format code
npm run format

# Lint
npm run lint:fix
```

## Limitations

- Tables and images in markdown are not supported
- Custom styling/theming is not available in this version
- Output is fixed to 1080x1920px (Instagram story format)

## Example

```bash
echo "# My Story

This is a paragraph with **bold** text.

## Subsection

- Item 1
- Item 2
- Item 3

> A quote

Some code: \`const x = 42\`
" | npm start -- --output ./stories --prefix my-blog
```

This would create `my-blog-01.png`, `my-blog-02.png`, etc. in the `./stories` directory.
