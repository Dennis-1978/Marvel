import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/spinner';

import './charList.scss';

class CharList extends Component {

	state = {
		charList: [],
		loading: true,
		error: false
	};

	marvelService = new MarvelService();

    componentDidMount() {
		this.marvelService
			.getAllCharacters()
			.then(this.onCharsLoaded)
			.catch(this.onError);
    }

	onCharsLoaded = (charList) => {
		this.setState({
			charList: charList,
			loading: false,
			error: false
		});
	};

	onError = () => {
		this.setState({
			loading: false,
			error: true
		});
	};

	renderItems(arr) {
		const items = arr.map(item => {
			const imgStyle = item.thumbnail.includes('image_not_available') 
				? {objectFit: 'contain'} 
				: {objectFit: 'cover'};

			return (
				<li 
					className="char__item"
					key={item.id}>
					<img style={imgStyle} src={item.thumbnail} alt={item.name}/>
					<div className="char__name">{item.name}</div>
				</li>
			);
		});

		return (
			<ul className="char__grid">
				{items}
			</ul>
		);
	}

    render() {
		const {charList, loading, error} = this.state;

		const items = this.renderItems(charList);

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
				{spinner}
				{content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}

export default CharList;