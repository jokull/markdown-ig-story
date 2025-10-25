import { useState } from "react";
import heroImage from "../public/hero-image.png";

const SAMPLE_MARKDOWN = `# My Instagram Story

This is a sample story with **bold text** and *italic text*.

## Features

- Clean typography
- Instagram story dimensions (1080x1920px)
- Automatic page splitting
- Beautiful styling

> "Design is not just what it looks like and feels like. Design is how it works."
> — Steve Jobs

Try editing this markdown or write your own!`;

interface PreviewImage {
	index: number;
	dataUrl: string;
}

export function App() {
	const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
	const [previewLoading, setPreviewLoading] = useState(false);
	const [downloadLoading, setDownloadLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

	const handleDownload = async () => {
		setDownloadLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/convert", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ markdown }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to convert markdown");
			}

			// Download the zip file
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "instagram-stories.zip";
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Conversion error:", err);
		} finally {
			setDownloadLoading(false);
		}
	};

	const handlePreview = async () => {
		setPreviewLoading(true);
		setError(null);
		setPreviewImages([]);

		try {
			const response = await fetch("/api/preview", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ markdown }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to convert markdown");
			}

			const data = await response.json();
			setPreviewImages(data.images);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			console.error("Conversion error:", err);
		} finally {
			setPreviewLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
			<div className="container mx-auto max-w-6xl px-4 py-8">
				{/* Hero Section */}
				<div className="mb-12 overflow-hidden">
					<div className="grid items-center gap-8 md:grid-cols-2">
						{/* Text Content */}
						<div>
							<h1 className="mb-4 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
								Markdown → Instagram Stories
							</h1>
							<p className="mb-6 text-lg md:text-xl">
								Transform your markdown into stunning Instagram story images in seconds. Perfect for
								content creators, bloggers, and social media managers.
							</p>
							<div className="flex flex-wrap gap-4 text-sm">
								<div className="flex items-center gap-2">
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span>1080×1920px Perfect Fit</span>
								</div>
								<div className="flex items-center gap-2">
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span>Auto Page Splitting</span>
								</div>
								<div className="flex items-center gap-2">
									<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									<span>Instant Preview</span>
								</div>
							</div>
						</div>

						{/* Image */}
						<div className="relative aspect-3/2 md:aspect-auto">
							<img
								src={heroImage}
								alt="Markdown to Instagram Stories Preview"
								className="h-full w-full object-cover"
							/>
						</div>
					</div>
				</div>

				{/* Main Form */}
				<div className="space-y-6">
					<div className="rounded-2xl bg-white p-8 shadow-xl">
						<label htmlFor="markdown" className="mb-3 block text-lg font-semibold text-gray-900">
							Enter your markdown:
						</label>
						<textarea
							id="markdown"
							value={markdown}
							onChange={(e) => setMarkdown(e.target.value)}
							className="h-96 w-full resize-none rounded-xl border-2 border-gray-200 p-4 font-mono text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500"
							placeholder="# Your Story Title&#10;&#10;Write your markdown here..."
							required
						/>

						{error && (
							<div className="mt-4 rounded border-l-4 border-red-500 bg-red-50 p-4">
								<p className="font-medium text-red-700">{error}</p>
							</div>
						)}

						<div className="mt-6 flex items-center justify-between">
							<div className="text-sm text-gray-600">
								<span className="font-medium">Dimensions:</span> 1080×1920px (IG Story format)
							</div>
							<div className="flex gap-3">
								<button
									type="button"
									onClick={handlePreview}
									disabled={previewLoading || downloadLoading || !markdown.trim()}
									className="transform rounded-xl bg-linear-to-r from-green-600 to-teal-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-green-700 hover:to-teal-700 focus:ring-4 focus:ring-green-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{previewLoading ? (
										<span className="flex items-center">
											<svg
												className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Generating...
										</span>
									) : (
										"Preview"
									)}
								</button>
								<button
									type="button"
									onClick={handleDownload}
									disabled={previewLoading || downloadLoading || !markdown.trim()}
									className="transform rounded-xl bg-linear-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{downloadLoading ? (
										<span className="flex items-center">
											<svg
												className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Downloading...
										</span>
									) : (
										"Download ZIP"
									)}
								</button>
							</div>
						</div>
					</div>

					{/* Preview Section */}
					{previewImages.length > 0 && (
						<div className="rounded-2xl bg-white p-8 shadow-xl">
							<h2 className="mb-6 text-2xl font-bold text-gray-900">
								Preview ({previewImages.length} image{previewImages.length !== 1 ? "s" : ""})
							</h2>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{previewImages.map((image) => (
									<div key={image.index} className="space-y-3">
										<div className="relative aspect-9/16 overflow-hidden rounded-xl bg-gray-100 shadow-lg">
											<img
												src={image.dataUrl}
												alt={`Story ${image.index}`}
												className="h-full w-full object-contain"
											/>
											<div className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white">
												{image.index}
											</div>
										</div>
										<a
											href={image.dataUrl}
											download={`story-${String(image.index).padStart(2, "0")}.png`}
											className="block rounded-lg bg-gray-100 px-4 py-2 text-center font-medium text-gray-700 transition-colors hover:bg-gray-200"
										>
											Download #{image.index}
										</a>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Info Cards */}
				<div className="mt-12 grid gap-6 md:grid-cols-3">
					<div className="rounded-xl bg-white p-6 shadow-lg">
						<div className="mb-3 text-purple-600">
							<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<h3 className="mb-2 text-lg font-semibold text-gray-900">Write Markdown</h3>
						<p className="text-gray-600">
							Use familiar markdown syntax with headings, lists, bold, italic, and more.
						</p>
					</div>

					<div className="rounded-xl bg-white p-6 shadow-lg">
						<div className="mb-3 text-blue-600">
							<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h3 className="mb-2 text-lg font-semibold text-gray-900">Auto-Split Pages</h3>
						<p className="text-gray-600">
							Content automatically splits into multiple story-sized images at natural break points.
						</p>
					</div>

					<div className="rounded-xl bg-white p-6 shadow-lg">
						<div className="mb-3 text-green-600">
							<svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
						</div>
						<h3 className="mb-2 text-lg font-semibold text-gray-900">Download as ZIP</h3>
						<p className="text-gray-600">
							Get all your story images packaged in a convenient ZIP file ready to upload.
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-12 text-center text-gray-600">
					<p>
						Made with ❤️ using{" "}
						<a
							href="https://bun.sh"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-purple-600 hover:text-purple-700"
						>
							Bun
						</a>
						,{" "}
						<a
							href="https://pandoc.org"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-purple-600 hover:text-purple-700"
						>
							Pandoc
						</a>
						{" & "}
						<a
							href="https://weasyprint.org"
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-purple-600 hover:text-purple-700"
						>
							Weasyprint
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
