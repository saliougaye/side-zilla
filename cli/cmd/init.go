package cmd

import (
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

		// TODO login and/or refresh token

		// TODO save in keychain or securely

	},
}
