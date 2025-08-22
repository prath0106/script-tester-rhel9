# RHEL 9 Script Generator & Tester

This tool provides a user-friendly interface to generate and test Red Hat Enterprise Linux 9 (RHEL 9) bash scripts using AI. It allows you to provide a requirements file, generate a script using an AI model (like Anthropic's Claude), and then safely execute the script to see a pass/fail report.

## Features
-   **AI-Powered Script Generation**: Uses a large language model to create bash scripts from a simple requirements file.
-   **Local Web Interface**: A simple front-end to manage the script generation and testing process.
-   **Script Execution**: Runs the generated script and provides a clear pass/fail status with the complete output.
-   **Cross-Platform**: Includes setup instructions for both Windows 11 and macOS (Apple Silicon).

---

## Prerequisites
Before you begin, ensure you have the following installed on your system:

-   **Node.js**: The JavaScript runtime to run the application. [Download Node.js (LTS)](https://nodejs.org/).
-   **Git**: The version control system to manage code. [Download Git](https://git-scm.com/).
-   **A Code Editor**: Such as [Visual Studio Code](https://code.visualstudio.com/).
-   **An AI Provider API Key**: For example, from [Anthropic (Claude)](https://www.anthropic.com/).

---

## Setup and Installation
Follow the steps below for your operating system.

### On Windows 11
1.  **Clone the Repository**:
    ```bash
    git clone <your-repository-url>
    cd script-tester-rhel9
    ```
2.  **Install Back-End Dependencies**:
    ```bash
    cd backend
    npm install
    ```
3.  **Install Front-End Dependencies**:
    ```bash
    cd ../frontend
    npm install
    ```

### On macOS (Apple Silicon)
1.  **Clone the Repository**:
    ```bash
    git clone <your-repository-url>
    cd script-tester-rhel9
    ```
2.  **Install Back-End Dependencies**:
    ```bash
    cd backend
    npm install
    ```
3.  **Install Front-End Dependencies**:
    ```bash
    cd ../frontend
    npm install
    ```
---

## Running the Application
You need to run both the back-end server and the front-end application simultaneously in two separate terminals.

### 1. Start the Back-End Server
-   Open a terminal and navigate to the `backend` directory.
    ```bash
    cd backend
    node server.js
    ```
-   The server will start, and you should see the message: `Server listening at http://localhost:3001`.

### 2. Start the Front-End Application
-   Open a **new** terminal and navigate to the `frontend` directory.
    ```bash
    cd frontend
    npm start
    ```
-   This will automatically open your web browser to `http://localhost:3000`.

### 3. Using the Application
1.  Enter your **API Key** from your chosen AI provider.
2.  Upload a **requirements file** (e.g., a `.txt` or `.md` file).
3.  Click **Generate Script**.
4.  Review the generated script, then click **Run Script**.
5.  View the pass/fail results and the script's output in the results box.