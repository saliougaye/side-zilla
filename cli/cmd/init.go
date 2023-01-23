package cmd

import (
	"github.com/saliougaye/side-zilla/internal/auth"
	"github.com/spf13/cobra"
)

func init() {

	rootCmd.AddCommand(initCmd)
}

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Init sidezilla cli",
	Long:  "",
	Run: func(cmd *cobra.Command, args []string) {
		command := auth.NewInitCommand()

		command.Run()

	},
}
