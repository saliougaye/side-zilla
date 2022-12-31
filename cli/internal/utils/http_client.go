package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type HttpClient struct {
	baseUrl string
	client  http.Client
}

type PostResponse struct {
	StatusCode int
	Body       string
}

type PutFileResponse struct {
	StatusCode int
}

func NewHttpClient(baseUrl string) *HttpClient {
	return &HttpClient{
		baseUrl: baseUrl,
		client:  http.Client{
			// Timeout: time.Duration(time.Duration.Seconds(10)),
		},
	}
}

func (c *HttpClient) Post(path string, body map[string]interface{}) (*PostResponse, error) {

	postBody, err := json.Marshal(body)

	if err != nil {
		return nil, err
	}

	rb := bytes.NewBuffer(postBody)

	url := fmt.Sprintf("%s%s", c.baseUrl, path)

	response, err := c.client.Post(url, "application/json", rb)

	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	responseBody, err := io.ReadAll(response.Body)

	if err != nil {
		return nil, err
	}

	return &PostResponse{
		StatusCode: response.StatusCode,
		Body:       string(responseBody),
	}, nil

}

func (c *HttpClient) PutFileWithPresignUrl(url string, body io.Reader) (*PutFileResponse, error) {

	req, err := http.NewRequest(http.MethodPut, url, body)

	if err != nil {
		return nil, err
	}

	response, err := c.client.Do(req)

	if err != nil {
		return nil, err
	}

	return &PutFileResponse{
		StatusCode: response.StatusCode,
	}, nil
}
