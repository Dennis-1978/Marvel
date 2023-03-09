import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import AppBanner from '../appBanner/AppBanner';

import './singleCharPage.scss';

const SingleCharPage = () => {

    const {charId} = useParams();
    const [char, setChar] = useState(null);

    const { getCharacter, clearError, process, setProcess } = useMarvelService();

    useEffect(() => {
		updateChar();
	}, [charId]);

	const updateChar = () => {
		clearError();

		getCharacter(charId)
			.then(onCharLoaded)
            .then(() => setProcess('confirmed'));
	};

	// updates the local state with character data
	const onCharLoaded = (char) => {
		setChar(char);
	};

    return (
        <>
            <AppBanner />
            {setContent(process, View, char)}
        </>
    )
}

const View = ({data}) => {
    const {thumbnail, description, name} = data;

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