import { Helmet } from "react-helmet";

import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";

const ComicsPage = () => {
	return (
		<>
			<Helmet>
				<meta
					name='description'
					content='Page with list of our comics'
				/>
				<title>Comics page</title>
			</Helmet>
			<AppBanner />
			<ErrorBoundary>
				<ComicsList />
			</ErrorBoundary>
		</>
	);
};

export default ComicsPage;
