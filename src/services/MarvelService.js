class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=92c035ac96fe4c4c6844f3bcc2ebf35c';
    _baseOffset = 210;

    // sends a request to the server, returns the data
    getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    // returns an object with data about all characters from the server
    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(char => {
            return this._transformChar(char);
        });
    };

    // returns an object with data about a specific character from the server
    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformChar(res.data.results[0]);
    };

    // returns the object with the converted data
    _transformChar = (char) => {
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
}

export default MarvelService;