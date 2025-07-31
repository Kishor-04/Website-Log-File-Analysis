FROM python:3.14.0rc1-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

#copy
COPY . .

# EXPOSE
EXPOSE 5000

CMD ["python" ,"app.py"]


