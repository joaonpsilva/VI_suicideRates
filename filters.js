//Filter values

var per100kVis = true
var yearSelected = 2000
var filterSex = ['male', 'female'];
var filterAges = ['24- years','25-34 years','35-54 years','55-74 years', '75+ years'];
var filterCountries = ['Albania' , 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan' , 'Belarus',
                        'Belgium' , 'Belize', 'Brazil' , 'Bulgaria' ,'Bosnia and Herzegovina' ,'Canada' ,'Chile' , 'Colombia',
                        'Costa Rica' , 'Croatia', 'Cuba' , 'Cyprus', 'Czech Republic' , 'Denmark' , 'Dominican Republic' ,
                        'Ecuador' , 'El Salvador' , 'England' , 'Estonia' , 'Fiji' , 'Finland' , 'France' , 'Georgia' ,
                        'Germany' , 'Greece' , 'Guatemala','Guyana' , 'Hungary' , 'Iceland' ,'Ireland', 'Israel', 'Italy',
                        'Jamaica', 'Japan' , 'Kazakhstan' ,'Kuwait' ,'Kyrgyzstan' ,'Latvia', 'Lithuania' , 'Luxembourg',
                        'Mexico' , 'Mongolia' , 'Montenegro', 'Netherlands' , 'New Zealand' , 'Nicaragua' , 'Norway' ,
                        'Oman' , 'Panama' , 'Paraguay' , 'Philippines' , 'Poland' , 'Portugal' , 'Puerto Rico', 'Qatar',
                        'Republic of Serbia' , 'Romania', 'Russia' , 'Slovakia', 'Slovenia', 'South Africa', 'South Korea',
                        'Spain' , 'Sri Lanka', 'Suriname' , 'Sweden' , 'Switzerland', 'Thailand' , 'The Bahamas' ,
                        'Trinidad and Tobago', 'Turkey' , 'Turkmenistan', 'USA' , 'Ukraine' , 'United Arab Emirates',
                        'Uruguay', 'Uzbekistan','China']

var region = {
    Africa: ['South Africa'],
    Asia:   ['Armenia', 'Australia','Azerbaijan', 'Fiji','Georgia','Israel','Japan','Kazakhstan','Kuwait','Kyrgyzstan','Mongolia',
            'New Zealand','Oman','Philippines','Qatar','South Korea','Sri Lanka','Thailand','Turkey','Turkmenistan','United Arab Emirates',
            'Uzbekistan','China'],
    America:    ['Argentina', 'Belize' , 'Brazil' , 'Canada' , 'Chile' , 'Colombia' , 'Costa Rica' , 'Cuba' , 'Dominican Republic',
                'Ecuador','El Salvador', 'Guatemala', 'Guyana','Jamaica','Mexico','Nicaragua','Panama','Paraguay','Puerto Rico',
                'Suriname','The Bahamas','Trinidad and Tobago','USA','Uruguay'],
    Europe:     ['Albania','Austria',  'Belarus', 'Belgium', 'Bulgaria', 'Bosnia and Herzegovina', 'Croatia' , 'Cyprus',
                'Czech Republic' , 'Denmark', 'England','Estonia','Finland','France','Germany','Greece','Hungary','Iceland',
                'Ireland','Italy','Latvia','Lithuania' , 'Luxembourg','Montenegro','Netherlands','Norway','Poland','Portugal',
                'Republic of Serbia' , 'Romania', 'Russia','Slovakia', 'Slovenia','Spain','Sweden' , 'Switzerland',
                'Ukraine',],

}

function checkBox100k(box){
    if (box.checked) {
        per100kVis = true
    } else {
        per100kVis = false
    }
    updateData()
}


function checkBoxAge(box){

    if (box.checked) {
        // Add element
        filterAges.push(box.value)
    } else {
        // Remove element
        var index = filterAges.indexOf(box.value);
        filterAges.splice(index, 1);
    }
    updateData()
}

function checkBoxSex(box){

    if (box.checked) {
        // Add element
        filterSex.push(box.value)
    } else {
        // Remove element
        var index = filterSex.indexOf(box.value);
        filterSex.splice(index, 1);
    }
    updateData()
}

function checkBoxRegion(box){
    if (filterCountries.length == 1){
        filterCountries = []
    }

    if (box.checked) {
        // Add element
        filterCountries.push(...region[box.value])
    } else {
        // Remove element
        filterCountries = filterCountries.filter( function( el ) {
            return !region[box.value].includes( el );
        } );
    }
    updateData()

}

// Year slide show values
var slider = document.getElementById("myRange");
var output = document.getElementById("yearValue");
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.onchange = function() {
    output.innerHTML = "Year = " + this.value;
    yearSelected = this.value;
    
    updateData()
}

slider.oninput = function() {
    output.innerHTML = "Year = " + this.value;
}

///////////////////////////////////////////////////////////////////////////
// Togle display checkboxes
function showAge(img) {
    var x = document.getElementById("ageCheckboxes");
    if (x.style.display === "none") {
        x.style.display = "block";
        img.style.WebkitTransitionDuration='0.4s';
        img.style.transform = 'rotate(90deg)';
    } else {
        x.style.display = "none";
        img.style.WebkitTransitionDuration='0.4s';
        img.style.transform = 'rotate(0deg)';
    }
}

function showRegion(img) {
    var x = document.getElementById("regionCheckboxes");
    if (x.style.display === "none") {
        x.style.display = "block";
        img.style.WebkitTransitionDuration='0.4s';
        img.style.transform = 'rotate(90deg)';
    } else {
        x.style.display = "none";
        img.style.WebkitTransitionDuration='0.4s';
        img.style.transform = 'rotate(0deg)';    }
}

function showSex(img) {
    var x = document.getElementById("sexCheckboxes");
    if (x.style.display === "none") {
        x.style.display = "block";
        img.style.WebkitTransitionDuration='0.4s';
        img.style.transform = 'rotate(90deg)';
    } else {
        x.style.display = "none";
        img.style.WebkitTransitionDuration='0.4s';
        img.style.transform = 'rotate(0deg)';    }
}