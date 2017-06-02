import { saveAs } from 'file-saver';

// Create and "click on" a temporary Data URI, with the desired JS object
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
export default (obj, filename) => {
  const blob = new Blob([JSON.stringify(obj)], {type: 'application/json;charset=utf-8'});
  saveAs(blob, filename);
};
