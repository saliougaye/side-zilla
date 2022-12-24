package cmd

import (
	"errors"
	"fmt"
	"os"

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

		v, err := os.Stat(args[0])

		if err != nil {

			fmt.Println(err.Error())
			os.Exit(1)
		}

		if v.IsDir() {
			fmt.Println(errors.New("cannot upload a directory").Error())
			os.Exit(1)
		}

		fmt.Printf("file: %s\n size: %d", v.Name(), v.Size())

	},
}
