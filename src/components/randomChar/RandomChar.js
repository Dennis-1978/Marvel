import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
	state = {
		char: {},
		loading: true,
		error: false,
	};

	marvelService = new MarvelService();
	
	componentDidMount() {
		this.updateChar();
	}

	// updates the local state with character data
	onCharLoaded = (char) => {
		this.setState({
			char: char,
			loading: false,
			error: false
		});
	};

	onCharLoading = () => {
        this.setState({
            loading: true
        })
    }
	
	// updates a received, random character
	updateChar = () => {
		const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

		this.onCharLoading();

		this.marvelService
			.getCharacter(id)
			.then(this.onCharLoaded)
			.catch(this.onError);
	};

	onError = () => {
		this.setState({
			loading: false,
			error: true
		});
	};

	render() {
		const {char, loading, error} = this.state;
		
		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error) ? <View char={char}/> : null;

		return (
			<div className="randomchar">
				{errorMessage}
				{spinner}
				{content}
				<div className="randomchar__static">
					<p className="randomchar__title">
						Random character for today!<br/>
						Do you want to get to know him better?
					</p>
					<p className="randomchar__title">
						Or choose another one
					</p>
					<button 
						className="button button__main"
						onClick={() => this.updateChar()}
					>
						<div className="inner">try it</div>
					</button>
					<img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
				</div>
			</div>
		);
	}
}

const View = ({char}) => {
	const {name, description, thumbnail, homepage, wiki} = char;

	const imgStyle = thumbnail.includes('image_not_available') 
		? {objectFit: 'contain'} 
		: {objectFit: 'cover'};

	return (
		<div className="randomchar__block">
			<img style={imgStyle} src={thumbnail} alt={name} className="randomchar__img"/>
			<div className="randomchar__info">
				<p className="randomchar__name">{name}</p>
				<p className="randomchar__descr">
					{description}
				</p>
				<div className="randomchar__btns">
					<a href={homepage} className="button button__main">
						<div className="inner">homepage</div>
					</a>
					<a href={wiki} className="button button__secondary">
						<div className="inner">Wiki</div>
					</a>
				</div>
			</div>
		</div>
	);
};

export default RandomChar;