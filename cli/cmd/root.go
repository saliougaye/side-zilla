package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "sidezilla",
	Short: "Side-zilla is a cli for save and share files",
	Long:  "Side-zilla is a cli for save and share files",
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {

		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
