export interface BaseJson_Res {success: boolean}

export const FileImage_to_ImageSource = (images: Express.Multer.File[]) => images.map(image => '/image/' + image.filename)