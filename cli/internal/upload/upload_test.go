package upload

import (
	"errors"
	"fmt"
	"testing"
	"time"

	"github.com/saliougaye/side-zilla/internal"
	"github.com/saliougaye/side-zilla/internal/model"
	"github.com/saliougaye/side-zilla/internal/utils"
	"github.com/stretchr/testify/require"
)

func TestUploadCommand(t *testing.T) {

	type testCase struct {
		name        string
		maxSize     int64
		client      model.UploadHttpClient
		filepath    string
		expected    *model.UploadResult
		expectedErr error
	}

	tests := []testCase{
		{
			name:        "throws error if file not exist",
			maxSize:     5242880,
			filepath:    "./fixtures/notExist.md",
			expected:    nil,
			expectedErr: model.ErrFileNotExist,
			client:      &utils.HttpClient{},
		},
		{
			name:        "throws error if filepath is a folder",
			maxSize:     5242880,
			filepath:    "./fixtures",
			expected:    nil,
			expectedErr: model.ErrPathIsADir,
			client:      &utils.HttpClient{},
		},
		{
			name:        "throws error if the size of the file is greater than the max possible",
			maxSize:     0,
			filepath:    "./fixtures/my-file.txt",
			expected:    nil,
			expectedErr: model.ErrSizeExceed,
			client:      &utils.HttpClient{},
		},
		{
			name:        "throws error if the request of upload fail",
			maxSize:     5242880,
			filepath:    "./fixtures/my-file.txt",
			expected:    nil,
			expectedErr: model.ErrFailedToRequestUpload,
			client: NewMockUploadHttpClient(
				nil,
				errors.New("generic error"),
				nil,
				nil,
				nil,
				nil,
				false,
			),
		},
		{
			name:        "throws error if the status code of the response of the upload request is not 200",
			maxSize:     5242880,
			filepath:    "./fixtures/my-file.txt",
			expected:    nil,
			expectedErr: model.ErrFailedToRequestUpload,
			client: NewMockUploadHttpClient(
				&utils.PostResponse{
					StatusCode: 400,
				},
				nil,
				nil,
				nil,
				nil,
				nil,
				false,
			),
		},
		{
			name:        "throws error if file upload fail",
			maxSize:     5242880,
			filepath:    "./fixtures/my-file.txt",
			expected:    nil,
			expectedErr: model.ErrFailedToRequestUpload,
			client: NewMockUploadHttpClient(
				&utils.PostResponse{
					StatusCode: 400,
					Body:       `{ "id": "ID1234", "uploadUrl": "", "expiration": "2022-12-31T23:00:00.000Z" }`,
				},
				nil,
				nil,
				nil,
				nil,
				errors.New("generic error"),
				false,
			),
		},
		{
			name:        "throws error if the status code of the response of the file upload is not 200",
			maxSize:     5242880,
			filepath:    "./fixtures/my-file.txt",
			expected:    nil,
			expectedErr: model.ErrFailedToRequestUpload,
			client: NewMockUploadHttpClient(
				&utils.PostResponse{
					StatusCode: 500,
				},
				nil,
				nil,
				nil,
				&utils.PutFileResponse{
					StatusCode: 429,
				},
				nil,
				false,
			),
		},
		{
			name:        "throws error if ack request fail",
			maxSize:     5242880,
			filepath:    "./fixtures/my-file.txt",
			expected:    nil,
			expectedErr: model.ErrFailedToRequestAck,
			client: NewMockUploadHttpClient(
				&utils.PostResponse{
					StatusCode: 200,
					Body:       `{ "id": "ID1234", "uploadUrl": "", "expiration": "2022-12-31T23:00:00.000Z" }`,
				},
				nil,
				nil,
				errors.New("generic error"),
				&utils.PutFileResponse{
					StatusCode: 200,
				},
				nil,
				true,
			),
		},
		{
			name:        "throws error if the status code of the response of the ack request is not 200",
			maxSize:     5242880,
			filepath:    "./fixtures/my-file.txt",
			expected:    nil,
			expectedErr: model.ErrFailedToRequestAck,
			client: NewMockUploadHttpClient(
				&utils.PostResponse{
					StatusCode: 200,
					Body:       `{ "id": "ID1234", "uploadUrl": "", "expiration": "2022-12-31T23:00:00.000Z" }`,
				},
				nil,
				&utils.PostResponse{
					StatusCode: 500,
				},
				nil,
				&utils.PutFileResponse{
					StatusCode: 200,
				},
				nil,
				true,
			),
		},
		{
			name:     "returns data successfully",
			maxSize:  5242880,
			filepath: "./fixtures/my-file.txt",
			expected: &model.UploadResult{
				Url:      fmt.Sprintf("%s/%s", internal.ShortnerBaseUrl, "ID1234"),
				ExpireAt: time.Date(2022, time.December, 31, 23, 0, 0, 0, time.UTC),
			},
			expectedErr: nil,
			client: NewMockUploadHttpClient(
				&utils.PostResponse{
					StatusCode: 200,
					Body:       string(`{ "id": "ID1234", "uploadUrl": "", "expiration": "2022-12-31T23:00:00.000Z" }`),
				},
				nil,
				&utils.PostResponse{
					StatusCode: 200,
				},
				nil,
				&utils.PutFileResponse{
					StatusCode: 200,
				},
				nil,
				false,
			),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			u := NewUploadCommand(
				tt.client,
				tt.maxSize,
			)

			got, err := u.Run(tt.filepath)

			if tt.expectedErr != nil {
				fmt.Printf("want %s, received %s", tt.expectedErr.Error(), err.Error())
				require.Equal(t, tt.expectedErr.Error(), err.Error())
			} else {
				require.Nil(t, err)
				require.Equal(t, tt.expected, got)
			}
		})

	}

}
