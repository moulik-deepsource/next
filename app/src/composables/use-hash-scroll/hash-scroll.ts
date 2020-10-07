import { NavigationGuard } from 'vue-router';

function hashScroll(elementQuery: string) {
	const tryScrolling = (hash: string) => {
		const scrollingElement = document.querySelector(elementQuery);

		if (scrollingElement !== null) {
			let top = 0;

			if (hash !== '') {
				const ref = document.getElementById(hash.substr(1));
				if (ref !== null) top = ref.offsetTop - 85;
			}

			scrollingElement.scrollTo({ top: top, behavior: 'auto' });
		}
	};

	tryScrolling(window.location.hash);

	const navigation: NavigationGuard = (to, from, next) => {
		tryScrolling(to.hash);
		next((vue) => {
			tryScrolling(to.hash);
		});
	};
	return navigation;
}

export { hashScroll };
