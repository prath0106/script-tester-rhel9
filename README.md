# RHEL 9 Script Runner Tool

A tool to test shell scripts inside a clean, containerized Red Hat Enterprise Linux 9 (RHEL 9) environment. This tool launches an interactive session inside the container, allowing you to run scripts that require user input.

## Features

* **Interactive Terminal:** Launches a fully interactive `bash` shell inside the RHEL 9 container.
* **Live Output:** See your script's output in real-time as it executes.
* **Output Capture:** Optionally save a complete log of your interactive session to a file using the `tee` command.
* **Clean Environment:** Each session runs in a fresh, temporary container that is automatically removed when you exit.

## How to Use

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/prath0106/script-tester-rhel9.git](https://github.com/prath0106/script-tester-rhel9.git)
    cd script-tester-rhel9
    ```

2.  **Make the Runner Script Executable** (only needs to be done once):
    ```bash
    chmod +x run-test.sh
    ```

3.  **Launch the Interactive Tester**:
    Run the `run-test.sh` script, passing the path to the script you want to test as an argument.
    ```bash
    ./run-test.sh <path/to/your/script.sh>
    ```

4.  **Run Your Script Inside the Container**:
    Your terminal prompt will change (e.g., `[root@container-id /app]#`). You are now inside the RHEL 9 container. Run your script manually.

    * **To see live output only**:
        ```bash
        ./your-script.sh
        ```
    * **To see live output AND save a report file**:
        Use the `tee` command as instructed by the tool.
        ```bash
        ./your-script.sh | tee output/your-script.sh.log
        ```

5.  **Exit the Container**:
    When you're finished, type `exit` and press Enter to return to your normal terminal. Your report file will be in the `output` directory.

### Example

1.  **Launch the tool with the sample script:**
    ```bash
    ./run-test.sh test-scripts/system-info.sh
    ```

2.  **Once inside the container, run the script and save the log:**
    ```bash
    ./system-info.sh | tee output/system-info.sh.log
    ```

3.  **Exit the container:**
    ```bash
    exit
    ```

You can now view the full report in the `output` folder on your computer.


Built by Pratham & Gemini 2.5 Pro
