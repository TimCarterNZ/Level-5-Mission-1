const vehicleImageInput = document.getElementById("vehicle-image");
const imagePreviewContainer = document.getElementById(
    "image-preview-container",
);
const imagePreview = document.getElementById("image-preview");
const fileName = document.getElementById("file-name");
const uploadText = document.querySelector(".upload-text");
const vehicleForm = document.getElementById("vehicle-form");
const recognitionResult = document.getElementById("recognition-result");
const submitButton = vehicleForm.querySelector('button[type="submit"]');

/* File Validation Settings */

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 10 * 1024 * 1024; // 10 MB

/* Image Selection and Preview */

vehicleImageInput.addEventListener("change", function () {
    const file = vehicleImageInput.files[0];

    // Stop if no file was selected
    if (!file) {
        return;
    }

    // Check file size
    if (file.size > maxFileSize) {
        alert("Image must be smaller than 10 MB.");
        vehicleImageInput.value = "";
        return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        alert("Please select a JPG, PNG or WebP image.");
        vehicleImageInput.value = "";
        return;
    }

    // Release the previous image URL, if one exists
    if (imagePreview.src.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview.src);
    }

    // Generate and display the image preview
    const imageURL = URL.createObjectURL(file);

    imagePreview.src = imageURL;
    fileName.textContent = file.name;
    imagePreviewContainer.hidden = false;

    // Update the upload prompt
    uploadText.textContent = "Click here to upload a different image";

    // Reset the previous recognition result
    recognitionResult.textContent = "No vehicle analysed yet.";
});

/* Form Submission */

vehicleForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const file = vehicleImageInput.files[0];

    if (!file) {
        return;
    }

    const formData = new FormData();
    formData.append("vehicle-image", file);
    submitButton.disabled = true;
    submitButton.textContent = "Identifying Vehicle...";
    submitButton.classList.add("loading");

    try {
        const response = await fetch("http://localhost:4000/api/recognise", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        // Displaying the AI's output

        if (response.ok) {
            const predictions = data.predictions;

            const highestPrediction = predictions.reduce((highest, current) => {
                return current.probability > highest.probability
                    ? current
                    : highest;
            });
            // console.log(highestPrediction);

            // If the customer uploads a picture that isn't a vehicle
            if (highestPrediction.tagName === "Not-a-Vehicle") {
                recognitionResult.classList.remove("result-success");
                recognitionResult.classList.add("result-error");

                recognitionResult.innerHTML = `
                <h3>That doesn't look like a car!</h3>
                <p>Please upload a photograph of a vehicle and try again.</p>
            `;
            } else {
                recognitionResult.classList.add("result-success");
                recognitionResult.classList.remove("result-error");

                recognitionResult.innerHTML = `
                    <h3>Your Vehicle type is: ${highestPrediction.tagName}</h3>
                    <p>Calculated with ${(highestPrediction.probability * 100).toFixed(1)}% confidence</p>
                `;
            }
        } else {
            recognitionResult.textContent =
                data.error || "Something went wrong. Please try again.";
        }
    } catch (error) {
        recognitionResult.textContent = "Could not connect to the backend.";
        console.error(error);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Identify Vehicle Type";
        submitButton.classList.remove("loading");
    }
});
