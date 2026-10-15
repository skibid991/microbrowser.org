package main

import (
	"context"
	"fmt"
	clientpkg "github.com/skibid991/microbrowser.org/sdk/go"
	"log"
)

func must(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
func main() {
	ctx := context.Background()
	client := clientpkg.New()
	r, err := client.Markdown(ctx, "https://example.com/", nil)
	must(err)
	fmt.Println(r.Text())
}
