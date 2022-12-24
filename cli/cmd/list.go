package cmd

import (
	"github.com/spf13/cobra"
)

func init() {

	rootCmd.AddCommand(listCommand)
}

var listCommand = &cobra.Command{
	Use:   "list",
	Short: "List files saved on sidezilla",
	Long:  "",
	Run: func(cmd *cobra.Command, args []string) {

		// TODO request list of files

		// TODO order by expiration

	},
}
