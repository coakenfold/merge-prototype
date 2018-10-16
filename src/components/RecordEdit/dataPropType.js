import { array, arrayOf, bool, shape, string } from "prop-types";
const dataPropType = shape({
  uid: string.isRequired,
  type: arrayOf(string),
  word: arrayOf(string),
  part_of_speech: arrayOf(string),
  categories: arrayOf(
    arrayOf(
      shape({
        uid: string.isRequired,
        "dc:title": string
      })
    )
  ),
  sources: arrayOf(
    arrayOf(
      shape({
        uid: string.isRequired,
        "dc:title": string
      })
    )
  ),
  related_phrases: arrayOf(
    arrayOf(
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
    )
  ),
  related_audio: arrayOf(
    arrayOf(
      shape({
        uid: string.isRequired,
        name: string,
        "mime-type": string,
        path: string,
        "dc:title": string,
        "dc:description": string
      })
    )
  ),
  related_pictures: arrayOf(
    arrayOf(
      shape({
        uid: string.isRequired,
        name: string,
        "mime-type": string,
        path: string,
        "dc:title": string,
        "dc:description": string
      })
    )
  ),
  lastModified: string,
  "fv:reference": arrayOf(string),
  "fv:definitions": arrayOf(
    arrayOf(
      shape({
        translation: string,
        language: string
      })
    )
  ),
  "fv:cultural_note": arrayOf(arrayOf(string)),
  "fv:available_in_childrens_archive": arrayOf(bool),
  "dc:creator": string,
  "dc:lastContributor": string,
  "dc:contributors": arrayOf(arrayOf(string)),
  "fv-word:pronunciation": arrayOf(string),
  "fv-word:part_of_speech": arrayOf(string)
});

export default dataPropType;
