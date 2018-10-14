import React, { PureComponent } from "react";
import { array, arrayOf, bool, shape, string } from "prop-types";
import "./MergeRecords.css";
import uuid from "uuid/v4";

class MergeRecords extends PureComponent {
  static propTypes = {
    data: arrayOf(
      shape({
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
      })
    )
  };
  componentDidMount() {}
  render() {
    const merged = this._mergeRecords();
    return (
      <div className="MergeRecords">
        <h1>Component: MergeRecords</h1>
        {merged}
      </div>
    );
  }
  _mergeRecords = () => {
    const { data } = this.props;
    const sorted = this._sortByLastEdited(data);

    const categories = this._returnUniqueByUidProperty(sorted, "categories");
    const dc_contributors = this._returnUniqueValues(sorted, "dc:contributors");
    const dc_lastContributor = sorted[0]["dc:lastContributor"];
    const fv_definitions = this._returnUniqueDefinitions(sorted);
    const fv_reference = this._returnEquivalentOrEmpty(sorted, "fv:reference");
    const fv_word_pronunciation = this._returnEquivalentOrEmpty(sorted, "fv-word:pronunciation");
    const fv_word_part_of_speech = this._returnEquivalentOrEmpty(sorted, "fv-word:part_of_speech");
    const fv_available_in_childrens_archive = this._isInChildrensArchive(sorted);
    const fv_cultural_note = this._returnUniqueValues(sorted, "fv:cultural_note");
    const lastModified = sorted[0].lastModified;
    const part_of_speech = this._returnEquivalentOrEmpty(sorted, "part_of_speech");
    const related_phrases = this._returnUniqueByUidProperty(sorted, "related_phrases");
    const related_audio = this._returnUniqueByUidProperty(sorted, "related_audio");
    const related_pictures = this._returnUniqueByUidProperty(sorted, "related_pictures");
    const sources = this._returnUniqueByUidProperty(sorted, "sources");
    const type = this._returnEquivalentOrEmpty(sorted, "type");
    const uid = uuid();
    const word = this._returnEquivalentOrEmpty(sorted, "word");

    const tmp = {
      uid,
      type,
      word,
      part_of_speech,
      categories,
      sources,
      related_phrases,
      related_audio,
      related_pictures,
      lastModified,
      "fv:reference": fv_reference,
      "fv:definitions": fv_definitions,
      "fv:cultural_note": fv_cultural_note,
      "fv:available_in_childrens_archive": fv_available_in_childrens_archive,
      "dc:creator": "", // Blank, ensure creator is in contributors
      "dc:lastContributor": dc_lastContributor,
      "dc:contributors": dc_contributors,
      "fv-word:pronunciation": fv_word_pronunciation,
      "fv-word:part_of_speech": fv_word_part_of_speech
    };
    return (
      <pre>
        <code>{JSON.stringify(tmp, null, " ")}</code>
      </pre>
    );
  };
  _sortByLastEdited = data => {
    const sorting = [].concat(data);
    return sorting.sort((a, b) => {
      const aDate = new Date(a.lastModified);
      const bDate = new Date(b.lastModified);
      if (aDate > bDate) {
        return -1;
      }
      if (aDate < bDate) {
        return 1;
      }
      return 0;
    });
  };
  _returnEquivalentOrEmpty = (data, property) => {
    return data[0][property] === data[1][property] ? data[0][property] : "";
  };
  _returnUniqueByUidProperty = (data, property) => {
    const unique = [].concat(data[0][property]);
    const uniqueUids = unique.map(obj => {
      return obj.uid;
    });
    data[1][property].forEach(obj => {
      if (uniqueUids.indexOf(obj.uid) === -1) {
        uniqueUids.push(obj.uid);
        unique.push(obj);
      }
    });
    return unique;
  };
  _returnUniqueDefinitions = data => {
    const property = "fv:definitions";
    // eslint-disable-next-line
    debugger;
    const unique = [].concat(data[0][property]);
    const uniqueMap = unique.map(obj => {
      return `${obj.translation} ${obj.language}`;
    });

    data[1][property].forEach(obj => {
      const str = `${obj.translation} ${obj.language}`;
      if (uniqueMap.indexOf(str) === -1) {
        uniqueMap.push(str);
        unique.push(obj);
      }
    });
    return unique;
  };
  _returnUniqueValues = (data, property) => {
    const a = data[0][property];
    const b = data[1][property];
    const ab = [].concat(a);
    b.forEach(entry => {
      if (ab.indexOf(entry) === -1) {
        ab.push(entry);
      }
    });
    return ab;
  };
  _isInChildrensArchive = data => {
    return data[0]["fv:available_in_childrens_archive"] || data[1]["fv:available_in_childrens_archive"];
  };
}

export default MergeRecords;
