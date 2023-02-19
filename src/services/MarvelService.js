import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, error, request, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=92c035ac96fe4c4c6844f3bcc2ebf35c';
    const _baseOffset = 210;

    // returns an object with data about all characters from the server
    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(
            `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
        );

        return res.data.results.map(_transformChar);
    };

    // returns an object with data about a specific character from the server
    const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}&${_apiKey}`);

		return _transformChar(res.data.results[0]);
	};

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(
            `${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`
        );

        return res.data.results.map(_transformComics);
    };

    // returns the object with the converted data
    const _transformChar = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description === '' 
                ? 'There is no description for this character.' 
                : char.description.substr(0, 100).concat('...'),
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            // this is array with data
            comicsList: char.comics.items
        };
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount
                ? `${comics.pageCount}`
                : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            price: comics.prices[0].price
                ? `${comics.prices[0].price}$`
                : 'not availabal',
        };
    };

    return {
        getAllCharacters: getAllCharacters,
        getCharacter: getCharacter,
        getAllComics: getAllComics,
        loading: loading,
        error: error,
        clearError: clearError,
    };
}

export default useMarvelService;