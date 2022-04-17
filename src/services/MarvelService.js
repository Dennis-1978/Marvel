import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
	const {loading, request, error, clearError} = useHttp();

	const _apiBase = "https://gateway.marvel.com:443/v1/public/";
	const _apiKey = "apikey=92c035ac96fe4c4c6844f3bcc2ebf35c";
	const _baseOffset = 210;

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);

		return res.data.results.map(_transformCharacter);
	}

	const getCharacter = async (id) => {
		const res =  await request(`${_apiBase}characters/${id}?${_apiKey}`);

		return _transformCharacter(res.data.results[0])
	}

	const _transformCharacter = (character) => {
		return {
			id: character.id,
			name: (character.name.length > 22) ? `${character.name.slice(0, 22)}...` : character.name,
			description: character.description ? `${character.description.slice(0, 210)}...` : "There is no description.",
			thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
			homepage: character.urls[0].url,
			wiki: character.urls[1].url,
			comics: character.comics.items,
		}
	}

	return {loading, error, clearError, getAllCharacters, getCharacter}
}

export default  useMarvelService;