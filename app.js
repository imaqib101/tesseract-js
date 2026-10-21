const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");
const statusCard = document.getElementById("statusCard");
const progressBar = document.getElementById("progressBar");
const statusText = document.getElementById("statusText");
const resultCard = document.getElementById("resultCard");
const outputArea = document.getElementById("outputArea");
const copyBtn = document.getElementById("copyBtn");

dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    processImage(e.target.files[0]);
  }
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#58a6ff";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.borderColor = "#30363d";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#30363d";
  if (e.dataTransfer.files.length > 0) {
    processImage(e.dataTransfer.files[0]);
  }
});

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(outputArea.value);
  copyBtn.innerText = "✅ Copied!";
  setTimeout(() => (copyBtn.innerText = "📋 Copy Text"), 2000);
});

async function processImage(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    imagePreview.style.display = "block";
    document.querySelector(".drop-prompt").style.display = "none";
  };
  reader.readAsDataURL(file);

  statusCard.style.display = "block";
  resultCard.style.display = "none";
  progressBar.style.width = "0%";
  statusText.innerText = "Loading Tesseract OCR engine...";

  try {
    const worker = await Tesseract.createWorker("eng", 1, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          const progress = Math.round(m.progress * 100);
          progressBar.style.width = `${progress}%`;
          statusText.innerText = `Recognizing text: ${progress}%`;
        } else {
          statusText.innerText = m.status;
        }
      }
    });

    const ret = await worker.recognize(file);
    outputArea.value = ret.data.text.trim();
    resultCard.style.display = "block";
    statusText.innerText = `Completed (Confidence: ${Math.round(ret.data.confidence)}%)`;
    await worker.terminate();
  } catch (err) {
    statusText.innerText = `Error: ${err.message}`;
    progressBar.style.background = "#da3633";
  }
}
