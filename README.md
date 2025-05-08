# Docker Project

## Overview
This project provides a Node.js Express server that interacts with Docker using the `dockerode` library. It exposes REST API endpoints to manage Docker containers.

## Features
- List running Docker containers
- Create new Docker containers
- Delete Docker containers by ID
- Automatic port allocation for new containers

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Installation

1. Clone this repository or download the source code.

2. Install dependencies:
   ```bash
   Dockerode
   express
   npm install

then start the node index.js 

to check the container run curl 127.0.0.1:9000/containers
