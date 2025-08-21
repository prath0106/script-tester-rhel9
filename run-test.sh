#!/bin/bash

# --- Configuration ---
# Define the name for our Docker image
IMAGE_NAME="rhel9-script-runner"

# --- Pre-flight Checks ---
# Ensure a script file was provided as an argument
if [ -z "$1" ]; then
  echo "🛑 Error: No script file provided."
  echo "Usage: ./run-test.sh <path/to/your/script.sh>"
  exit 1
fi

# Check if the provided script file actually exists
if [ ! -f "$1" ]; then
  echo "🛑 Error: Script file not found at '$1'"
  exit 1
fi

# Store the path to the user's script and its name
SCRIPT_TO_RUN=$1
SCRIPT_FILENAME=$(basename "$SCRIPT_TO_RUN")

# --- Main Logic ---
echo "🚀 Starting script testing tool..."

# 1. Build the Docker image if it doesn't already exist
# 'docker images -q' lists image IDs. If our image isn't found, the output is empty.
if [[ -z "$(docker images -q $IMAGE_NAME 2> /dev/null)" ]]; then
  echo "🔧 Docker image '$IMAGE_NAME' not found. Building it now..."
  docker build -t $IMAGE_NAME .
  echo "✅ Docker image built successfully."
else
  echo "👍 Docker image '$IMAGE_NAME' already exists."
fi

# 2. Prepare the output directory
# Create a unique output directory using the script name and a timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_DIR_NAME="output/${SCRIPT_FILENAME}-${TIMESTAMP}"
mkdir -p "$OUTPUT_DIR_NAME"

# Define the name for the output file
OUTPUT_FILE_NAME="${SCRIPT_FILENAME}.log"

echo "📂 Preparing to run script: '$SCRIPT_TO_RUN'"
echo "📝 Output will be saved in: './${OUTPUT_DIR_NAME}/${OUTPUT_FILE_NAME}'"

# 3. Run the Docker container
# -v mounts volumes. We mount the script as read-only and the output dir as read-write.
# --rm automatically removes the container after it exits.
# The command at the end executes the script and redirects its output.
echo "🐳 Running container..."
docker run --rm \
  -v "$(pwd)/${SCRIPT_TO_RUN}":/app/"${SCRIPT_FILENAME}":ro \
  -v "$(pwd)/${OUTPUT_DIR_NAME}":/app/output \
  "$IMAGE_NAME" \
  bash -c "chmod +x /app/${SCRIPT_FILENAME} && /app/${SCRIPT_FILENAME} > /app/output/${OUTPUT_FILE_NAME}"

echo "🎉 Script execution finished!"
echo "📄 You can find the output at: './${OUTPUT_DIR_NAME}/${OUTPUT_FILE_NAME}'"