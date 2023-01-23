package cmd

import (
	"fmt"
	"os"
	"path/filepath"

	homedir "github.com/mitchellh/go-homedir"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var rootCmd = &cobra.Command{
	Use:   "sidezilla",
	Short: "Side-zilla is a cli for save and share files",
	Long:  "Side-zilla is a cli for save and share files",
}

var (
	cfgType     = "yml"
	cfgFileName = ".sidezilla"
	cfgHome     string
)

func init() {
	cobra.OnInitialize(initConfig)
}

func initConfig() {

	cfgType = "yml"
	cfgFileName = ".sidezilla"

	home, err := homedir.Dir()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	cfgHome = home
	cfgPath := filepath.Join(cfgHome, cfgFileName+"."+cfgType)

	viper.AddConfigPath(cfgHome)
	viper.SetConfigName(cfgFileName)
	viper.SetConfigType(cfgType)

	_, err = os.Stat(cfgPath)

	if err != nil {
		if !os.IsExist(err) {
			if _, err := os.Create(cfgPath); err != nil {
				fmt.Println("Can't write config:", err)
				os.Exit(1)
			}
		} else {
			fmt.Println("Can't read config:", err)
		}
	}

	if err := viper.ReadInConfig(); err != nil {
		fmt.Println("Can't read config:", err)
		os.Exit(1)
	}

}

func Execute() {
	if err := rootCmd.Execute(); err != nil {

		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
