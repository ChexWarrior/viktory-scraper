# Puppeteer Viktory Scraper

## Description
This repo contains the files for a container that when run will scrape a target Viktory II game's log and store it in a text file.

## Usage

### Development
To run this app locally run the following from repo root:
```bash
  docker container run --rm -v "$PWD/app" chexwarrior/puppeteer node index.js
```

### Production
To run this app in production simply run:
```bash
docker container run --rm chexwarrior/puppeteer node index.js
```