import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import AppBanner from '../appBanner/AppBanner'; 

import './singleComicPage.scss';

const SingleComicPage = () => {

    const {comicId} = useParams();
    const [comic, setComic] = useState(null);

    const { getComic, clearError, process, setProcess } = useMarvelService();

    useEffect(() => {
		updateComic();
	}, [comicId]);

	const updateComic = () => {
		clearError();
		getComic(comicId)
			.then(onComicLoaded)
            .then(() => setProcess('confirmed'));
	};

	// updates the local state with comic data
	const onComicLoaded = (comic) => {
		setComic(comic);
	};

    return (
        <>
            {setContent(process, View, comic)}
        </>
    )
}

const View = ({data}) => {
    const {thumbnail, title, description, pageCount, language, price} = data;
    
    return (
        <>
            <AppBanner />
            <div className="single-comic">
                <Helmet>
                    <meta
                        name="description"
                        content={`${title} comics book`}
                        />
                    <title>{title}</title>
                </Helmet>
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
        </>
    );
};

export default SingleComicPage;