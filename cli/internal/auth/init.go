package auth

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/saliougaye/side-zilla/internal/model"
	"github.com/skratchdot/open-golang/open"
	"github.com/spf13/viper"
)

type InitCommand struct {
}

func NewInitCommand() *InitCommand {
	return &InitCommand{}
}

func (ic *InitCommand) Run() {
	authUrl := "http://127.0.0.1:8090"

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

	viper.SetDefault("token", token)

	err := viper.WriteConfig()

	if err != nil {
		fmt.Fprintln(os.Stderr, "token not saved: "+err.Error())
	}

	msg := "<p>Token received</p>"

	io.WriteString(w, msg)

	os.Exit(0)
}

func GetToken() (string, error) {

	token := viper.GetString("token")

	if len(token) == 0 {
		fmt.Println("please, first do 'sidezilla init'")
		os.Exit(1)

		return "", model.ErrNotAuthorized
	}

	return token, nil
}
