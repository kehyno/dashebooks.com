const STORE = 'https://payhip.com/dashe';
const CANONICAL_ORIGIN = 'https://dashebooks.com';
const AUTHOR = 'Kehinde Akinlolu OJO';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const slugify = title => title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const books = [
  { title: 'In the God Class', category: 'Faith', image: 'in-the-god-class.webp', description: 'Life, authority, presence and the restoration of man in the divine economy.' },
  { title: 'The Wealth Operating System', category: 'Finance', image: 'wealth-operating-system.webp', description: 'Work on your thinking, organise your money and scale your assets.' },
  { title: 'Never Waste a Hello', category: 'Personal Growth', image: 'never-waste-a-hello.webp', description: 'How to turn small talk into confidence, connection and opportunity.' },
  { title: 'Data Science of Dating', category: 'Relationships', image: 'data-science-of-dating.webp', description: 'A practical framework for reading behaviour, recognising patterns and making clearer relationship choices.' },
  { title: 'Be Still and Know', category: 'Faith', image: 'be-still-and-know.webp', description: 'Lessons on God’s timing, stillness and divine positioning.' },
  { title: 'How to Escape Situationships and Choose Real Love', category: 'Relationships', image: 'how-to-escape-situationships.webp', description: 'A clear guide to leaving ambiguous connections and choosing mutual, committed love.' },
  { title: 'When No One Else Will', category: 'Faith', image: 'when-no-one-else-will.webp', description: 'Finding strength in God when everyone walks away.' },
  { title: 'Neither Do I Condemn You', category: 'Faith', image: 'neither-do-i-condemn-you.webp', description: 'A journey from condemnation to grace.' },
  { title: 'How to Improve Bone Health Using Ayurvedic Concepts', category: 'Health', image: 'improve-bone-health-ayurvedic.webp', description: 'A practical guide to strengthening Asthi Dhatu naturally.' },
  { title: 'The Courage to Breathe Again', category: 'Poetry', image: 'courage-to-breathe-again.webp', description: 'One hundred poems about courage, clarity and the strength to begin again.' },
  { title: 'At Thy Word', category: 'Faith', image: 'at-thy-word.webp', description: 'A reflective journey into trust, obedience and faith when the next step is not yet visible.' },
  { title: 'The Mystery of Blood', category: 'Faith', image: 'mystery-of-blood.webp', description: 'An inquiry into sacrifice, salvation, science and scripture.' },
  { title: 'King, X and the American Soul', category: 'Society', image: 'king-x-american-soul.webp', description: 'A study of political theology and power through the legacies of Martin Luther King Jr. and Malcolm X.' },
  { title: 'The Dialectic of Freedom', category: 'Society', image: 'dialectic-of-freedom.webp', description: 'A political philosophy of freedom examined through the ideas of Martin Luther King Jr. and Malcolm X.' },
  { title: 'The Checkmate Moment', category: 'Personal Growth', image: 'checkmate-moment.webp', description: 'A focused guide to mastering patience, positioning and timing in a hyperactive world.', buyUrl: 'https://payhip.com/b/E7fZh' },
  { title: 'The Abduction Catalogue', category: 'Mystery', image: 'abduction-catalogue.webp', description: 'A typological study of the UFO phenomenon and the patterns hidden within extraordinary accounts.', buyUrl: 'https://payhip.com/b/h3cwA' },
  { title: 'Stars, Trees, and Echoes', category: 'Poetry', image: 'stars-trees-echoes.webp', description: 'Poems that outlive us, carrying memory through nature, silence and time.' },
  { title: 'Light Still Lives Here', category: 'Poetry', image: 'light-still-lives-here.webp', description: 'One hundred poems of quiet renewal for seasons that ask us to find hope again.' },
  { title: 'Even the Trembling Walks', category: 'Poetry', image: 'even-the-trembling-walks.webp', description: 'One hundred poems of faith in motion, written for anyone learning to move despite fear.' },
  { title: 'How to Become Dangerous', category: 'Personal Growth', image: 'how-to-become-dangerous.webp', description: 'The art of commanding presence, complete confidence and unshakeable self-belief.' },
  { title: 'The Mindful Morning', category: 'Personal Growth', image: 'mindful-morning.webp', description: 'Five habits for a calmer, more productive day.' },
  { title: 'The Garden Within', category: 'Poetry', image: 'garden-within.webp', description: 'One hundred poems for healing, self-love and peace.' },
  { title: 'Integration or Nationalism', category: 'Society', image: 'integration-or-nationalism.webp', description: 'A comparative analysis of the King and X legacies and the competing visions they inspired.' },
  { title: 'The Way of Clarity', category: 'Personal Growth', image: 'way-of-clarity.webp', description: 'Twenty-two Japanese principles for focus, purpose and fulfilment.' },
  { title: 'Bermuda Triangle', category: 'Mystery', image: 'bermuda-triangle.webp', description: 'A nonfiction investigation of disappearances, myths and claims of return.' },
  { title: 'Lust for More', category: 'Technology', image: 'lust-for-more.webp', description: 'What modern men really crave in a digital age, and what ambition leaves behind.' },
  { title: 'Growing Minds in a Wired World', category: 'Technology', image: 'growing-minds-wired-world.webp', description: 'A science-based guide to raising capable, focused and resilient children in a connected age.' },
  { title: 'The Principle of Advance Forgiveness', category: 'Relationships', image: 'advance-forgiveness.webp', description: 'How forgiveness frees the heart before the apology arrives.', buyUrl: 'https://payhip.com/b/l2NJB' },
  { title: 'Eat That Frog First', category: 'Personal Growth', image: 'eat-that-frog-first.webp', description: 'A practical playbook for beating procrastination and taking control of your day.', buyUrl: 'https://payhip.com/b/EIRJh' },
  { title: 'The Border Between Dreams and Death', category: 'Thriller', image: 'border-between-dreams-and-death.webp', description: 'A cinematic survival thriller about migration, betrayal and the price of crossing toward hope.', buyUrl: 'https://payhip.com/b/1mMrN', landingPage: true },
  { title: 'The Lego Bridge of Chester-le-Street', category: 'Thriller', image: 'lego-bridge-chester-le-street.webp', description: 'A tense thriller where connection, memory and hidden structures carry deadly consequences.' },
  { title: 'The Man With Seven Names', category: 'Thriller', image: 'man-with-seven-names.webp', description: 'Seven names. Four continents. One identity that could never quite stay buried.', buyUrl: 'https://payhip.com/b/VzkoS', landingPage: true },
  { title: 'The Salt Road to Lampedusa', category: 'Thriller', image: 'salt-road-to-lampedusa.webp', description: 'A harrowing passage across land and sea where survival is only the first reckoning.', buyUrl: 'https://payhip.com/b/4aA9R' }
].map(book => {
  const slug = slugify(book.title);
  return { ...book, slug, src: `assets/books/${book.image}`, buyUrl: book.buyUrl || STORE, pageUrl: `${CANONICAL_ORIGIN}/${slug}` };
});

const featuredTitles = [
  'Be Still and Know',
  'Never Waste a Hello',
  'In the God Class',
  'The Wealth Operating System',
  'Data Science of Dating',
  'The Man With Seven Names',
];
const featured = featuredTitles.map(title => books.find(book => book.title === title));

const menuToggle = document.querySelector('#menuToggle');
const mobileMenu = document.querySelector('#mobileMenu');
mobileMenu.inert = true;
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileMenu.inert = !open;
  document.body.classList.toggle('menu-open', open);
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

const header = document.querySelector('.site-header');
const headerMarker = document.createElement('span');
headerMarker.setAttribute('aria-hidden', 'true');
headerMarker.style.cssText = 'position:absolute;top:5rem;width:1px;height:1px;pointer-events:none';
document.querySelector('.hero').append(headerMarker);
new IntersectionObserver(([entry]) => header.classList.toggle('fixed', !entry.isIntersecting), { threshold: 0 }).observe(headerMarker);

const coverDeck = document.querySelector('#coverDeck');
coverDeck.innerHTML = featured.map((book, index) => `<a class="deck-cover" href="/${book.slug}" data-index="${index}" data-open-book="${book.title}" aria-label="View ${book.title}"><img src="${book.src}" alt="${book.title} book cover" ${index ? 'loading="lazy"' : 'fetchpriority="high"'}></a>`).join('');
const deckCovers = [...coverDeck.children];
const heroIndex = document.querySelector('#heroIndex');
const heroBookTitle = document.querySelector('#heroBookTitle');
const heroProgress = document.querySelector('#heroProgress');
const pauseButton = document.querySelector('#heroPause');
let activeSlide = 0;
let carouselPaused = false;
let carouselTimer;
let carouselStarted = performance.now();

function carouselClass(index) {
  const diff = (index - activeSlide + featured.length) % featured.length;
  if (diff === 0) return 'active';
  if (diff === 1) return 'after';
  if (diff === featured.length - 1) return 'before';
  return diff < featured.length / 2 ? 'hidden-right' : 'hidden-left';
}
function renderCarousel(next) {
  activeSlide = (next + featured.length) % featured.length;
  deckCovers.forEach((cover, index) => cover.className = `deck-cover ${carouselClass(index)}`);
  heroIndex.textContent = String(activeSlide + 1).padStart(2, '0');
  heroBookTitle.textContent = featured[activeSlide].title;
  carouselStarted = performance.now();
  heroProgress.style.width = '0';
}
function resetCarousel() {
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => { if (!carouselPaused) renderCarousel(activeSlide + 1); }, 4500);
  carouselStarted = performance.now();
}
document.querySelector('#heroPrev').addEventListener('click', () => { renderCarousel(activeSlide - 1); resetCarousel(); });
document.querySelector('#heroNext').addEventListener('click', () => { renderCarousel(activeSlide + 1); resetCarousel(); });
pauseButton.addEventListener('click', () => {
  carouselPaused = !carouselPaused;
  pauseButton.textContent = carouselPaused ? '▶' : 'Ⅱ';
  pauseButton.setAttribute('aria-label', carouselPaused ? 'Play featured books' : 'Pause featured books');
  if (!carouselPaused) carouselStarted = performance.now();
});
document.querySelector('#heroStage').addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); renderCarousel(activeSlide - 1); resetCarousel(); }
  if (event.key === 'ArrowRight') { event.preventDefault(); renderCarousel(activeSlide + 1); resetCarousel(); }
});
let dragStart = 0;
document.querySelector('#heroStage').addEventListener('pointerdown', event => { dragStart = event.clientX; });
document.querySelector('#heroStage').addEventListener('pointerup', event => {
  const distance = event.clientX - dragStart;
  if (Math.abs(distance) > 45) { renderCarousel(activeSlide + (distance < 0 ? 1 : -1)); resetCarousel(); }
});
function animateCarouselProgress(now) {
  if (!carouselPaused && !prefersReducedMotion) heroProgress.style.width = `${Math.min((now - carouselStarted) / 45, 100)}%`;
  requestAnimationFrame(animateCarouselProgress);
}
renderCarousel(0);
resetCarousel();
requestAnimationFrame(animateCarouselProgress);

const streamTrack = document.querySelector('#streamTrack');
const streamMarkup = books.map(book => `<a class="stream-book" href="/${book.slug}" data-open-book="${book.title}" aria-label="View ${book.title}"><img src="${book.src}" alt="" loading="lazy"></a>`).join('');
streamTrack.innerHTML = streamMarkup + streamMarkup;
new IntersectionObserver(([entry]) => {
  streamTrack.classList.toggle('is-moving', entry.isIntersecting && !prefersReducedMotion);
}, { threshold: .12 }).observe(document.querySelector('.cover-stream'));

const bookGrid = document.querySelector('#bookGrid');
const filters = document.querySelector('#filters');
const search = document.querySelector('#bookSearch');
const count = document.querySelector('#resultCount');
const emptyState = document.querySelector('#emptyState');
let category = 'All';
const categories = ['All', ...new Set(books.map(book => book.category))];
filters.innerHTML = categories.map(name => `<button class="filter-button${name === 'All' ? ' active' : ''}" data-category="${name}" aria-pressed="${name === 'All'}">${name}</button>`).join('');

function bookCard(book, index) {
  return `<article class="book-card" style="animation-delay:${Math.min(index * .045, .4)}s"><a href="/${book.slug}" data-open-book="${book.title}" aria-label="View book: ${book.title}"><div class="book-image"><img src="${book.src}" alt="${book.title} book cover" loading="lazy"></div><div class="book-meta"><h3>${book.title}</h3><p>${book.category}</p><span>View book ↗</span></div></a></article>`;
}
function renderBooks() {
  const query = search.value.trim().toLowerCase();
  const visible = books.filter(book => (category === 'All' || book.category === category) && `${book.title} ${book.category} ${book.description}`.toLowerCase().includes(query));
  bookGrid.innerHTML = visible.map(bookCard).join('');
  count.textContent = `${visible.length} ${visible.length === 1 ? 'title' : 'titles'}`;
  emptyState.hidden = visible.length > 0;
}
filters.addEventListener('click', event => {
  const button = event.target.closest('.filter-button');
  if (!button) return;
  category = button.dataset.category;
  filters.querySelectorAll('button').forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderBooks();
});
search.addEventListener('input', renderBooks);
document.querySelector('#clearSearch').addEventListener('click', () => {
  search.value = ''; category = 'All';
  filters.querySelectorAll('button').forEach((button, index) => {
    button.classList.toggle('active', index === 0);
    button.setAttribute('aria-pressed', String(index === 0));
  });
  renderBooks(); search.focus();
});
renderBooks();

const dialog = document.querySelector('#bookDialog');
const dialogImage = document.querySelector('#dialogImage');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogCategory = document.querySelector('#dialogCategory');
const dialogDescription = document.querySelector('#dialogDescription');
const dialogLink = document.querySelector('#dialogLink');
const dialogPermalink = document.querySelector('#dialogPermalink');
const canonical = document.querySelector('#canonicalUrl');
const defaultTitle = document.title;
const defaultDescription = document.querySelector('meta[name="description"]').content;

function updateMetadata(book) {
  const description = book ? `${book.description} Discover ${book.title}, a ${book.category.toLowerCase()} book by ${AUTHOR}.` : defaultDescription;
  const url = book ? book.pageUrl : `${CANONICAL_ORIGIN}/`;
  document.title = book ? `${book.title} by ${AUTHOR} | DaSHe Books` : defaultTitle;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = book ? `${book.title} by ${AUTHOR} | DaSHe Books` : 'DaSHe Books | Books by Kehinde Akinlolu OJO';
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[property="og:url"]').content = url;
  canonical.href = url;
}

function openBook(title, updateUrl = true) {
  const book = books.find(item => item.title === title);
  if (!book) return;
  dialogImage.src = book.src;
  dialogImage.alt = `${book.title} book cover`;
  dialogTitle.textContent = book.title;
  dialogCategory.textContent = book.category;
  dialogDescription.textContent = book.description;
  dialogLink.href = book.buyUrl;
  dialogPermalink.href = book.pageUrl;
  updateMetadata(book);
  if (updateUrl && window.location.pathname !== `/${book.slug}`) history.pushState({ book: book.slug }, '', `/${book.slug}`);
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
}
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-open-book]');
  if (!trigger) return;
  const selectedBook = books.find(book => book.title === trigger.dataset.openBook);
  if (selectedBook?.landingPage && trigger.matches('a[href]')) return;
  event.preventDefault();
  openBook(trigger.dataset.openBook);
});
function closeDialog(updateUrl = true) {
  if (dialog.open) dialog.close();
  document.body.classList.remove('dialog-open');
  if (updateUrl && window.location.pathname !== '/') history.pushState({}, '', '/');
  updateMetadata(null);
}
document.querySelector('#dialogClose').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

function bookFromPath() {
  const slug = decodeURIComponent(window.location.pathname).replace(/^\/+|\/+$/g, '');
  return books.find(book => book.slug === slug);
}
const routedBook = bookFromPath();
if (routedBook) openBook(routedBook.title, false);
window.addEventListener('popstate', () => {
  const book = bookFromPath();
  if (book) openBook(book.title, false);
  else closeDialog(false);
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('visible');
  observer.unobserve(entry.target);
}), { threshold: .14 });
document.querySelectorAll('.reveal-up, .manifesto-line').forEach(element => observer.observe(element));

if (!prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach(element => {
    element.addEventListener('pointermove', event => {
      const box = element.getBoundingClientRect();
      element.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * .12}px, ${(event.clientY - box.top - box.height / 2) * .12}px)`;
    });
    element.addEventListener('pointerleave', () => element.style.transform = '');
  });
  const stage = document.querySelector('#heroStage');
  stage.addEventListener('pointermove', event => {
    const box = stage.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    coverDeck.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
  });
  stage.addEventListener('pointerleave', () => coverDeck.style.transform = '');
}

document.querySelector('#year').textContent = new Date().getFullYear();
