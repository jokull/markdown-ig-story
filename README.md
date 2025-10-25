# markdown-ig-story

Convert markdown to Instagram story-sized PNG images (1080x1920px) perfect for sharing on social media.

## Requirements

- Node.js
- [Pandoc](https://pandoc.org/installing.html) - For markdown to PDF conversion
- [Weasyprint](https://weasyprint.org/) - PDF engine for pandoc
- [Poppler](https://poppler.freedesktop.org/) - For PDF to image conversion (provides `pdftoppm`)

On macOS, you can install all requirements with Homebrew:
```bash
brew install pandoc weasyprint poppler
```

## Installation

```bash
npm install
npm run build
```

## Usage

Pipe markdown content to stdin:

```bash
cat example.md | npm start

# Or with options:
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

## Development

```bash
# Build TypeScript
npm run build

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
