FROM python:3.11-bookworm

WORKDIR /app
COPY requirements.txt /app

RUN apt-get update \
    && apt-get install gcc libssl-dev

RUN pip install -r requirements.txt && rm -f requirements.txt