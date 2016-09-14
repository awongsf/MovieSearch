$('form').submit(function (evt) {
	
	evt.preventDefault();

	var omdbAPI = "http://www.omdbapi.com/?";
	var searchValue = $("#search").val();
	var year = $("#year").val();
	var omdbOptions = {
		s: searchValue,
		y: year
	};
	var imdbIDList = [];

	// If search returns a list of movies, add HTML to display them in
	// #movies unordered list.
	// If a movie does not contain a poster, display a poster placeholder.
	// If search returns nothing, display a message to notify the user.
	function displayMovies(data) {

		var moviesHTML = '';

		if (data.Response === "True") {

			$.each(data.Search, function (i, movie) {

				moviesHTML += '<li><div class="poster-wrap">';

				if (movie.Poster === "N/A") {

					moviesHTML += '<a href="#"><i class="material-icons poster-placeholder">crop_original</i></a></div>';

				} else {

					moviesHTML += '<a href="#"><img class="movie-poster" src="' + movie.Poster + '"></a></div>';	

				}

				moviesHTML += '<span class="movie-title">' + movie.Title + '</span>';
				moviesHTML += '<span class="movie-year">' + movie.Year + '</span></li>';
				imdbIDList.push(movie.imdbID);
			});

		} else if (data.Response === "False") {

			moviesHTML += '<li class="no-movies">';
			moviesHTML += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchValue + '.';
			moviesHTML += '</li>';
		}

		$("#movies").html(moviesHTML);
	}

	// Load JSON encoded data from Omdb API using movie title
	// and year search value. Then call displayMovies function.
	$.getJSON(omdbAPI, omdbOptions, displayMovies);

	$(document).on("click", ".poster-wrap", function() {

		var thisMovie = $(this).parent();
		var index = $("li").index(thisMovie);
		var imdbID = imdbIDList[index];
		var omdbMovieOptions = {
			i: imdbID,
			plot: "full"
		};

		// Use AJAX to load description page HTML into main-content div
		$(".main-content").load('description-page.html');
		// Remove main-content class for styling
		$("body > div:nth-child(2)").removeClass("main-content");

		// Populate description page HTML with movie info.
		function displayMovieInfo(data) {

			var descriptionMovieTitle = data.Title + " " + "(" + data.Year + ")";
			var imdbRating = "IMDB Rating: " + data.imdbRating;
			var imdbMoviePage = "http://www.imdb.com/title/" + data.imdbID;

			// Clear any previously viewed poster
			$(".description-movie-poster").attr("src", "");

			// If movie does not contain a poster, give a white background.
			// If movie contains a poster, attach the poster link
			if (data.Poster === "N/A") {
				$(".description-movie-poster").css("background-color", "white");
			} else {
				$(".description-movie-poster").attr("src", data.Poster);	
			}
			
			// Populate page with the movie title, imdb rating, 
			// plot description, and link to imdbMoviePage
			$(".description-movie-title").text(descriptionMovieTitle);
			$(".imdb-rating").text(imdbRating);
			$(".plot-description").text(data.Plot);
			$(".imdb-link").attr("href", imdbMoviePage);
		}

		// Load JSON encoded data from Omdb API, searching by imdbID of
		// the movie that was clicked.
		// Populate description page HTML with the data.
		$.getJSON(omdbAPI, omdbMovieOptions, displayMovieInfo);
	});
	
	// Go back to search results page
	$(document).on("click", ".search-results", function() {

		var movieListHTML = '<ul id="movies" class="movie-list"></ul>';

		// Restore index HTML to original
		$("body > div:nth-child(2)").addClass("main-content");
		$(".description-page").remove();
		$(".main-content").html(movieListHTML);

		// Run search again to display previous movie results
		$.getJSON(omdbAPI, omdbOptions, displayMovies);
	});

});