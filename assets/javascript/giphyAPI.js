

// displayGif function re-renders the HTML to display the appropriate content
function displayGif() {   
    
    var gif = $("#inputMeme").val().trim();
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=FJg7DrUcAEW9bNpFc4A1qMg8PFMWpPU9&q=" + gif + "&limit=&offset=0&rating=&lang=en";
    
    // Creates AJAX call for the specific gif button being clicked
    
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
          $("#gifs-display").empty();
        
        var display = $("#gifs-display");
        var gifImages = response.data;
        
        //cycles through each element in the array.
        gifImages.forEach(function (currentValue) {
            
            // creates a new div with .image-display class to help with the css
            var imgDiv = $("<div>").addClass("image-display");
            
            // creates image element and assigning its src/data-alt using template literals, which makes it easier to read.
            var image = $(`<img src="${currentValue.images.original_still.url}" alt="Giphy Gif" class="gif-img" data-alt="${currentValue.images.original.url}" />`);
        
            //append img element with the src: url for the gif to imgdiv
            imgDiv.append(image);

            display.prepend(imgDiv);
        });
    });
}

function randomGif() {
    
    var gif = $("#inputMeme").val().trim();
    var queryURL = "https://api.giphy.com/v1/gifs/random?api_key=FJg7DrUcAEW9bNpFc4A1qMg8PFMWpPU9&tag=" + gif + "&rating=PG-13";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        $("#randomGifs-display").empty();
        var randomDisplay = $("#randomGifs-display");
        
            var randomImgDiv = $("<div>").addClass("image-display");

            var randomImage = $(`<img src="${response.data.images.original_still.url}" alt="Giphy Gif" class="gif-img" data-alt="${response.data.images.original.url}" />`);

            randomImgDiv.append(randomImage);
            randomDisplay.prepend(randomImgDiv);   
});
}

// This function will switch the still image and with the gif image url.
function playGif(clickGif) {
    var static = $(clickGif).attr("src");
    var dynamic = $(clickGif).attr("data-alt");
    $(clickGif).attr("src", dynamic);
    $(clickGif).attr("data-alt", static);
}


$(document).on("click", "#search_button", displayGif);
$(document).on("click", "#random_button", randomGif);

// This event listener is triggered when the user clicks a gif.
$(document).on("click", ".gif-img", function () {
    playGif(this);
});


