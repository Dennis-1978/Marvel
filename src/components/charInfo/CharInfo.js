import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			char: null,
			loading: false,
			error: false
		};
	}

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.charId !== prevProps.charId) {
			this.updateChar();
		}
	}

	updateChar = () => {
		const {charId} =this.props;

		if (!charId) {
			return;
		}

		this.onCharLoading();
		this.marvelService
			.getCharacter(charId)
			.then(this.onCharLoaded)
			.catch(this.onError);
	};

	onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

	// updates the local state with character data
	onCharLoaded = (char) => {
		this.setState({
			char: char,
			loading: false,
			error: false
		});
	};

	onError = () => {
		this.setState({
			loading: false,
			error: true
		})
	};

    render() {
		const {char, loading, error} = this.state;

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
}

const View = ({char}) => {
	const {name, thumbnail, description, homepage, wiki, comicsList} = char;

	const imgStyle = thumbnail.includes('image_not_available') 
		? {objectFit: 'contain'} 
		: {objectFit: 'cover'};

	const content = comicsList.map((item, i) => {
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
		if (!comicsList.length) {
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

export default CharInfo;