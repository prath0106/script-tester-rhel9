# RHEL 9 Script Runner Tool

A simple tool to test any shell script inside a clean, containerized Red Hat Enterprise Linux 9 (RHEL 9) environment.

## How It Works

This tool uses Docker to perform the following steps:
1.  Builds a minimal RHEL 9 Docker image (if not already built).
2.  Creates a unique `output` directory to store the results.
3.  Runs a new Docker container from the RHEL 9 image.
4.  Mounts your script (read-only) and the output directory (read-write) into the container.
5.  Executes your script inside the container.
6.  Captures all standard output from your script and saves it to a log file.
7.  Automatically cleans up and removes the container after execution.

## Prerequisites

To run this tool on **Windows**, you need:
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
-   [Git for Windows](https://git-scm.com/download/win), which includes **Git Bash**.

**All commands must be run from the Git Bash terminal.**

## How to Use

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/your-username/script-runner.git](https://github.com/your-username/script-runner.git)
    cd script-runner
    ```

2.  **Make the Runner Script Executable** (you only need to do this once):
    ```bash
    chmod +x run-test.sh
    ```

3.  **Run the Tool**:
    Execute the `run-test.sh` script, passing the path to the script you want to test as an argument.

    ```bash
    ./run-test.sh <path/to/your/script.sh>
    ```

### Example

We have included a sample script in the `test-scripts` directory. To run it:

```bash
./run-test.sh test-scripts/system-info.sh
```

### Expected Output

The first time you run it, the tool will build the Docker image. Subsequent runs will be much faster.

```
🚀 Starting script testing tool...
🔧 Docker image 'rhel9-script-runner' not found. Building it now...
... (Docker build output) ...
✅ Docker image built successfully.
📂 Preparing to run script: 'test-scripts/system-info.sh'
📝 Output will be saved in: './output/system-info.sh-20250821-120043/system-info.sh.log'
🐳 Running container...
🎉 Script execution finished!
📄 You can find the output at: './output/system-info.sh-20250821-120043/system-info.sh.log'
```

You can then view the results:

```bash
cat output/system-info.sh-20250821-120043/system-info.sh.log
```

The output file will contain the execution results from inside the RHEL 9 container.