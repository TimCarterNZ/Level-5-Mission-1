<a id="readme-top"></a>

<div align="center">
  <h1>Turners Vehicle Recognition Prototype</h1>
  <p>An image-based vehicle body-type recognition prototype for a Turners Car Insurance assignment.</p>
  <p><strong>Educational prototype only. Project is not affiliated with or endorsed by Turners.</strong></p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a>
      <ul><li><a href="#built-with">Built With</a></li><li><a href="#how-it-works">How It Works</a></li></ul>
    </li>
    <li><a href="#getting-started">Getting Started</a>
      <ul><li><a href="#prerequisites">Prerequisites</a></li><li><a href="#installation">Installation</a></li></ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#model-and-limitations">Model and Limitations</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

This project is a proof-of-concept vehicle recognition application designed as part of a full-stack development assignment. It lets a user upload a photograph of a vehicle and receive an AI-generated prediction of its **body type**, together with a confidence percentage.

The interface follows a Turners-inspired car insurance page design, but is an independent educational prototype. It does **not** provide insurance quotes or identify a vehicle's make, model, or registration.

Key features:

- JPG, PNG and WebP image uploads, up to **10 MB**.
- Image preview before submission.
- Frontend and backend file type and size checks.
- Azure Custom Vision vehicle body-type prediction.
- Highest-probability result displayed with its confidence percentage.
- Separate message when the top prediction is **Not-a-Vehicle**.
- Loading state and error handling during requests.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- **HTML5** — page structure and upload form.
- **CSS3** — layout, styling and responsive presentation.
- **Vanilla JavaScript** — image validation, preview, form submission and result display.
- **Node.js** — backend runtime; requires a version with built-in `fetch` (Node.js 18+).
- **Express** — backend API.
- **Multer** — file upload handling and in-memory image storage.
- **CORS** — permits requests from the separately served frontend during local development.
- **dotenv** — loads Azure credentials from environment variables.
- **Azure Custom Vision** — trained image classification model and prediction API.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### How It Works

```text
User selects an image
        ↓
Frontend validates and previews the file
        ↓
FormData + fetch() → POST http://localhost:4000/api/recognise
        ↓
Express + Multer validate and read the image into memory
        ↓
Backend fetch() → Azure Custom Vision Prediction API
        ↓
Azure returns classifications and probabilities
        ↓
Backend returns JSON → Frontend displays the top prediction
```

The backend uses `req.file.buffer` to forward the image as raw binary data. The Azure prediction URL and key are read from environment variables, rather than being embedded in frontend code.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Prerequisites

- Node.js **18 or later** and npm.
- An Azure Custom Vision prediction endpoint and prediction key for a published classification iteration.
- A browser and a way to serve the frontend locally (such as VS Code Live Server).

### Installation

1. **Clone this project's repository** (replace the placeholder with your repository URL):

    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
    cd YOUR_REPOSITORY
    ```

2. **Install backend dependencies** in the directory containing `server.js`. If you already have a `package.json`, use `npm install`. Otherwise, initialise the backend and install the required packages:

    ```bash
    npm init -y
    npm install express cors multer dotenv
    ```

3. **Create a `.env` file** beside `server.js` with your actual Azure prediction credentials:

    ```dotenv
    AZURE_PREDICTION_URL=https://YOUR_PREDICTION_ENDPOINT
    AZURE_PREDICTION_KEY=YOUR_PREDICTION_KEY
    ```

    Use the full image prediction URL supplied by Azure Custom Vision, not just the resource's base address. **Do not commit `.env` or any API keys to GitHub.** Add `.env` to `.gitignore`.

4. **Start the backend** from the directory containing `server.js`:

    ```bash
    node server.js
    ```

    It should report `Server running at http://localhost:4000`. Visiting that URL should display `Backend is working.`

5. **Run the frontend** by serving `prototype.html`, `prototype.css` and `prototype.js` from the same directory. For example, open `prototype.html` with VS Code Live Server.

    The frontend currently sends requests to `http://localhost:4000/api/recognise`, so the backend must be running locally on port **4000**. Update that URL in `prototype.js` if the backend address changes.

> **File names:** These instructions assume the project files are named `prototype.html`, `prototype.css`, `prototype.js` and `server.js`, as referenced by the HTML and code.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

1. Open the application in your browser.
2. Choose a clear image showing as much of the vehicle as possible, ideally including its front and side.
3. Check the image preview, then click **Identify Vehicle Type**.
4. Read the returned body type and confidence percentage.
5. If the top prediction is **Not-a-Vehicle**, the interface prompts you to try another photograph.

Supported image types: **JPG, PNG and WebP**. Maximum upload size: **10 MB**.

The app reports the model's highest-scoring classification, not a guaranteed correct result. A higher confidence percentage does not prove the prediction is accurate.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Model and Limitations

The Azure Custom Vision model is configured for multiclass image classification with the following tags:

`Convertible` · `Coupe` · `Hatchback` · `Not-a-Vehicle` · `Pick-Up` · `Sedan` · `SUV` · `VAN`

Known limitations:

- Visually similar body types, particularly **hatchbacks, sedans and coupes**, can be confused.
- Accuracy depends on training examples and the quality, angle and visibility of the uploaded image.
- The frontend displays the **single highest-probability** tag; it does not apply a minimum-confidence threshold or display alternative predictions.
- Validation checks reported file MIME types and sizes, rather than fully verifying the actual image content.
- This version runs locally and requires the Azure prediction service to be available.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Create Turners-inspired vehicle recognition page.
- [x] Add upload validation and image preview.
- [x] Connect the frontend to an Express backend.
- [x] Process uploaded images using Multer.
- [x] Connect the backend to Azure Custom Vision.
- [x] Display predictions and handle non-vehicle images and request errors.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

This is an assignment prototype, rather than a maintained open-source product. If you have suggestions, please open an issue or contact the repository owner once the repository details have been added.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

No license has been specified for this project. Add a `LICENSE` file and update this section if you decide to publish it under an open-source license. Turners branding and third-party assets remain the property of their respective owners.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Project repository: **[Add your GitHub repository URL]**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- [Turners](https://www.turners.co.nz/) — visual reference for the prototype interface; no affiliation or endorsement.
- [Microsoft Azure Custom Vision](https://learn.microsoft.com/en-us/azure/ai-services/custom-vision-service/) — image classification service.
- [Express](https://expressjs.com/) and [Multer](https://github.com/expressjs/multer) — backend request and upload handling.
- [Best README Template](https://github.com/othneildrew/Best-README-Template) by othneildrew — README structure.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
