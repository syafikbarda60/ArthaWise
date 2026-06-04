FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy models (Assuming saved_models is one directory above ai_service, but we must copy it inside docker)
# To make it work in HF spaces, we must restructure or just copy the models.
# Since HF Space builds from the folder we upload, it's better to just upload ai_service and saved_models.
# For simplicity, we can tell the user how to upload the files.
COPY . .

# Expose port
EXPOSE 7860

# Run FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
