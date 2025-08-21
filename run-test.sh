#!/bin/bash

# --- Configuration ---
IMAGE_NAME="rhel9-script-runner"

# --- Pre-flight Checks ---
if [ -z "$1" ]; then
  echo "🛑 Error: No script file provided."
  echo "Usage: ./run-test.sh <path/to/your/script.sh>"
  exit 1
fi

if [ ! -f "$1" ]; then
  echo "🛑 Error: Script file not found at '$1'"
  exit 1
fi

SCRIPT_TO_RUN=$1
SCRIPT_FILENAME=$(basename "$SCRIPT_TO_RUN")

# --- Main Logic ---
echo "🚀 Starting script testing tool..."

# 1. Build the Docker image if it doesn't already exist
if [[ -z "$(docker images -q $IMAGE_NAME 2> /dev/null)" ]]; then
  echo "🔧 Docker image '$IMAGE_NAME' not found. Building it now..."
  docker build -t $IMAGE_NAME .
  echo "✅ Docker image built successfully."
else
  echo "👍 Docker image '$IMAGE_NAME' already exists."
fi

# 2. Prepare the output directory on your computer
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_DIR_NAME="output/${SCRIPT_FILENAME}-${TIMESTAMP}"
mkdir -p "$OUTPUT_DIR_NAME"
OUTPUT_FILE_NAME="${SCRIPT_FILENAME}.log"
LOG_PATH_IN_CONTAINER="output/${OUTPUT_FILE_NAME}"

# 3. Start an interactive session in the Docker container
echo "🐳 Launching interactive container..."
echo "✅ Your script is located at '/app/${SCRIPT_FILENAME}'"
echo "➡️  To run the script AND save a log file, use the 'tee' command like this:"
echo "   ./${SCRIPT_FILENAME} | tee ${LOG_PATH_IN_CONTAINER}"
echo "➡️  When you are finished, type 'exit' to leave the container."
echo "---------------------------------------------------------"

docker run --rm -it \
  -v "//${PWD}/${SCRIPT_TO_RUN}":/app/"${SCRIPT_FILENAME}" \
  -v "//${PWD}/${OUTPUT_DIR_NAME}":/app/output \
  "$IMAGE_NAME" \
  bash

echo "---------------------------------------------------------"
echo "🎉 Interactive session finished!"
echo "📄 Your log file should be saved in the './${OUTPUT_DIR_NAME}' directory."