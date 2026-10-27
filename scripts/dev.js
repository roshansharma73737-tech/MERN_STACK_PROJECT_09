import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const processes = [
    {
        name: "backend",
        script: path.join(projectRoot, "main_Server", "server.js"),
        cwd: projectRoot
    },
    {
        name: "frontend",
        script: path.join(projectRoot, "node_modules", "vite", "bin", "vite.js"),
        cwd: projectRoot
    }
];

const children = [];
let shuttingDown = false;
let exitCode = 0;

function stopChildren() {
    if (shuttingDown) return;
    shuttingDown = true;

    for (const child of children) {
        if (child.exitCode === null && child.signalCode === null) {
            child.kill();
        }
    }
}

for (const service of processes) {
    const child = spawn(process.execPath, [service.script], {
        cwd: service.cwd,
        stdio: "inherit"
    });

    children.push(child);

    child.on("error", (error) => {
        console.error(`Unable to start ${service.name}:`, error);
        exitCode = 1;
        stopChildren();
    });

    child.on("exit", (code, signal) => {
        if (!shuttingDown) {
            if (code !== 0) {
                exitCode = code || 1;
                console.error(
                    `${service.name} stopped${signal ? ` after ${signal}` : ` with code ${code}`}.`
                );
            }
            stopChildren();
        }

        if (children.every((process) => process.exitCode !== null || process.signalCode !== null)) {
            process.exitCode = exitCode;
        }
    });
}

process.on("SIGINT", stopChildren);
process.on("SIGTERM", stopChildren);
