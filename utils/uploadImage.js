import moment from 'moment';
import { storage } from '../firebase';

const convertBlob = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

export async function uploadImage(image, uid) {
  const fileName = image.uri.substring(image.uri.lastIndexOf('/') + 1);

  const blob = await convertBlob(image.uri);

  await storage.ref(fileName).put(blob);

  const url = await storage.ref(fileName).getDownloadURL();

  return url;
}
