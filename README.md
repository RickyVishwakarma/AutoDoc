# Docker Container Management API

## Overview
This project provides a robust Node.js Express server that interacts with Docker using the `dockerode` library. It offers a RESTful API interface for managing Docker containers with features like automatic port allocation, container lifecycle management, and easy-to-use endpoints.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Port Management](#port-management)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Container Management**
  - List all running and stopped containers
  - Create new containers with automatic port allocation
  - Delete containers by ID
  - Real-time container state monitoring
- **Port Management**
  - Automatic port allocation in range 8000-8999
  - Port conflict prevention
  - Port mapping tracking
- **Docker Integration**
  - Seamless Docker API integration via Dockerode
  - Automatic image pulling
  - Container lifecycle management
- **Error Handling**
  - Robust error handling for Docker operations
  - Automatic resource cleanup
  - Detailed error messages

## Prerequisites
Before running this project, ensure you have the following installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (version 4.0.0 or higher)
- [Node.js](https://nodejs.org/) (version 14.0.0 or higher)
- [npm](https://www.npmjs.com/) (version 6.0.0 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RickyVishwakarma/AutoDoc.git
   cd AutoDoc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node index.js
   ```

4. Verify the installation:
   ```bash
   curl http://127.0.0.1:9000/containers
   ```

## API Documentation

### List Containers
```http
GET /containers
```
Returns a list of all containers with their details.

**Response Example:**
```json
{
  "containers": [
    {
      "id": "a1b2c3d4e5f6",
      "name": ["/my-container"],
      "image": "nginx:latest",
      "state": "running",
      "status": "Up 2 hours"
    }
  ]
}
```

### Create Container
```http
POST /containers
```
Creates a new container with specified parameters.

**Request Body:**
```json
{
  "image": "nginx",
  "internalPort": "80",
  "cmd": ["/bin/sh"]
}
```

**Response Example:**
```json
{
  "containerId": "a1b2c3d4e5f6",
  "port": "8001"
}
```

### Delete Container
```http
DELETE /containers/:id
```
Stops and removes a container by ID.

**Response Example:**
```json
{
  "message": "Container stopped and removed",
  "containerId": "a1b2c3d4e5f6"
}
```

## Architecture

### Port Management System
The application uses two main tracking objects:
- `PORT_TO_CONTAINER`: Maps host ports to container IDs
- `CONTAINER_TO_PORT`: Maps container IDs to host ports

Port allocation follows these rules:
1. Ports are allocated in range 8000-8999
2. Each container gets a unique port
3. Ports are released when containers are removed

### Error Handling Strategy
- Input validation for all API endpoints
- Automatic cleanup of resources on failure
- Detailed error messages for debugging
- Port release on container creation failure

## Examples

### Creating an Nginx Container
```bash
curl -X POST http://localhost:9000/containers \
  -H "Content-Type: application/json" \
  -d '{
    "image": "nginx",
    "internalPort": "80"
  }'
```

### Running a Custom Command
```bash
curl -X POST http://localhost:9000/containers \
  -H "Content-Type: application/json" \
  -d '{
    "image": "ubuntu",
    "cmd": ["/bin/bash", "-c", "echo hello world"]
  }'
```

### Removing a Container
```bash
curl -X DELETE http://localhost:9000/containers/a1b2c3d4e5f6
```

## Development

### Project Structure
```
.
├── index.js           # Main application file
├── package.json       # Project dependencies
├── README.md         # Documentation
└── .gitignore        # Git ignore file
```

### Adding New Features
1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Submit a pull request

## Troubleshooting

### Common Issues
1. **Docker not running**
   - Ensure Docker Desktop is running
   - Check Docker daemon status

2. **Port conflicts**
   - Check for port availability
   - Review port mappings

3. **Permission issues**
   - Ensure proper Docker permissions
   - Check file system permissions

### Debug Mode
Set environment variable for debug logging:
```bash
DEBUG=app:* node index.js
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the ISC License. See the LICENSE file for details.

## Support
For support, please open an issue in the GitHub repository or contact the maintainers.
