const modal = document.querySelector('.modal-container');
const modalShow = document.querySelector('.show-modal');
const modalClose = document.querySelector('.close');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteURLEl = document.getElementById('website-url');
const bookmarkContainer = document.querySelector('.container');

let bookmarks = [];

function showModal() {
	modal.classList.add('show-modal');
	websiteNameEl.focus();
}

function closeModal() {
	modal.classList.remove('show-modal');
}

modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
	if (e.target === modal) {
		modal.classList.remove('show-modal')
	} else {
		return;
	}
})

function validate(nameValue, nameURL) {
	const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
	const regex = new RegExp(expression);
	if (!nameValue || !nameURL) {
		alert('please submit value for both fields');
		return false;
	}
	if (!nameURL.match(regex)) {
		alert('please provide a valid web address');
		return false;
	}
	return true;
};

function buildBookmarks() {
	bookmarkContainer.textContent = '';
	bookmarks.forEach(bookmark => {
		const { name, url } = bookmark;
		const item = document.createElement('div');
		item.classList.add('item');
		const closeIcon = document.createElement('img');
		closeIcon.setAttribute('src', 'icons8-delete-48.png');
		closeIcon.setAttribute('height', '20')
		closeIcon.setAttribute('title', "delete bookmark");
		closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
		const linkInfo = document.createElement('div');
		linkInfo.classList.add('name');
		const favicon = document.createElement('img');
		favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
		favicon.setAttribute('alt', 'favicon');
		const link = document.createElement('a');
		link.setAttribute('href', `${url}`);
		link.setAttribute('target', '_blank');
		link.textContent = name;
		linkInfo.append(favicon, link, closeIcon);
		item.append(linkInfo);
		bookmarkContainer.append(item);
	})
};

function deleteBookmark(url) {
	bookmarks.forEach((bookmark, i) => {
		if (bookmark.url === url) {
			bookmarks.splice(i, 1);
		}
	});
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	fetchBookmarks();
}

function fetchBookmarks() {
	if (localStorage.getItem('bookmarks')) {
		bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
	} else {
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	}
	buildBookmarks();
};

function storeBookmark(e) {
	e.preventDefault();
	const nameValue = websiteNameEl.value;
	let nameURL = websiteURLEl.value;
	if (!nameURL.includes('http://', 'https://')) {
		nameURL = `${nameURL}`;
	}
	if (!validate(nameValue, nameURL)) return false;
	const bookmark = {
		name: nameValue,
		url: nameURL,
	};
	bookmarks.push(bookmark);
	localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	fetchBookmarks();
	bookmarkForm.reset();
	websiteNameEl.focus();
};

bookmarkForm.addEventListener('submit', storeBookmark);
fetchBookmarks();
