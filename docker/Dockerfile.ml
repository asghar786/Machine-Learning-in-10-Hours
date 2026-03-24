FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY ml-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy service source
COPY ml-service/ .

EXPOSE 8001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
