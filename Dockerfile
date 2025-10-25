# Use Debian-based image for better package availability
FROM debian:bookworm-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
	# Bun dependencies
	curl \
	unzip \
	# Pandoc
	pandoc \
	# Weasyprint dependencies
	python3 \
	python3-pip \
	python3-cffi \
	python3-brotli \
	libpango-1.0-0 \
	libpangoft2-1.0-0 \
	libharfbuzz0b \
	libffi-dev \
	libjpeg62-turbo \
	libopenjp2-7 \
	# Poppler (provides pdftoppm)
	poppler-utils \
	&& rm -rf /var/lib/apt/lists/*

# Install Weasyprint
RUN pip3 install --no-cache-dir --break-system-packages weasyprint

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* bunfig.toml* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["bun", "run", "dev"]
