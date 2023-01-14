package auth

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"time"

	"github.com/skratchdot/open-golang/open"
)

type InitCommand struct {
}

func NewInitCommand() *InitCommand {
	return &InitCommand{}
}

func (ic *InitCommand) Run() {
	authUrl := "http://localhost:8090"

	fmt.Println("Redirect to login....")
	time.Sleep(1 * time.Second)
	open.Run(authUrl)
	time.Sleep(1 * time.Second)

	http.HandleFunc("/oauth/callback", callbackHandler)
	log.Fatal(http.ListenAndServe(":9999", nil))

}

func callbackHandler(w http.ResponseWriter, r *http.Request) {
	queryParts, _ := url.ParseQuery(r.URL.RawQuery)

	token := queryParts["token"][0]

	// TODO save in keychain or securely
	fmt.Println(token)

	msg := "<p>Token received</p>"

	fmt.Fprintf(w, msg)

	// TODO add chain to close http server
}
