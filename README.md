# RHEL 9 Script Generator & Tester

This tool provides a user-friendly interface to generate and test Red Hat Enterprise Linux 9 (RHEL 9) bash scripts using AI. It has two modes:

1.  **Generate New Script**: Uses an AI model (like Anthropic's Claude) to create a bash script from a requirements file.
2.  **Test My Own Script**: Allows you to paste in your own custom script to run in a clean RHEL 9 environment.

The application uses Docker to ensure that every script is tested in a clean, consistent, and safe RHEL 9 container.

---
## Prerequisites
Before you begin, ensure you have the following installed on your system:

-   **Node.js**: The JavaScript runtime to run the application. [Download Node.js (LTS)](https://nodejs.org/).
-   **Git**: The version control system. [Download Git](https://git-scm.com/).
-   **Docker Desktop**: To run the RHEL 9 testing container. [Download Docker Desktop](https://www.docker.com/products/docker-desktop/).
-   **A Code Editor**: Such as [Visual Studio Code](https://code.visualstudio.com/).
-   **An AI Provider API Key**: For example, from [Anthropic (Claude)](https://www.anthropic.com/) (only needed for script generation).

---

## Setup and Installation
Follow these steps for your operating system. **Make sure Docker Desktop is running** before you start the application.

### On Windows 11 & macOS
The setup steps are the same for both platforms.

1.  **Clone the Repository**:
    Open your terminal and run:
    ```bash
    git clone [https://github.com/prath0106/script-tester-rhel9.git](https://github.com/prath0106/script-tester-rhel9.git)
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
-   Open a terminal in the project's **`backend`** directory.
    ```bash
    cd backend
    node server.js
    ```
-   The server will start, and you should see the message: `Server listening at http://localhost:3001`.

### 2. Start the Front-End Application
-   Open a **new** terminal in the project's **`frontend`** directory.
    ```bash
    cd frontend
    npm start
    ```
-   This will automatically open your web browser to `http://localhost:3000`.

---
## How to Use
1.  **Choose a Mode**:
    -   **Generate New Script**: Provide your API Key and upload a requirements file. **Note: For best results, please limit your requirements to 3 per file to avoid exceeding AI token limits.**
    -   **Test My Own Script**: Paste your complete bash script into the text area.
2.  **Run Script**: Click the "Run Script" button to execute your script inside the RHEL 9 Docker container.
3.  **View Results**: See the generated HTML report directly in the results box and use the download button to save it.