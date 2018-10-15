import { array, arrayOf, bool, shape, string } from "prop-types";
const dataPropType = shape({
  uid: string.isRequired,
  type: string,
  word: string,
  part_of_speech: string,
  categories: arrayOf(
    shape({
      uid: string.isRequired,
      "dc:title": string
    })
  ),
  sources: arrayOf(
    shape({
      uid: string.isRequired,
      "dc:title": string
    })
  ),
  related_phrases: arrayOf(
    shape({
      uid: string.isRequired,
      "fv:definitions": arrayOf(
        shape({
          language: string,
          translation: string
        })
      ),
      "fv:literal_translation": array,
      phrase: string
    })
  ),
  related_audio: arrayOf(
    shape({
      uid: string.isRequired,
      name: string,
      "mime-type": string,
      path: string,
      "dc:title": string,
      "dc:description": string
    })
  ),
  related_pictures: arrayOf(
    shape({
      uid: string.isRequired,
      name: string,
      "mime-type": string,
      path: string,
      "dc:title": string,
      "dc:description": string
    })
  ),
  lastModified: string,
  "fv:reference": string,
  "fv:definitions": arrayOf(
    shape({
      translation: string,
      language: string
    })
  ),
  "fv:cultural_note": arrayOf(string),
  "fv:available_in_childrens_archive": bool,
  "dc:creator": string,
  "dc:lastContributor": string,
  "dc:contributors": arrayOf(string),
  "fv-word:pronunciation": string,
  "fv-word:part_of_speech": string
});

export default dataPropType;
