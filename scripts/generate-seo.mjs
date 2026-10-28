import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(projectDir, 'dist');
const origin = 'https://dashebooks.com';
const author = 'Kehinde Akinlolu OJO';
const defaultStore = 'https://payhip.com/dashe';
const source = fs.readFileSync(path.join(projectDir, 'script.js'), 'utf8');
const baseHtml = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8');

const slugify = value => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const bookPattern = /\{ title: '([^']+)', category: '([^']+)', image: '([^']+)', description: '([^']+)'([^}]*)\}/g;
const books = [...source.matchAll(bookPattern)].map(match => {
  const [, title, category, image, description, remainder] = match;
  const buyUrl = remainder.match(/buyUrl: '([^']+)'/)?.[1] || defaultStore;
  const slug = slugify(title);
  return { title, category, image, description, buyUrl, slug, url: `${origin}/${slug}` };
});

if (books.length < 30) throw new Error(`Expected the complete catalogue, found ${books.length} books.`);

function replaceOrInsert(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `  ${replacement}\n</head>`);
}

function setMeta(html, key, value, property = false) {
  const attribute = property ? 'property' : 'name';
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapedKey}["'][^>]*>`, 'i');
  return replaceOrInsert(html, pattern, `<meta ${attribute}="${key}" content="${value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}">`);
}

function setTitle(html, value) {
  return replaceOrInsert(html, /<title>[\s\S]*?<\/title>/i, `<title>${value}</title>`);
}

function setCanonical(html, url) {
  const canonical = `<link id="canonicalUrl" rel="canonical" href="${url}">`;
  return replaceOrInsert(html, /<link[^>]+rel=["']canonical["'][^>]*>/i, canonical);
}

function addSchema(html, schema) {
  const block = `<script type="application/ld+json" data-seo-schema>${JSON.stringify(schema)}</script>`;
  return replaceOrInsert(html, /<script[^>]+data-seo-schema[^>]*>[\s\S]*?<\/script>/i, block);
}

function bookSchema(book) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${book.url}#book`,
    name: book.title,
    description: book.description,
    url: book.url,
    image: `${origin}/assets/books/${book.image}`,
    genre: book.category,
    inLanguage: 'en',
    author: { '@type': 'Person', '@id': `${origin}/#author`, name: author },
    publisher: { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'DaSHe Books' },
    potentialAction: { '@type': 'BuyAction', target: book.buyUrl }
  };
}

for (const book of books) {
  const routeDir = path.join(outputDir, book.slug);
  const existing = fs.existsSync(path.join(routeDir, 'index.html'))
    ? fs.readFileSync(path.join(routeDir, 'index.html'), 'utf8')
    : baseHtml;
  const title = `${book.title} by ${author} | DaSHe Books`;
  const description = `${book.description} Discover ${book.title}, a ${book.category.toLowerCase()} book by ${author}.`;
  let html = setTitle(existing, title);
  html = setMeta(html, 'description', description);
  html = setMeta(html, 'robots', 'index, follow, max-image-preview:large, max-snippet:-1');
  html = setMeta(html, 'author', author);
  html = setMeta(html, 'og:type', 'book', true);
  html = setMeta(html, 'og:site_name', 'DaSHe Books', true);
  html = setMeta(html, 'og:title', title, true);
  html = setMeta(html, 'og:description', description, true);
  html = setMeta(html, 'og:url', book.url, true);
  html = setMeta(html, 'og:image', `${origin}/assets/books/${book.image}`, true);
  html = setMeta(html, 'og:image:alt', `${book.title} book cover`, true);
  html = setMeta(html, 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'twitter:title', title);
  html = setMeta(html, 'twitter:description', description);
  html = setMeta(html, 'twitter:image', `${origin}/assets/books/${book.image}`);
  html = setCanonical(html, book.url);
  html = addSchema(html, bookSchema(book));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.writeFileSync(path.join(routeDir, 'index.html'), html);
  fs.writeFileSync(path.join(outputDir, `${book.slug}.html`), html);
}

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: `${origin}/`,
      name: 'DaSHe Books',
      description: `The official bookstore of ${author}.`,
      publisher: { '@id': `${origin}/#organization` },
      inLanguage: 'en-GB'
    },
    {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'DaSHe Books',
      url: `${origin}/`,
      logo: { '@type': 'ImageObject', url: `${origin}/assets/dashe-books-logo.png` },
      founder: { '@id': `${origin}/#author` }
    },
    {
      '@type': 'Person',
      '@id': `${origin}/#author`,
      name: author,
      url: `${origin}/#author`,
      jobTitle: 'Author',
      worksFor: { '@id': `${origin}/#organization` }
    },
    {
      '@type': 'ItemList',
      name: `Books by ${author}`,
      numberOfItems: books.length,
      itemListElement: books.map((book, index) => ({ '@type': 'ListItem', position: index + 1, url: book.url, name: book.title }))
    }
  ]
};

fs.writeFileSync(path.join(outputDir, 'index.html'), addSchema(baseHtml, homeSchema));

const lastmod = new Date().toISOString().slice(0, 10);
const sitemapUrls = [`${origin}/`, ...books.map(book => book.url)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((url, index) => `  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod><changefreq>${index ? 'monthly' : 'weekly'}</changefreq><priority>${index ? '0.8' : '1.0'}</priority></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(outputDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);

console.log(`Generated SEO metadata for ${books.length} books.`);
