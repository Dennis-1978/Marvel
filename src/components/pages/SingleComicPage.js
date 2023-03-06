import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleComicPage.scss';

const SingleComicPage = () => {

    const {comicId} = useParams();
    const [comic, setComic] = useState(null);

    const { loading, error, getComic, clearError } = useMarvelService();

    useEffect(() => {
		updateComic();
	}, [comicId]);

	const updateComic = () => {
		clearError();
		getComic(comicId)
			.then(onComicLoaded)
	};

	// updates the local state with comic data
	const onComicLoaded = (comic) => {
		setComic(comic);
	};

    const spinner = loading ? <Spinner /> : null;
	const errorMessage = error ? <ErrorMessage /> : null;

	// if there is no load, no error, but there is a comic
	const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

    return (
        <>
            {spinner}
            {errorMessage}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {thumbnail, title, description, pageCount, language, price} = comic;
    
    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    );
};

export default SingleComicPage;