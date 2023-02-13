import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/spinner';

import './charList.scss';

class CharList extends Component {

	state = {
		charList: [],
		loading: true,
		error: false,
		newItemLoading: false,  // state for the load more button
		offset: 210,
		charEnded: false
	};

	marvelService = new MarvelService();

    componentDidMount() {
		this.onRequest();
    }

	onRequest = (offset) => {
		this.onCharListLoading();

		this.marvelService
			.getAllCharacters(offset)
			.then(this.onCharsLoaded)
			.catch(this.onError);
	};

	onCharListLoading = () => {
		this.setState({
			newItemLoading: true
		});
	};

	onCharsLoaded = (newCharList) => {
		let ended = false;

		if (newCharList.length < 9) {
			ended = true;
		}

		this.setState(({offset, charList}) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			error: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended
		}));
	};

	onError = () => {
		this.setState({
			loading: false,
			error: true
		});
	};

	// use of refs
	itemRefs = [];

	setRef = (ref) => {
		this.itemRefs.push(ref);
	};

	focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

	renderItems(arr) {
		const items = arr.map((item, index) => {
			const imgStyle = item.thumbnail.includes('image_not_available') 
				? {objectFit: 'contain'} 
				: {objectFit: 'cover'};
			return (
				<li 
					className="char__item"
					tabIndex={0}
					ref={this.setRef}
					key={item.id}
					onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(index);
                    }}
					onKeyDown={(event) => {
                        if (event.key === ' ' || event.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(index);
                        }
                    }}>
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
		const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;

		const items = this.renderItems(charList);

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
				{spinner}
				{content}
                <button 
					className="button button__main button__long"
					disabled={newItemLoading}
					style={{'display': charEnded ? 'none' : 'block'}}
					onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
};

export default CharList;