package upload

import (
	"io"

	"github.com/saliougaye/side-zilla/internal/model"
)

type MockUploadHttpClient struct {
	PostUploadRequestResponse        *model.UploadResponse
	ErrPostUploadRequest             error
	PostAckRequestResponse           *model.AckResponse
	ErrPostAckRequest                error
	PutFileWithPresignUrlResponse    *model.PutFileResponse
	ErrPutFileWithPresignUrlResponse error
}

func NewMockUploadHttpClient(
	postResponse *model.UploadResponse,
	errPostResponse error,
	postAckResponse *model.AckResponse,
	errPostAckRequest error,
	putFileWithPresignUrlResponse *model.PutFileResponse,
	errPutFileWithPresignUrlResponse error,
) *MockUploadHttpClient {
	return &MockUploadHttpClient{
		PostUploadRequestResponse:        postResponse,
		ErrPostUploadRequest:             errPostResponse,
		PostAckRequestResponse:           postAckResponse,
		ErrPostAckRequest:                errPostAckRequest,
		PutFileWithPresignUrlResponse:    putFileWithPresignUrlResponse,
		ErrPutFileWithPresignUrlResponse: errPutFileWithPresignUrlResponse,
	}
}

func (m *MockUploadHttpClient) PostUploadRequest(request model.UploadRequest, token string) (*model.UploadResponse, error) {
	return m.PostUploadRequestResponse, m.ErrPostUploadRequest
}

func (m *MockUploadHttpClient) PostAckRequest(request model.AckRequest, token string) (*model.AckResponse, error) {
	return m.PostAckRequestResponse, m.ErrPostAckRequest
}

func (m *MockUploadHttpClient) PutFileWithPresignUrl(url string, body io.Reader) (*model.PutFileResponse, error) {
	return m.PutFileWithPresignUrlResponse, m.ErrPutFileWithPresignUrlResponse
}
