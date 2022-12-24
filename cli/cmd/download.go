package cmd

import (
	"errors"

	"github.com/spf13/cobra"
)

var path string

func init() {

	downloadCmd.Flags().StringVar(&path, "path", "/your/path", "path where to save file")
	rootCmd.AddCommand(downloadCmd)
}

var downloadCmd = &cobra.Command{
	Use:   "download",
	Short: "Download file from sidezilla",
	Long:  "",
	Args: func(cmd *cobra.Command, args []string) error {
		// TODO check if is slug or an alias
		if len(args) < 1 {
			return errors.New("requires only one arg")
		}

		if len(args) > 1 {
			return errors.New("requires only one arg")
		}

		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {

		// TODO request the presign url link download

		// TODO download the file

		// TODO save the file in path

	},
}
