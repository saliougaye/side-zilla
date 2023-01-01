package utils

import (
	"os"

	"github.com/jedib0t/go-pretty/v6/table"
)

func PrintTable(header []string, data [][]string) {

	t := table.NewWriter()

	t.SetOutputMirror(os.Stdout)
	t.AppendHeader(getHeaders(header))
	i := 0
	for _, v := range data {
		t.AppendRow(getRow(v))
		i++
	}

	t.Render()

}

func getHeaders(h []string) table.Row {
	headers := make(table.Row, len(h))

	i := 0
	for _, k := range h {
		headers[i] = k
		i++
	}

	return headers
}

func getRow(m []string) table.Row {
	d := make(table.Row, len(m))

	i := 0

	for _, v := range m {
		d[i] = v
		i++
	}

	return d
}
