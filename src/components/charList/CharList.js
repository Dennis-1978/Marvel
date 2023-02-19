import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/spinner';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const CharList = (props) => {
	const [charList, setCharList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false); // state for the load more button
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const { loading, error, getAllCharacters } = useMarvelService();

	useEffect(() => {
		onRequest(offset, true);
    }, []);

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);

		getAllCharacters(offset)
			.then(onCharsLoaded)
	};

	const onCharsLoaded = (newCharList) => {
		let ended = false;

		if (newCharList.length < 9) {
			ended = true;
		}

		setCharList(charList => [...charList, ...newCharList]);
		setNewItemLoading(newItemLoading => false);
		setOffset(offset => offset + 9);
		setCharEnded(charEnded => ended);
	};

	// use of refs
	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

	function renderItems (arr) {
		const items = arr.map((item, index) => {
			const imgStyle = item.thumbnail.includes('image_not_available') 
				? {objectFit: 'contain'} 
				: {objectFit: 'cover'};
			return (
				<li 
					className="char__item"
					tabIndex={0}
					ref={el => itemRefs.current[index] = el}
					key={item.id}
					onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(index);
                    }}
					onKeyDown={(event) => {
                        if (event.key === ' ' || event.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(index);
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

	const items = renderItems(charList);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading && !newItemLoading ? <Spinner /> : null;

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{items}
			<button 
				className="button button__main button__long"
				disabled={newItemLoading}
				style={{'display': charEnded ? 'none' : 'block'}}
				onClick={() => onRequest(offset)}>
				<div className="inner">load more</div>
			</button>
		</div>
	);
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
};

export default CharList;