import React, { PureComponent } from "react";
import uuid from "uuid/v4";
import { arrayOf } from "prop-types";
import dataPropType from "../dataPropType";
import RecordEdit from "../RecordEdit/RecordEdit";
import "./MergeRecords.css";

class MergeRecords extends PureComponent {
  state = {
    merged: null,
    selected: {
      type: 0,
      word: 0,
      part_of_speech: 0,
      categories: 0,
      sources: 0,
      related_phrases: 0,
      related_audio: 0,
      related_pictures: 0,
      lastModified: 0,
      "fv:reference": 0,
      "fv:definitions": 0,
      "fv:cultural_note": 0,
      "fv:available_in_childrens_archive": 0,
      "dc:creator": 0,
      "dc:lastContributor": 0,
      "dc:contributors": 0,
      "fv-word:pronunciation": 0,
      "fv-word:part_of_speech": 0
    },
    forceUpdate: null
  };
  static propTypes = {
    data: arrayOf(dataPropType)
  };
  componentDidMount() {
    this._mergeRecords();
  }
  render() {
    const { merged, selected, forceUpdate } = this.state;
    if (!merged) return null;

    return <RecordEdit data={merged} selected={selected} setAlternate={this._setAlternate} forceUpdate={forceUpdate} />;
  }

  _generateByUid = (data, property) => {
    let flagged = false;
    const toReturn = [];
    const unique = [].concat(data[0][property]);
    const uniqueUids = unique.map(obj => {
      return obj.uid;
    });
    data[1][property].forEach(obj => {
      if (uniqueUids.indexOf(obj.uid) === -1) {
        flagged = true;
        unique.push(obj);
      }
    });
    toReturn.push(unique);
    if (flagged) {
      toReturn.push(data[0][property]);
      toReturn.push(data[1][property]);
    }
    return toReturn;
  };

  _generateChildrensArchive = data => {
    const property = "fv:available_in_childrens_archive";
    const data0 = data[0][property];
    const data1 = data[1][property];

    return [data0, data1];
  };

  _generateCombined = (data, property) => {
    let flagged = false;
    const toReturn = [];
    const a = data[0][property];
    const b = data[1][property];
    const ab = [].concat(a);
    b.forEach(entry => {
      if (ab.indexOf(entry) === -1) {
        flagged = true;
        ab.push(entry);
      }
    });
    toReturn.push(ab);
    if (flagged) {
      toReturn.push(a);
      toReturn.push(b);
    }
    return toReturn;
  };

  _generateDefinitions = data => {
    let flagged = false;
    const toReturn = [];
    const property = "fv:definitions";
    const data0 = data[0][property];
    const data1 = data[1][property];

    const unique = [].concat(data0);
    const uniqueMap = unique.map(obj => {
      return `${obj.translation} ${obj.language}`;
    });

    data1.forEach(obj => {
      const str = `${obj.translation} ${obj.language}`;
      if (uniqueMap.indexOf(str) === -1) {
        flagged = true;
        unique.push(obj);
      }
    });

    toReturn.push(unique);
    if (flagged) {
      toReturn.push(data0);
      toReturn.push(data1);
    }
    return toReturn;
  };

  _generateDouble = (data, property) => {
    const data0 = data[0][property];
    const data1 = data[1][property];

    if (data0 !== data1) {
      return [data0, data1];
    }

    return [data0];
  };

  _mergeRecords = () => {
    const { data } = this.props;
    const sorted = this._sortByLastEdited(data);
    const lastEdited = sorted[0];

    const categories = this._generateByUid(sorted, "categories");
    const dc_contributors = this._generateCombined(sorted, "dc:contributors");
    const dc_lastContributor = lastEdited["dc:lastContributor"];
    const fv_definitions = this._generateDefinitions(sorted);
    const fv_reference = this._generateDouble(sorted, "fv:reference");
    const fv_word_pronunciation = this._generateDouble(sorted, "fv-word:pronunciation");
    const fv_word_part_of_speech = this._generateDouble(sorted, "fv-word:part_of_speech");
    const fv_available_in_childrens_archive = this._generateChildrensArchive(sorted);
    const fv_cultural_note = this._generateCombined(sorted, "fv:cultural_note");
    const lastModified = lastEdited.lastModified;
    const part_of_speech = this._generateDouble(sorted, "part_of_speech");
    const related_phrases = this._generateByUid(sorted, "related_phrases");
    const related_audio = this._generateByUid(sorted, "related_audio");
    const related_pictures = this._generateByUid(sorted, "related_pictures");
    const sources = this._generateByUid(sorted, "sources");
    const type = this._generateDouble(sorted, "type");
    const uid = uuid();
    const word = this._generateDouble(sorted, "word");

    this.setState({
      merged: {
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
        "dc:creator": "",
        "dc:lastContributor": dc_lastContributor,
        "dc:contributors": dc_contributors,
        "fv-word:pronunciation": fv_word_pronunciation,
        "fv-word:part_of_speech": fv_word_part_of_speech
      }
    });
  };

  _setAlternate = (property, data) => {
    const { selected } = this.state;
    selected[property] = data;
    this.setState({ selected, forceUpdate: uuid() });
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
}

export default MergeRecords;
