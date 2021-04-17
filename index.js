const autoCompleteonfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src = "${imgSrc}" / >
            ${movie.Title} (${movie.Year})
        `;
    },

    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const res = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: 'f8fd17b',
                s: searchTerm
            }
        });

        if (res.data.Error) {
            return [];
        }
        return res.data.Search;
    }
};

createAutoComplete({
    ...autoCompleteonfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});

createAutoComplete({
    ...autoCompleteonfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElemment, side) => {
    const res = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'f8fd17b',
            i: movie.imdbID
        }
    });

    summaryElemment.innerHTML = movieTemplate(res.data);

    if (side === 'left') {
        leftMovie = res.data;
    } else {
        rightMovie = res.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#left-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        const leftSideValue = +leftStat.dataset.value;
        const rightSideValue = +rightStat.dataset.value;

        if (rightSideValue > leftSideValue) {
            leftStat.classList.replace('is-primary', 'is-warning');
        } else {
            rightStat.classList.replace('is-primary', 'is-warning');
        }
    })
}

const movieTemplate = movieDetail => {
    const {
        Poster,
        Title,
        Genre,
        Plot,
        Awards,
        BoxOffice,
        Metascore,
        imdbRating,
        imdbVotes
    } = movieDetail;

    const dollars = +BoxOffice.replace(/\$/g, '').replace(/,/g, '');
    const metascore = +Metascore;
    const rating = +imdbRating;
    const votes = +imdbVotes.replace(/,/g, '');
    const awards = Awards.split(' ').reduce((acc, cur) => {
        let val = +cur;
        if (!isNaN(val)) {
            return acc + val;
        } else {
            return acc;
        }
    }, 0);

    console.log(awards);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${Title}</h1>
                    <h4>${Genre}</h4>
                    <p>${Plot}</p>
                </div>
            </div>
        </article>
        <article data-value = ${awards} class='notification is-primary'>
            <p class='title'>${Awards}</p>
            <p class='subtitle'>Awards</p>
        </article>

         <article data-value = ${dollars} class = 'notification is-primary' >
             <p class='title'>${BoxOffice}</p>
            <p class='subtitle'>Box Office</p>
        </article>

        <article data-value = ${metascore} class = 'notification is-primary' >
            <p class='title'>${Metascore}</p>
            <p class='subtitle'>Metascore</p>
        </article>

        <article data-value = ${rating} class='notification is-primary'>
            <p class='title'>${imdbRating}</p>
            <p class='subtitle'>IMDB Rating</p>
        </article>

        <article data-value = ${votes} class='notification is-primary'>
            <p class='title'>${imdbVotes}</p>
            <p class='subtitle'>IMDB Votes</p>
        </article>


           
    `;
}