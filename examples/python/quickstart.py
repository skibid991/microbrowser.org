from microbrowser import Microbrowser

client = Microbrowser()
print(client.markdown('https://example.com/'))
# To save an image: Path('page.png').write_bytes(client.screenshot('https://example.com/'))
