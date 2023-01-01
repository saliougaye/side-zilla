package model

import (
	"errors"
	"io"
	"time"
)

var (
	ErrFileNotExist          = errors.New("file not exist")
	ErrPathIsADir            = errors.New("path is a directory")
	ErrSizeExceed            = errors.New("file to big")
	ErrFailedToRequestUpload = errors.New("failed to upload the file (Code 0001)")
	ErrFailedToRequestAck    = errors.New("failed to upload the file (Code 0002)")
	ErrFailedToUpload        = errors.New("failed to upload the file (Code 0003)")
)

type UploadRequest struct {
	Size     int64  `json:"size"`
	Filename string `json:"filename"`
}

type UploadResponse struct {
	Id  string `json:"id"`
	Url string `json:"uploadUrl"`
}

type UploadResult struct {
	Url      string
	ExpireAt time.Time
}

type AckRequest struct {
	Id string `json:"slug"`
}

type AckResponse struct {
	Url      string    `json:"url"`
	ExpireAt time.Time `json:"expiresAt"`
}

type PutFileResponse struct {
	StatusCode int
}

type UploadHttpClient interface {
	PostUploadRequest(request UploadRequest) (*UploadResponse, error)
	PostAckRequest(request AckRequest) (*AckResponse, error)
	PutFileWithPresignUrl(url string, body io.Reader) (*PutFileResponse, error)
}
