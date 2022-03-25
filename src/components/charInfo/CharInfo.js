import { Component } from "react";
import PropTypes from "prop-types";

import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import MarvelService from "../../services/MarvelService";
import Skeleton from "../skeleton/Skeleton";

import "./charInfo.scss";

class CharInfo extends Component {

	state = {
		char: null,
		loading: false,
		error: false
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar();
	}

	componentDidUpdate(prevProps) {
		if (this.props.charId !== prevProps.charId) {
			this.updateChar();
		}
	}

	updateChar = () => {
		const charId = this.props.charId;

		if (!charId) {
			return;
		}

		this.onCharLoading();

		this.marvelService.getCharacter(charId)
			.then(this.onCharLoaded)
			.catch(this.error)
	}

	onCharLoading = () => {
		this.setState({
			loading: true
		});
	}

	onCharLoaded = (char) => {
		this.setState({
			char: char,
			loading: false
		});
	}

	onError = () => {
		this.setState({
			error: true
		});
	}

	render() {
		const {char, loading, error} = this.state;

		const skeleton = (char || loading || error) ? null : <Skeleton />;
		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error || !char) ? <View char={char}/> : null;

		return (
			<div className="char__info">
				{errorMessage}
				{spinner}
				{content}
				{skeleton}
			</div>
		)
	}  
}

const View = ({char}) => {
	const {name, description, homepage, wiki, thumbnail, comics} = char;

	let imgStyle = {"objectFit" : "cover"};
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {"objectFit" : "contain"};
    }

	return(
		<>
			<div className="char__basics">
				<img
					src={thumbnail}
					alt={name}
					style={imgStyle}/>
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
				{comics.length > 0 ? null : "There is no comics with this character."}
				{	
					comics.map((item, i) => {
						if (i > 9) {
							return;
						}

						return (
							<li 
								className="char__comics-item"
								key={i}>
									{item.name}
							</li>
						);
					})
				}
			</ul>
		</>
	);
}

CharInfo.propTypes = {
	charId: PropTypes.number,
};

export default CharInfo;