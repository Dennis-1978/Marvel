class MarvelService {
	_apiBase = "https://gateway.marvel.com:443/v1/public/";
	_apiKey = "apikey=92c035ac96fe4c4c6844f3bcc2ebf35c";

	getResource = async (url) => {
		let res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Cold not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	}

	getAllCharacters = async () => {
		const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);

		return res.data.results.map(this._transformCharacter);
	}

	getCharacter = async (id) => {
		const res =  await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);

		return this._transformCharacter(res.data.results[0])
	}

	_transformCharacter = (character) => {
		return {
			id: character.id,
			name: (character.name.length > 22) ? `${character.name.slice(0, 22)}...` : character.name,
			description: character.description ? `${character.description.slice(0, 210)}...` : "There is no description.",
			thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
			homepage: character.urls[0].url,
			wiki: character.urls[1].url
		}
	}
}

export default  MarvelService;