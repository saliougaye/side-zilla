package upload

import (
	"io"

	"github.com/saliougaye/side-zilla/internal/utils"
)

type MockUploadHttpClient struct {
	PostUploadRequestResponse        *utils.PostResponse
	ErrPostUploadRequest             error
	PostAckRequestResponse           *utils.PostResponse
	ErrPostAckRequest                error
	PutFileWithPresignUrlResponse    *utils.PutFileResponse
	ErrPutFileWithPresignUrlResponse error
	PostAck                          bool
}

func NewMockUploadHttpClient(
	postResponse *utils.PostResponse,
	errPostResponse error,
	postAckRequest *utils.PostResponse,
	errPostAckRequest error,
	putFileWithPresignUrlResponse *utils.PutFileResponse,
	errPutFileWithPresignUrlResponse error,
	postAck bool,

) *MockUploadHttpClient {
	return &MockUploadHttpClient{
		PostUploadRequestResponse:        postResponse,
		ErrPostUploadRequest:             errPostResponse,
		PostAckRequestResponse:           postAckRequest,
		ErrPostAckRequest:                errPostAckRequest,
		PutFileWithPresignUrlResponse:    putFileWithPresignUrlResponse,
		ErrPutFileWithPresignUrlResponse: errPutFileWithPresignUrlResponse,
		PostAck:                          postAck,
	}
}

func (m *MockUploadHttpClient) Post(path string, body map[string]interface{}) (*utils.PostResponse, error) {
	if m.PostAck {
		return m.PostAckRequestResponse, m.ErrPostAckRequest
	}
	return m.PostUploadRequestResponse, m.ErrPostUploadRequest
}
func (m *MockUploadHttpClient) PutFileWithPresignUrl(url string, body io.Reader) (*utils.PutFileResponse, error) {
	return m.PutFileWithPresignUrlResponse, m.ErrPutFileWithPresignUrlResponse
}
