

    // Year slide show values
    var slider = document.getElementById("myRange");
    var output = document.getElementById("yearValue");
    //output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.innerHTML = "Year = " + this.value;
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