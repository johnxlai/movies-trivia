const movieTriviaApp = {};
movieTriviaApp.htmlElements = {};
movieTriviaApp.functions = {};
movieTriviaApp.cssStyling = {};
movieTriviaApp.genreSelected;

//get genre
//api.themoviedb.org/3/genre/movie/list?api_key=<<api_key>>&language=en-US

movieTriviaApp.apiKey = "3c9a01ae287e63be5b9af537e6b1b3e3";
movieTriviaApp.getGenre = () => {
  $.ajax({
    url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${movieTriviaApp.apiKey}&language=en-US`,
    methond: "GET",
    dataType: "json",
  })
    .then(function (results) {
      movieTriviaApp.displayGenre(results.genres);
    })
    .catch(function () {
      alert("broke");
    });
};

//display genre buttons
movieTriviaApp.displayGenre = (genres) => {
  genres.forEach((genre) => {
    let htmlButton = `
       <button class="${genre.name} genre-button" type="button">${genre.name}</button>
    `;

    movieTriviaApp.htmlElements.genreBtnsContainer.append(htmlButton);
  });

  movieTriviaApp.functions.loopBtns();
};

//when user selects genre, call api choose 10 movies
//add event listener to all the buttons and on click grab the save the value of the selected button
movieTriviaApp.functions.loopBtns = () => {
  // console.log(genreBtns);
  $(".genre-button").on("click", function () {
    movieTriviaApp.genreSelected = $(this)[0].innerText;
    console.log(movieTriviaApp.genreSelected);
  });
};

// display the 10 movies

//user selects a movie, trivia begins

//

movieTriviaApp.init = () => {
  movieTriviaApp.getGenre();

  //grab genre btns container

  movieTriviaApp.htmlElements.genreBtnsContainer = $(".genre-btns-container");
};
$(function () {
  movieTriviaApp.init();
});
