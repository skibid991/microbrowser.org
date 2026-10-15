import {writeFile} from 'node:fs/promises';
import {Microbrowser} from '../../sdk/javascript/index.js';
const client = new Microbrowser();
const article = await client.article('https://example.com/');
console.log(article.title, article.status, article.markdown);
await writeFile('page.png', await client.screenshot('https://example.com/', {width: 1280, height: 800}));
await writeFile('page.pdf', await client.pdf('https://example.com/'));
