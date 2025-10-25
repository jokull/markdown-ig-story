#!/usr/bin/env node

import { program } from "commander";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, resolve } from "path";
import { MarkdownRenderer } from "./renderer.js";

async function readStdin(): Promise<string> {
	return new Promise((resolve, reject) => {
		let data = "";

		process.stdin.setEncoding("utf-8");

		process.stdin.on("data", (chunk) => {
			data += chunk;
		});

		process.stdin.on("end", () => {
			resolve(data);
		});

		process.stdin.on("error", (err) => {
			reject(err);
		});
	});
}

async function main() {
	program
		.name("markdown-ig-story")
		.description("Convert markdown to Instagram story-sized PNG images (1080x1920px)")
		.option("-o, --output <directory>", "Output directory for PNG files", process.cwd())
		.option("-p, --prefix <prefix>", "Filename prefix for output images", "story")
		.parse(process.argv);

	const options = program.opts();
	const outputDir = resolve(options.output);

	// Create output directory if it doesn't exist
	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true });
	}

	try {
		console.error("📖 Reading markdown from stdin...");
		const markdown = await readStdin();

		if (!markdown.trim()) {
			console.error("❌ No markdown content provided");
			process.exit(1);
		}

		console.error("📸 Rendering markdown to images...");
		const renderer = new MarkdownRenderer();
		const images = await renderer.renderMarkdown(markdown);

		console.error(`✂️  Generated ${images.length} image(s)`);

		// Save images
		for (let i = 0; i < images.length; i++) {
			const paddedIndex = String(i + 1).padStart(2, "0");
			const filename = `${options.prefix}-${paddedIndex}.png`;
			const filepath = join(outputDir, filename);

			writeFileSync(filepath, images[i]);
			console.error(`💾 Saved: ${filename}`);
		}

		console.error(`✅ Done! Images saved to: ${outputDir}`);
	} catch (error) {
		console.error("❌ Error:", error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}

main();
