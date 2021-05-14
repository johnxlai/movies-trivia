const movieTriviaApp = {};
console.log(movieTriviaApp);

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
      console.log(results.genres);
    })
    .catch(function () {
      alert("broke");
    });
};

//display genre buttons

movieTriviaApp.displayGenre = (genres) => {
  genres.forEach((genre) => {
    // console.log(genre);

    let htmlButton = `
       <button class="${genre.name}" type="button">${genre.name}</button>
    `;

    movieTriviaApp.htmlElements.genreBtns.append(htmlButton);

    $("");
  });
};

//when user selects genre, call api choose 10 movies

// display the 10 movies

//user selects a movie, trivia begins

//

movieTriviaApp.init = () => {
  movieTriviaApp.getGenre();

  //grab genre btns container

  movieTriviaApp.htmlElements = {};
  movieTriviaApp.htmlElements.genreBtns = $(".genre-btns-container");
};
$(function () {
  movieTriviaApp.init();
});
