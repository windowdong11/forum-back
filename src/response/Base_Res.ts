export interface BaseJson_Res {success: boolean}

export const PostImages_to_ImagesRes = (images: Express.Multer.File[]) => images.map(image => '/image/' + image.filename)