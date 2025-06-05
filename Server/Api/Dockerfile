# Base image
FROM node:18-alpine as base

# Install system dependencies including Tesseract and Leptonica
RUN apk update && \
    apk add --no-cache \
    tesseract-ocr \
    tesseract-ocr-data-heb \
    tesseract-ocr-data-eng \
    tesseract-ocr-data-ara \
    leptonica-dev \
    pkgconfig \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Debug: Check what Leptonica files are available
RUN echo "=== Checking Leptonica installation ===" && \
    find /usr -name "*leptonica*" -type f 2>/dev/null | head -10 && \
    echo "=== Checking lib directories ===" && \
    ls -la /usr/lib/ | grep lept || echo "No leptonica in /usr/lib/" && \
    ls -la /usr/local/lib/ | grep lept || echo "No leptonica in /usr/local/lib/" && \
    echo "=== End debug info ==="

# Create symbolic links for leptonica (Alpine specific)
RUN LEPTONICA_LIB=$(find /usr -name "libleptonica.so*" -type f | head -1) && \
    if [ -n "$LEPTONICA_LIB" ]; then \
        echo "Found leptonica at: $LEPTONICA_LIB"; \
        mkdir -p /usr/lib/x86_64-linux-gnu /usr/local/lib; \
        ln -sf "$LEPTONICA_LIB" /usr/lib/libleptonica-1.82.0.so; \
        ln -sf "$LEPTONICA_LIB" /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so; \
        ln -sf "$LEPTONICA_LIB" /usr/local/lib/libleptonica-1.82.0.so; \
    else \
        echo "ERROR: libleptonica not found! Installing from source..."; \
        apk add --no-cache wget cmake && \
        cd /tmp && \
        wget https://github.com/DanBloomberg/leptonica/releases/download/1.82.0/leptonica-1.82.0.tar.gz && \
        tar -xzf leptonica-1.82.0.tar.gz && \
        cd leptonica-1.82.0 && \
        ./configure --prefix=/usr/local && \
        make && make install && \
        ldconfig /usr/local/lib && \
        cd / && rm -rf /tmp/leptonica-1.82.0*; \
    fi

# Set library paths
ENV LD_LIBRARY_PATH=/usr/local/lib:/usr/lib:$LD_LIBRARY_PATH
ENV PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine as production

# Install runtime dependencies
RUN apk add --no-cache \
    tesseract-ocr \
    tesseract-ocr-data-heb \
    tesseract-ocr-data-eng \
    tesseract-ocr-data-ara \
    leptonica

# Copy built application
WORKDIR /app
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Copy leptonica libraries if they were built from source
COPY --from=base /usr/local/lib/libleptonica* /usr/local/lib/ 2>/dev/null || true

# Set library paths
ENV LD_LIBRARY_PATH=/usr/local/lib:/usr/lib:$LD_LIBRARY_PATH

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthCheck.js || exit 1

# Start the application
CMD ["npm", "start"]