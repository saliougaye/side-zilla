package upload

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"mime/multipart"
	"os"

	"github.com/saliougaye/side-zilla/internal"
	"github.com/saliougaye/side-zilla/internal/model"
)

type UploadCommand struct {
	client  model.UploadHttpClient
	maxSize int64
}

func NewUploadCommand(client model.UploadHttpClient, maxSize int64) *UploadCommand {
	return &UploadCommand{
		client:  client,
		maxSize: maxSize,
	}
}

func (u *UploadCommand) Run(filepath string) (*model.UploadResult, error) {

	fileInfo, err := os.Stat(filepath)

	if err != nil {
		return nil, model.ErrFileNotExist
	}

	if fileInfo.IsDir() {
		return nil, model.ErrPathIsADir
	}

	if fileInfo.Size() > u.maxSize {
		return nil, model.ErrSizeExceed
	}

	uploadResponse, err := u.getPresignUrl(fileInfo.Size(), fileInfo.Name())

	if err != nil {
		return nil, model.ErrFailedToRequestUpload
	}

	err = u.upload(filepath, uploadResponse.Url)

	if err != nil {
		fmt.Println(err.Error())
		return nil, model.ErrFailedToUpload
	}

	err = u.ackRequest(uploadResponse.Id)

	if err != nil {
		return nil, model.ErrFailedToRequestAck
	}

	return &model.UploadResult{
		Url:      fmt.Sprintf("%s/%s", internal.ShortnerBaseUrl, uploadResponse.Id),
		ExpireAt: uploadResponse.ExpireAt,
	}, nil
}

func (u *UploadCommand) getPresignUrl(size int64, filename string) (*model.UploadResponse, error) {

	resp, err := u.client.Post("/file/upload", map[string]interface{}{
		"size":     size,
		"filename": filename,
	})

	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		return nil, model.ErrFailedToUpload
	}

	var uploadResponse model.UploadResponse
	body := resp.Body

	if err := json.Unmarshal([]byte(body), &uploadResponse); err != nil {
		return nil, err
	}

	return &uploadResponse, err

}

func (u *UploadCommand) ackRequest(id string) error {
	resp, err := u.client.Post("/file/ack", map[string]interface{}{
		"slug": id,
	})

	if err != nil {
		return err
	}

	if resp.StatusCode >= 400 {
		return errors.New("failed to ack request, invalid argument")
	}

	return nil
}

func (u *UploadCommand) upload(filepath, url string) error {

	file, err := os.Open(filepath)

	if err != nil {
		return err
	}

	defer file.Close()

	body := &bytes.Buffer{}

	multipart.NewWriter(body)

	result, err := u.client.PutFileWithPresignUrl(url, body)

	if err != nil {
		return err
	}

	if result.StatusCode >= 400 {
		return errors.New("failed to upload to storage, invalid argument")
	}

	return nil
}
