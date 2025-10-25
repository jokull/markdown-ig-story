import { serve } from "bun";
import { MarkdownRenderer } from "./src/renderer";
import index from "./index.html";

// Simple zip creation using adm-zip
async function createZip(images: Buffer[]): Promise<Buffer> {
	const AdmZip = (await import("adm-zip")).default;
	const zip = new AdmZip();

	for (let i = 0; i < images.length; i++) {
		const paddedIndex = String(i + 1).padStart(2, "0");
		const filename = `story-${paddedIndex}.png`;

		const buffer = images[i];

		// Validate buffer exists and has data
		if (!buffer || buffer.length === 0) {
			console.error(`Invalid buffer at index ${i}`);
			throw new Error(`Image ${i} has invalid buffer data`);
		}

		// Add buffer directly to zip
		zip.addFile(filename, buffer);
	}

	// Get the zip as a Buffer
	return zip.toBuffer();
}

const server = serve({
	routes: {
		"/": index,

		"/api/convert": {
			async POST(req) {
				try {
					const { markdown } = await req.json();

					if (!markdown || !markdown.trim()) {
						return Response.json({ error: "No markdown content provided" }, { status: 400 });
					}

					console.log("Converting markdown to images...");
					const renderer = new MarkdownRenderer();
					const images = await renderer.renderMarkdown(markdown);

					console.log(`Generated ${images.length} image(s)`);

					// Create zip file
					const zipData = await createZip(images);

					// Return zip file
					return new Response(zipData, {
						headers: {
							"Content-Type": "application/zip",
							"Content-Disposition": "attachment; filename=instagram-stories.zip",
						},
					});
				} catch (error) {
					console.error("Error converting markdown:", error);
					return Response.json(
						{
							error: "Failed to convert markdown",
							details: error instanceof Error ? error.message : String(error),
						},
						{ status: 500 }
					);
				}
			},
		},

		"/api/preview": {
			async POST(req) {
				try {
					const { markdown } = await req.json();

					if (!markdown || !markdown.trim()) {
						return Response.json({ error: "No markdown content provided" }, { status: 400 });
					}

					console.log("Converting markdown to images for preview...");
					const renderer = new MarkdownRenderer();
					const images = await renderer.renderMarkdown(markdown);

					console.log(`Generated ${images.length} image(s) for preview`);

					// Convert images to base64 data URLs
					const imageUrls = images.map((buffer, index) => ({
						index: index + 1,
						dataUrl: `data:image/png;base64,${buffer.toString("base64")}`,
					}));

					return Response.json({ images: imageUrls });
				} catch (error) {
					console.error("Error converting markdown:", error);
					return Response.json(
						{
							error: "Failed to convert markdown",
							details: error instanceof Error ? error.message : String(error),
						},
						{ status: 500 }
					);
				}
			},
		},
	},

	development: {
		hmr: true,
		console: true,
	},

	fetch(req) {
		return new Response("Not Found", { status: 404 });
	},
});

console.log(`🚀 Server running on ${server.url}`);
