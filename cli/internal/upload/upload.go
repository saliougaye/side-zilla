package upload

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"mime/multipart"
	"os"
	"time"

	"github.com/saliougaye/side-zilla/internal"
	"github.com/saliougaye/side-zilla/internal/utils"
)

var (
	client                   = newUploadHttpClient()
	maxSize                  = int64(5242880)
	errFileNotExist          = errors.New("file not exist")
	errPathIsADir            = errors.New("path is a directory")
	errSizeExceed            = errors.New("file to big")
	errFailedToRequestUpload = errors.New("failed to upload the file (Code 0001)")
	errFailedToRequestAck    = errors.New("failed to upload the file (Code 0002)")
	errFailedToUpload        = errors.New("failed to upload the file (Code 0003)")
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

func Run(filepath string) (*UploadResult, error) {

	fileInfo, err := os.Stat(filepath)

	if err != nil {
		return nil, errFileNotExist
	}

	if fileInfo.IsDir() {
		return nil, errPathIsADir
	}

	// FIXME check size based on user plan
	if fileInfo.Size() > maxSize {
		return nil, errSizeExceed
	}

	uploadResponse, err := getPresignUrl(fileInfo.Size(), fileInfo.Name())

	if err != nil {
		return nil, errFailedToRequestUpload
	}

	// TODO upload
	err = upload(filepath, uploadResponse.Url)

	if err != nil {
		fmt.Println(err.Error())
		return nil, errFailedToUpload
	}

	err = ackRequest(uploadResponse.Id)

	if err != nil {
		return nil, errFailedToRequestAck
	}

	return &UploadResult{
		Url:      fmt.Sprintf("%s/%s", internal.ShortnerBaseUrl, uploadResponse.Id),
		ExpireAt: uploadResponse.ExpireAt,
	}, nil
}

func newUploadHttpClient() *utils.HttpClient {
	client := utils.NewHttpClient(internal.UploadBaseUrl)

	return client
}

func getPresignUrl(size int64, filename string) (*UploadResponse, error) {

	resp, err := client.Post("/file/upload", map[string]interface{}{
		"size":     size,
		"filename": filename,
	})

	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		return nil, errFailedToUpload
	}

	var uploadResponse UploadResponse
	body := resp.Body

	if err := json.Unmarshal([]byte(body), &uploadResponse); err != nil {
		return nil, err
	}

	return &uploadResponse, err

}

func ackRequest(id string) error {
	resp, err := client.Post("/file/ack", map[string]interface{}{
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

func upload(filepath, url string) error {

	file, err := os.Open(filepath)

	if err != nil {
		return err
	}

	defer file.Close()

	body := &bytes.Buffer{}

	multipart.NewWriter(body)

	result, err := client.PutFileWithPresignUrl(url, body)

	if err != nil {
		return err
	}

	if result.StatusCode >= 400 {
		return errors.New("failed to upload to storage, invalid argument")
	}

	return nil
}
