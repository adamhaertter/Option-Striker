
const MSS_DATA = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5", "Option 6", "Option 7", "Option 8", "Option 9", "Option 10"];

let numOptions = 5;
let data = MSS_DATA
const datasetControl = [MSS_DATA] // Add more datasets as needed

function updateData(options, dataset) {
    numOptions = options
    data = datasetControl[dataset]
    
    const numInput = document.getElementById("num_options");
    numInput.max = data.length;
}

function selectRandomOptions() {
    let rand = 0;
    const workingArray = [...data]; // Create a copy of the data array
    const outputArray = new Array(numOptions)
    for(let i = 0; i < numOptions; i++) {
        rand = Math.floor(Math.random() * workingArray.length)
        outputArray[i] = workingArray[rand];
        workingArray.splice(rand, 1);
        console.log("Selected: " + outputArray[i] + ", Remaining: " + workingArray);        
    }
    return outputArray
}

function renderImages() {
    const container = document.getElementById("output_segment");
    container.innerHTML = ""; // clear existing images
    const selected = selectRandomOptions();
    selected.forEach((item, i) => {
    const img = document.createElement("img");
    img.src = `img/${item}.png`;
    img.alt = item;
    img.style.width = "100px"; // set image width
    img.style.margin = "10px"; // set margin between images

    img.addEventListener("click", () => {
        img.classList.toggle("struck");
    });

    container.appendChild(img);
    });
}

function generate() {
    let options = parseInt(document.getElementById("num_options").value);
    //let dataset = parseInt(document.getElementById("dataset_select").value); // Eventually, for multiple datasets
    updateData(options, 0);
    renderImages();
}

updateData(numOptions, 0);
renderImages();
document.getElementById("generate_button").addEventListener("click", generate);