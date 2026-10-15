import {Microbrowser} from '../../sdk/javascript/index.js';
const client = new Microbrowser();
console.log(await client.markdown('https://example.com/'));
// To save an image: await writeFile('page.png', await client.screenshot('https://example.com/'));
