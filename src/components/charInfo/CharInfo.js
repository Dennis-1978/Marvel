import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {
	const [char, setChar] = useState(null);

	const { loading, error, getCharacter, clearError } = useMarvelService();

	useEffect(() => {
		updateChar();
	}, [props.charId]);

	const updateChar = () => {
		const {charId} = props;

		if (!charId) {
			return;
		}

		clearError();
		getCharacter(charId)
			.then(onCharLoaded)
	};

	// updates the local state with character data
	const onCharLoaded = (char) => {
		setChar(char);
	};

	const skeleton = !(char || loading || error) ? <Skeleton /> : null;
	const spinner = loading ? <Spinner /> : null;
	const errorMessage = error ? <ErrorMessage /> : null;

	// if there is no load, no error, but there is a character
	const content = !(loading || error || !char) ? <View char={char} /> : null;

	return (
		<div className="char__info">
			{skeleton}
			{spinner}
			{errorMessage}
			{content}
		</div>
	);
}

const View = ({char}) => {
	const {name, thumbnail, description, homepage, wiki, comics} = char;

	const imgStyle = thumbnail.includes('image_not_available') 
		? {objectFit: 'contain'} 
		: {objectFit: 'cover'};

	const content = comics.map((item, i) => {
		if (i > 9) {
			return;
		}
		return (
			<li key={i} className="char__comics-item">
				{item.name}
			</li>
		);
	});
	
	const getEmptyComicsList = () => {
		if (!comics.length) {
			return (
				<li style={
						{
							color: '#9F0013', 
							borderRadius: '4px',
							textAlign: 'center',
						}
					} 
					className="char__comics-item">
					This character has no more comic books.
				</li>
			);
		}
	};

	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} alt={name} style={imgStyle} />
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">
				{description}
			</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				{content}
				{getEmptyComicsList()}
			</ul>
		</>
	);
};

CharInfo.propTypes = {
	charId: PropTypes.number
};

export default CharInfo;