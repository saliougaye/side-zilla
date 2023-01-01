package cmd

import (
	"errors"
	"fmt"
	"os"

	"github.com/saliougaye/side-zilla/internal"
	"github.com/saliougaye/side-zilla/internal/upload"
	"github.com/saliougaye/side-zilla/internal/utils"
	"github.com/spf13/cobra"
)

func init() {

	rootCmd.AddCommand(uploadCmd)
}

var uploadCmd = &cobra.Command{
	Use:   "upload",
	Short: "Upload to sidezilla",
	Long:  "",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 1 {
			return errors.New("requires only one arg")
		}

		if len(args) > 1 {
			return errors.New("requires only one arg")
		}

		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		filepath := args[0]

		client := utils.NewHttpClient(internal.UploadBaseUrl)
		// FIXME check size based on user plan
		command := upload.NewUploadCommand(client, 5242880)

		l, err := command.Run(filepath)

		if err != nil {
			fmt.Println(err.Error())
			os.Exit(1)
			return
		}
		utils.PrintTable(
			[]string{
				"Download Url",
				"Expire At",
			},
			[][]string{
				{
					l.Url,
					l.ExpireAt.String(),
				},
			},
		)

		os.Exit(0)

	},
}
