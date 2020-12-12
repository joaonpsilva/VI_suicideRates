//Filter values

var yearSelected = 1999
var filterSex = ['male', 'female'];
var filterAges = ['5-14 years', '15-24 years','25-34 years','35-54 years','55-74 years', '75+ years'];

function updateFilters(){
    //check CheckBoxes
    updateData();
}
//var filterCountrys

function checkBoxAge(box){

    if (box.checked) {
        // Add element
        filterAges.push(box.value)
    } else {
        // Remove element
        var index = filterAges.indexOf(box.value);
        filterAges.splice(index, 1);
    }
    updateFilters()
}



// Year slide show values
var slider = document.getElementById("myRange");
var output = document.getElementById("yearValue");
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = "Year = " + this.value;
    yearSelected = this.value;
    updateFilters()
}

///////////////////////////////////////////////////////////////////////////
// Togle display checkboxes
function showAge() {
    var x = document.getElementById("ageCheckboxes");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function showRegion() {
    var x = document.getElementById("regionCheckboxes");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function showSex() {
    var x = document.getElementById("sexCheckboxes");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}