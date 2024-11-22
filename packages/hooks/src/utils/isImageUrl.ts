const isImageUrl = (url: string): boolean => {
  return /\.(jpeg|jpg|gif|png|svg|webp|bmp|tiff)$/.test(url.toLowerCase());
};
export default isImageUrl;
