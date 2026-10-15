# microbrowser.org SDK reference

All clients use only the public HTTP API. No API key is needed.

| JavaScript | Python | Go | Behavior |
| --- | --- | --- | --- |
| `render(url, options)` | `render(url, **options)` | `Render(ctx, url, params)` | Raw response. JavaScript/Python accept method POST; Go Request supports POST JSON. |
| `markdown(url, options)` | `markdown(url, **options)` | `Markdown(ctx, url, params)` | Rendered readable Markdown. |
| `article(url, options)` | `article(url, **options)` | `Article(ctx, url, params)` | Article JSON; JavaScript/Python decode it automatically. |
| `screenshot(url, options)` | `screenshot(url, **options)` | `Screenshot(ctx, url, params)` | PNG by default; format can be jpeg/webp. JavaScript returns Uint8Array, Python bytes, Go Response.Body. |
| `pdf(url, options)` | `pdf(url, **options)` | `PDF(ctx, url, params)` | PDF bytes. Save without text conversion. |

## Transport, errors and binary data

JavaScript uses native `Response`, including `.text()`, `.json()`, `.arrayBuffer()`, `.status` and `.headers`. Python returns `Response` with `.body` bytes, `.text()`, `.json()`, `.status` and `.headers`. Go returns `*Response` with `Body []byte`, `Text()`, `JSON(&value)`, `StatusCode` and `Header`.

Low-level request methods accept an API path, query parameters, method, headers and body. JavaScript/Python encode object bodies as JSON; Go uses `Options.Body` for JSON and `Options.RawBody` for bytes. Redirects remain visible by default. Non-2xx statuses raise `APIError` unless disabled through JavaScript/Python `check: false` / `check=False` or Go `AllowHTTPError: true`. Methods intended to return arbitrary HTTP statuses disable that check automatically. Network errors and timeouts remain ordinary runtime errors.

Clients do not perform automatic retries. A timeout does not prove a creation request failed. Binary responses must be saved as bytes. These convenience clients buffer responses; use your language's native HTTP streaming client for long-lived SSE or incremental reads.

## Custom settings

JavaScript: `new Microbrowser({timeout: 60000})`; inject a fetch implementation with `fetch: myFetch`.

Python: `Microbrowser(timeout=60)`.

Go: `client := microbrowser.New()`; configure `client.HTTPClient.Timeout` and pass a cancellable context to each method. Timeout units are milliseconds in JavaScript, seconds in Python, and `time.Duration` in Go.

For testing, override JavaScript `baseUrl`, Python `base_url`, or Go `BaseURL`. Production defaults to `https://microbrowser.org`.
