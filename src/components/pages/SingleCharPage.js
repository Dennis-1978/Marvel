import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from '../appBanner/AppBanner';

import './singleCharPage.scss';

const SingleCharPage = () => {

    const {charId} = useParams();
    const [char, setChar] = useState(null);

    const { loading, error, getCharacter, clearError } = useMarvelService();

    useEffect(() => {
		updateChar();
	}, [charId]);

	const updateChar = () => {
		clearError();

		getCharacter(charId)
			.then(onCharLoaded);
	};

	// updates the local state with character data
	const onCharLoaded = (char) => {
		setChar(char);
	};

    const spinner = loading ? <Spinner /> : null;
	const errorMessage = error ? <ErrorMessage /> : null;

	// if there is no load, no error, but there is a character
	const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <>
            <AppBanner />
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

const View = ({char}) => {
    const {thumbnail, description, name} = char;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={name} className="single-comic__char-img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
            </div>
        </div>
    );
};

export default SingleCharPage;