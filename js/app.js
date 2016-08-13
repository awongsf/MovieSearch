$('form').submit(function (evt) {
	evt.preventDefault();
	var omdbAPI = "http://www.omdbapi.com/?";
	var searchValue = $("#search").val();
	var omdbOptions = {
		s: searchValue
	};
	function displayMovies(data) {
		console.log(data);
		var moviesHTML = '';
		$.each(data.Search, function (i, movie) {
			moviesHTML += '<li><div class="poster-wrap">';
			moviesHTML += '<img class="movie-poster" src="' + movie.Poster + '"></div>';
			moviesHTML += '<span class="movie-title">' + movie.Title + '</span>';
			moviesHTML += '<span class="movie-year">' + movie.Year + '</span></li>';
		});
		$("#movies").html(moviesHTML);
	}
	$.getJSON(omdbAPI, omdbOptions, displayMovies);
});