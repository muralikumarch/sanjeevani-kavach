# Optimize container size utilizing slim Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements directly, leveraging Docker caching for faster zero-downtime rolling deploys
COPY requirements.txt .

# Install production dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application payload
COPY . .

# Force unbuffered output for standard Cloud Run logging integration
ENV PYTHONUNBUFFERED=1

# Expose strict port required by GCP
EXPOSE 8080

# Spin up production WSGI Server (Gunicorn) with multiple workers mapping to heavy vision loads
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "3", "--threads", "8", "--timeout", "0", "main:app"]
