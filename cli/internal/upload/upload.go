package upload

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"os"

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

	ackResponse, err := u.ackRequest(uploadResponse.Id)

	if err != nil {
		return nil, model.ErrFailedToRequestAck
	}

	return &model.UploadResult{
		Url:      ackResponse.Url,
		ExpireAt: ackResponse.ExpireAt,
	}, nil
}

func (u *UploadCommand) getPresignUrl(size int64, filename string) (*model.UploadResponse, error) {

	resp, err := u.client.PostUploadRequest(model.UploadRequest{
		Size:     size,
		Filename: filename,
	})

	if err != nil {
		return nil, err
	}

	return resp, nil

}

func (u *UploadCommand) ackRequest(id string) (*model.AckResponse, error) {
	resp, err := u.client.PostAckRequest(model.AckRequest{
		Id: id,
	})

	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (u *UploadCommand) upload(filepath, url string) error {

	file, err := os.Open(filepath)

	if err != nil {
		return err
	}

	defer file.Close()

	fileBytes, err := io.ReadAll(file)

	if err != nil {
		return err
	}

	body := bytes.NewBuffer(fileBytes)

	result, err := u.client.PutFileWithPresignUrl(url, body)

	if err != nil {
		return err
	}

	if result.StatusCode >= 400 {
		return errors.New("failed to upload to storage, invalid argument")
	}

	return nil
}
