FROM python:3.11-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
COPY requirements.txt /app

RUN apt-get update \
    && apt-get install gcc libssl-dev

RUN pip install -r requirements.txt

COPY . /app