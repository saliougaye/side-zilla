package model

import (
	"errors"
	"io"
	"time"

	"github.com/saliougaye/side-zilla/internal/utils"
)

var (
	ErrFileNotExist          = errors.New("file not exist")
	ErrPathIsADir            = errors.New("path is a directory")
	ErrSizeExceed            = errors.New("file to big")
	ErrFailedToRequestUpload = errors.New("failed to upload the file (Code 0001)")
	ErrFailedToRequestAck    = errors.New("failed to upload the file (Code 0002)")
	ErrFailedToUpload        = errors.New("failed to upload the file (Code 0003)")
)

type UploadResponse struct {
	Id       string    `json:"id"`
	Url      string    `json:"uploadUrl"`
	ExpireAt time.Time `json:"expiration"`
}

type UploadResult struct {
	Url      string
	ExpireAt time.Time
}

type UploadHttpClient interface {
	Post(path string, body map[string]interface{}) (*utils.PostResponse, error)
	PutFileWithPresignUrl(url string, body io.Reader) (*utils.PutFileResponse, error)
}
