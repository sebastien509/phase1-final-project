
// =================================================
const wineMenu = document.querySelector("#menu-list");
const wineDisplay = document.querySelector("#wine-display");
const submitForm = document.querySelector("#wine-form-container");
const newButton = document.createElement("button");

const buttonContainer = document.querySelector('#wine-display');
buttonContainer.classList.add('button-container');

// Initial function to fetch and display wines
getWineToDisplay();
async function getWineToDisplay() {
  const response = await fetch("https://new-seed-json.onrender.com/wines");
  const data = await response.json();

  // Displaying each wine in the list
  data.forEach((wine) => wineBox(wine));

  // Adding button to show form
  newButton.textContent = "+";
  wineMenu.append(newButton);

  newButton.addEventListener("click", showForm);
}

// Function to toggle form visibility
function showForm() {
  wineDisplay.innerHTML = ""; // Clear the wine display
  submitForm.style.display = "block"; // Show form
}

// Function to hide the form
function hideForm() {
  submitForm.style.display = "none";
  submitForm.reset(); // Optionally reset the form when hiding
}

// Function to create a wine image element
function wineBox(wine) {
  const wineImageList = document.createElement("img");
  wineImageList.src = wine.image;
  wineImageList.alt = `${wine.winery} ${wine.year}`;

  // Append the wine image to the menu list container
  wineMenu.append(wineImageList);

  // Event listener to display more information when the image is clicked
  wineImageList.addEventListener("click", () => {
    displayWineDetails(wine);
    hideForm(); // Ensure form is hidden when selecting a new wine
  });
}

// Function to display detailed wine info
function displayWineDetails(wine) {
  // Clear previous content
  wineDisplay.innerHTML = "";

  const id = document.createElement("h1");
  id.textContent = `${wine.id}`;
  wineDisplay.append(id);

  const winePrice = document.createElement("h1");
  winePrice.textContent = `$${wine.price}`;
  wineDisplay.append(winePrice);

  const wineHeader = document.createElement("h1");
  wineHeader.textContent = wine.winery;
  wineDisplay.append(wineHeader);

  const wineRegion = document.createElement("h2");
  wineRegion.textContent = wine.region;
  wineDisplay.append(wineRegion);


  const bottleImage = document.createElement("img");
  bottleImage.src = wine.image;
  wineDisplay.append(bottleImage);

  const regionImage = document.createElement("img");
  regionImage.src = wine.imageRegion;
  wineDisplay.append(regionImage);

  const wineComment = document.createElement("h3");
  wineComment.textContent = wine.comment;
  wineDisplay.append(wineComment);

  // Update button
  const updateButton = document.createElement("button");
  updateButton.textContent = "Update info";
  wineDisplay.append(updateButton);
  updateButton.classList.add('luxury-button', 'update-button');


  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add('luxury-button', 'delete-button');
  wineDisplay.append(deleteButton);

  // Event listener for deletion
  deleteButton.addEventListener("click", async () => {
    await fetch(`https://new-seed-json.onrender.com/wines/${wine.id}`, {
      method: "DELETE",
    });
    wineDisplay.innerHTML = ""; // Clear the display after deletion
    getWineToDisplay(); // Refresh the wine list
  });

  // Event listener for update
  updateButton.addEventListener("click", () => {
    // Fill the form with existing data for editing
    document.querySelector("#winery").value = wine.winery;
    document.querySelector("#wine-year").value = wine.year;
    document.querySelector("#wine-price").value = wine.price;
    document.querySelector("#wine-image").value = wine.image;
    document.querySelector("#wine-region").value = wine.region;
    document.querySelector("#region-image").value = wine.imageRegion;
    document.querySelector("#comment").value = wine.comment;

    // Show form and prefill
    submitForm.style.display = "block";

    // Modify the submit function to PATCH instead of POST
    submitForm.removeEventListener("submit", submitFunction); // Remove old listener
    submitForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await updateWineDetails(wine.id);
    });
  });
}

// =========================================

// Function to handle updating wine details
async function updateWineDetails(id) {
  const updatedWinery = document.querySelector("#winery").value;
  const updatedYear = document.querySelector("#wine-year").value;
  const updatedPrice = document.querySelector("#wine-price").value;
  const updatedImage = document.querySelector("#wine-image").value;
  const updatedRegion = document.querySelector("#wine-region").value;
  const updatedRegionImage = document.querySelector("#region-image").value;
  const updatedComment = document.querySelector("#comment").value;

  await fetch(`https://new-seed-json.onrender.com/wines/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      winery: updatedWinery,
      year: updatedYear,
      price: updatedPrice,
      image: updatedImage,
      region: updatedRegion,
      imageRegion: updatedRegionImage,
      comment: updatedComment,
    }),
  });

  // Clear and hide form after updating
  hideForm();
  getWineToDisplay(); 
}

// Function to handle new wine form submission (POST)
const submitFunction = async (event) => {
  event.preventDefault();

  const wineryInput = document.querySelector("#winery").value;
  const yearInput = document.querySelector("#wine-year").value;
  const priceInput = document.querySelector("#wine-price").value;
  const imageInput = document.querySelector("#wine-image").value;
  const regionInput = document.querySelector("#wine-region").value;
  const regionImageInput = document.querySelector("#region-image").value;
  const commentInput = document.querySelector("#comment").value;

  await fetch("https://new-seed-json.onrender.com/wines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      winery: wineryInput,
      year: yearInput,
      price: priceInput,
      image: imageInput,
      region: regionInput,
      imageRegion: regionImageInput,
      comment: commentInput,
    }),
  });

  hideForm(); // Hide and reset form after submission
  getWineToDisplay(); // Refresh wine list after submission
};



// Add event listener to the form submit
submitForm.addEventListener("submit", submitFunction);

// close button for the form
const closeButton = document.createElement("button");
closeButton.textContent = "X";
closeButton.type = "button"; // Prevent this button from submitting the form
submitForm.prepend(closeButton);
closeButton.addEventListener("click", hideForm); // Add functionality to close form
// ======================================================
