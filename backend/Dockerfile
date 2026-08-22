FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app source
COPY . .

# Create directory for SQLite DB persistence
RUN mkdir -p /data

EXPOSE 8080

CMD ["gunicorn", "app:create_app()", "--bind", "0.0.0.0:8080", "--workers", "2", "--timeout", "120"]
