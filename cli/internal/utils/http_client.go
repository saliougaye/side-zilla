package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/saliougaye/side-zilla/internal/model"
)

type HttpClient struct {
	baseUrl string
	client  http.Client
}

type PostResponse struct {
	StatusCode int
	Body       string
}

func NewHttpClient(baseUrl string) *HttpClient {
	return &HttpClient{
		baseUrl: baseUrl,
		client:  http.Client{
			// Timeout: time.Duration(time.Duration.Seconds(10)),
		},
	}
}

func (c *HttpClient) postRequest(url string, body, result interface{}) error {
	postBody, err := json.Marshal(body)

	if err != nil {
		return err
	}

	rb := bytes.NewBuffer(postBody)

	response, err := c.client.Post(url, "application/json", rb)

	if err != nil {
		return err
	}

	if response.StatusCode >= 400 {
		return fmt.Errorf("failed to request, returned status code %d", response.StatusCode)
	}

	defer response.Body.Close()

	return json.NewDecoder(response.Body).Decode(&result)
}

func (c *HttpClient) PostUploadRequest(request model.UploadRequest) (*model.UploadResponse, error) {

	url := fmt.Sprintf("%s%s", c.baseUrl, "/file/upload")
	var result model.UploadResponse

	err := c.postRequest(url, request, &result)

	if err != nil {
		return nil, err
	}

	return &result, nil

}

func (c *HttpClient) PostAckRequest(request model.AckRequest) (*model.AckResponse, error) {

	url := fmt.Sprintf("%s%s", c.baseUrl, "/file/ack")
	var result model.AckResponse

	err := c.postRequest(url, request, &result)

	if err != nil {
		return nil, err
	}

	return &result, nil

}

func (c *HttpClient) PutFileWithPresignUrl(url string, body io.Reader) (*model.PutFileResponse, error) {

	req, err := http.NewRequest(http.MethodPut, url, body)

	if err != nil {
		return nil, err
	}

	response, err := c.client.Do(req)

	if err != nil {
		return nil, err
	}

	return &model.PutFileResponse{
		StatusCode: response.StatusCode,
	}, nil
}
