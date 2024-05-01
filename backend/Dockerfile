FROM python:3.11-bookworm

WORKDIR /app
COPY app/requirements.txt /app

RUN apt-get update \
    && apt-get install -y gcc libssl-dev

RUN pip install -r requirements.txt