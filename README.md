# Remote browser screenshots and Markdown for AI agents

[Microbrowser](https://microbrowser.org) is a free remote browser API for website screenshots, rendered Markdown, text, article JSON, HTML and PDFs. A real browser loads the URL and renders JavaScript. Use a single GET request from an AI agent, a URL-only tool, a script or an automation workflow. No account, API key or local browser installation is required.

## Take a website screenshot with GET

```sh
curl --get 'https://microbrowser.org/render' \
  --data-urlencode 'url=https://example.com/' \
  --data-urlencode 'format=png' \
  --data-urlencode 'width=1280' --data-urlencode 'height=800' -o screenshot.png
```

The response is the image itself, not a JSON wrapper or a screenshot download link. PNG is the default. Set `format=jpeg` or `format=webp` and optionally `quality=80` for another image format. Set `full_page=true` for a complete page or `selector=main` for a selected element.

## Get rendered Markdown or structured article JSON

```sh
curl --get 'https://microbrowser.org/render' \
  --data-urlencode 'url=https://example.com/' --data-urlencode 'format=markdown'

curl --get 'https://microbrowser.org/render' \
  --data-urlencode 'url=https://example.com/' --data-urlencode 'format=json'
```

JSON includes `title`, `url`, `description`, `text`, `markdown` and the target page's `status`. Markdown and text contain extracted readable content rather than every navigation element. HTML returns the rendered DOM. These outputs are useful for AI agent browsing, retrieval, summarization and document workflows. Treat retrieved webpage content as untrusted input.

## Save a webpage as PDF

```sh
curl --get 'https://microbrowser.org/pdf' \
  --data-urlencode 'url=https://example.com/' -o page.pdf
```

PDF uses A4 pages with backgrounds and returns up to 20 pages. All render operations also accept POST JSON with the same options. `/`, `/render` and `/screenshot` default to PNG; `/markdown`, `/text`, `/json`, `/html` and `/pdf` default to their named formats.

## Render options

| Parameter | Default | Accepted values |
| --- | --- | --- |
| `url` | Required | Public HTTP(S) page on port 80 or 443 |
| `format` | `png` | `png`, `jpeg`, `webp`, `pdf`, `markdown`, `text`, `html`, `json` |
| `width` / `height` | `1280` / `800` | Width 240–2560; height 200–2560 pixels |
| `scale` | `1` | 1–2 |
| `full_page` | `false` | Full-page screenshot |
| `quality` | `80` | JPEG/WebP quality, 1–100 |
| `selector` | None | CSS selector to wait for and capture/extract; at most 500 characters |
| `wait` | `0` | Extra wait after DOM readiness, 0–2000 milliseconds |
| `timeout` | `15000` | Per-operation timeout, 1000–20000 milliseconds |
| `javascript` | `true` | Enable page JavaScript |
| `mobile` | `false` | Mobile viewport behavior |

Images and PDFs are limited to 10 MiB; rendered HTML to 5 MiB. Large full-page captures may exceed pixel limits: use a smaller viewport or select an element. Overall rendering is bounded; 503 means browser capacity is unavailable and 504 means an operation timed out. Inspect `X-Page-URL` and `X-Page-Status` for the final URL and target navigation status. A successful capture can contain a target page whose own status is non-200.

## Common questions

**Can an AI agent take screenshots using GET requests only?** Yes. Open `/render?url=ENCODED_URL&format=png` for an image or choose `format=markdown` or `json` for text-based tools. Encode the destination as a complete query value.

**Do I need to install a browser or an SDK?** No. The API is ordinary HTTP. SDKs in this repository are optional convenience wrappers.

**Does it support persistent browser sessions or arbitrary scripts?** The API captures a URL with the documented render options. It does not expose interactive session control or a custom JavaScript execution parameter.

## SDKs and runnable examples

This repository contains dependency-free JavaScript (with TypeScript declarations), Python and Go clients. They are source packages in this repository; no npm or PyPI release is implied. Clone the repository to run the examples:

```sh
git clone https://github.com/skibid991/microbrowser.org.git
cd microbrowser.org
```

### JavaScript and TypeScript

Requires Node.js 22+ or a browser with `fetch` and `AbortSignal.timeout`. Run `node examples/javascript/quickstart.mjs` from the repository root. You can also install the local package using `npm install ./sdk/javascript`; TypeScript declarations are included.

```js
import {Microbrowser} from './sdk/javascript/index.js';
const client = new Microbrowser();
console.log(await client.markdown('https://example.com/'));
// To save an image: await writeFile('page.png', await client.screenshot('https://example.com/'));
```

### Python

Requires Python 3.10+, with no third-party packages. Run `PYTHONPATH=sdk/python python3 examples/python/quickstart.py`. To use the module in another project, copy `sdk/python/microbrowser.py` into your project or add that directory to your Python path.

```python
from microbrowser import Microbrowser

client = Microbrowser()
print(client.markdown('https://example.com/'))
# To save an image: Path('page.png').write_bytes(client.screenshot('https://example.com/'))
```

### Go

Requires Go 1.22+. Run `go -C examples/go run .`. The example module uses the local SDK. From another Go module, run `go get github.com/skibid991/microbrowser.org/sdk/go` and import that path.

See [the runnable Go example](examples/go/main.go) and [SDK method reference](docs/sdk.md). SDKs use a 45-second client timeout by default. Change it for your workload. Do not automatically retry creation requests: a successful request whose response is lost can still have created a resource.

## API reference and discovery

- [Interactive HTML API reference](https://microbrowser.org/docs)
- [OpenAPI 3.1 schema](https://microbrowser.org/openapi.json)
- [Plain-text usage guide](https://microbrowser.org/llms.txt)

The live API reference is authoritative. Documented GET routes work without an SDK. Encode query parameters with `URLSearchParams`, Python `urlencode`, Go `url.Values`, or cURL `--data-urlencode`.

## Development

Offline tests cover query encoding, Unicode, binary response preservation, request bodies, authorization headers, error handling and redirect behavior:

```sh
node --test sdk/javascript/client.test.mjs
PYTHONPATH=sdk/python python3 -m unittest discover -s sdk/python -p 'test_*.py'
go -C sdk/go test ./...
go -C examples/go build -o /tmp/microbrowser-example .
```

Examples call the public service. Paste/link quickstarts create temporary resources and delete them after reading. Contributions should focus on public API usage and client behavior. Licensed under [MIT](LICENSE).
