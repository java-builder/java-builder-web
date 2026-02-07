// File upload types
export interface FileMetaDataResponse {
  name: string;
  contentType: string;
  size: number;
  key: string;
  displayOrder?: number;
}

export interface FileResponse {
  files: FileMetaDataResponse[];
}

// PreSigned URL response
export interface PreSignedResponse {
  url: string;
  key: string;
}
