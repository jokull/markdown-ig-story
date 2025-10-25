import { readFileSync, writeFileSync, mkdtempSync, rmSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execSync } from "child_process";
import { tmpdir } from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Instagram story dimensions at 96 DPI
const DPI = 96;

export class MarkdownRenderer {
  private styles: string;

  constructor() {
    // Load CSS styles
    this.styles = readFileSync(join(__dirname, "styles.css"), "utf-8");
  }

  async renderMarkdown(markdown: string): Promise<Buffer[]> {
    // Create a temporary directory for processing
    const tempDir = mkdtempSync(join(tmpdir(), "markdown-ig-"));
    const inputFile = join(tempDir, "input.md");
    const pdfFile = join(tempDir, "output.pdf");
    const cssFile = join(tempDir, "styles.css");

    try {
      // Write markdown and CSS to temp files
      writeFileSync(inputFile, markdown, "utf-8");
      writeFileSync(cssFile, this.styles, "utf-8");

      // Generate PDF using pandoc with custom page size
      // Using weasyprint engine (CSS-based layout)
      const pandocCmd = [
        "pandoc",
        `"${inputFile}"`,
        "--from=markdown",
        "--to=html5",
        `--css="${cssFile}"`,
        "--pdf-engine=weasyprint",
        `--output="${pdfFile}"`
      ].join(" ");

      execSync(pandocCmd, { encoding: "utf-8" });

      // Convert PDF pages to PNG using pdftoppm
      const outputPrefix = join(tempDir, "page");
      execSync(`pdftoppm -png -r ${DPI} "${pdfFile}" "${outputPrefix}"`, {
        encoding: "utf-8",
      });

      // Read all generated PNG files
      const files = readdirSync(tempDir)
        .filter((f) => f.startsWith("page") && f.endsWith(".png"))
        .sort();

      const images: Buffer[] = [];
      for (const file of files) {
        const imagePath = join(tempDir, file);
        images.push(readFileSync(imagePath));
      }

      return images;
    } finally {
      // Clean up temp directory
      rmSync(tempDir, { recursive: true, force: true });
    }
  }
}
