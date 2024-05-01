FROM python:3.11-bookworm

WORKDIR /app
COPY app/requirements.txt /app

RUN apt-get update \
    && apt-get -y install gcc libssl-dev

RUN pip install -r requirements.txt && rm -f requirements.txt