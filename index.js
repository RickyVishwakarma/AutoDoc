const express = require("express");
const Docker = require("dockerode");

const app = express();
const docker = new Docker();

app.use(express.json());

const PORT_TO_CONTAINER = {};
const CONTAINER_TO_PORT = {};

// Helper: Get available port and lock it temporarily
function getAvailablePort() {
  for (let i = 8000; i <= 8999; i++) {
    if (!PORT_TO_CONTAINER[i]) {
      PORT_TO_CONTAINER[i] = 'reserved'; // temporary lock
      return `${i}`;
    }
  }
  return null;
}

app.get("/containers", async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    return res.json({
      containers: containers.map((e) => ({
        id: e.Id,
        name: e.Names,
        image: e.Image,
        state: e.State,
        status: e.Status,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/containers", async (req, res) => {
  const { image, internalPort = "80", cmd = ["/bin/sh"] } = req.body;

  if (!image) {
    return res.status(400).json({ error: "Image is required" });
  }

  const availablePort = getAvailablePort();
  if (!availablePort) {
    return res.status(500).json({ error: "No available port" });
  }

  try {
    // Pull image
    await new Promise((resolve, reject) => {
      docker.pull(image, (err, stream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream, onFinished, onProgress);

        function onFinished(err, output) {
          if (err) return reject(err);
          resolve(output);
        }

        function onProgress(event) {
          // Optional: log or display pull progress
        }
      });
    });

    // Create container
    const container = await docker.createContainer({
      Image: image,
      Cmd: cmd,
      Tty: true,
      HostConfig: {
        PortBindings: {
          [`${internalPort}/tcp`]: [{ HostPort: availablePort }],
        },
      },
    });

    // Track mappings
    PORT_TO_CONTAINER[availablePort] = container.id;
    CONTAINER_TO_PORT[container.id] = availablePort;

    // Start container
    await container.start();

    return res.json({ containerId: container.id, port: availablePort });
  } catch (err) {
    // Clean up port lock if container creation fails
    PORT_TO_CONTAINER[availablePort] = undefined;
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/containers/:id", async (req, res) => {
  const containerId = req.params.id;
  const container = docker.getContainer(containerId);

  try {
    await container.stop();
    await container.remove();
    const port = CONTAINER_TO_PORT[containerId];

    if (port) {
      delete PORT_TO_CONTAINER[port];
      delete CONTAINER_TO_PORT[containerId];
    }

    return res.json({ message: "Container stopped and removed", containerId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(9000, () => {
  console.log("Server is running on port 9000");
});
