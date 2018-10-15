import React, { PureComponent } from "react";

import "./MergeRecords.css";
import uuid from "uuid/v4";
import { arrayOf } from "prop-types";
import Record from "../Record/Record";
import dataPropType from "../dataPropType";
class MergeRecords extends PureComponent {
  state = {
    merged: null,
    needsReview: []
  };
  static propTypes = {
    data: arrayOf(dataPropType)
  };
  componentDidMount() {
    this._mergeRecords();
  }
  render() {
    const { merged, needsReview, sorted, updateFlag } = this.state;
    if (!merged) return null;

    return (
      <Record
        data={merged}
        source={sorted}
        needsReview={needsReview}
        setAlternate={this._setAlternate}
        updateFlag={updateFlag}
      />
    );
  }
  _mergeRecords = () => {
    const { data } = this.props;
    const sorted = this._sortByLastEdited(data);
    const lastEdited = sorted[0];

    const categories = this._returnUniqueByUidProperty(sorted, "categories");
    const dc_contributors = this._returnUniqueValues(sorted, "dc:contributors");
    const dc_lastContributor = lastEdited["dc:lastContributor"];
    const fv_definitions = this._returnUniqueDefinitions(sorted);
    const fv_reference = this._returnEquivalentOrFirst(sorted, "fv:reference");
    const fv_word_pronunciation = this._returnEquivalentOrFirst(sorted, "fv-word:pronunciation");
    const fv_word_part_of_speech = this._returnEquivalentOrFirst(sorted, "fv-word:part_of_speech");
    const fv_available_in_childrens_archive = this._isInChildrensArchive(sorted);
    const fv_cultural_note = this._returnUniqueValues(sorted, "fv:cultural_note");
    const lastModified = lastEdited.lastModified;
    const part_of_speech = this._returnEquivalentOrFirst(sorted, "part_of_speech");
    const related_phrases = this._returnUniqueByUidProperty(sorted, "related_phrases");
    const related_audio = this._returnUniqueByUidProperty(sorted, "related_audio");
    const related_pictures = this._returnUniqueByUidProperty(sorted, "related_pictures");
    const sources = this._returnUniqueByUidProperty(sorted, "sources");
    const type = this._returnEquivalentOrFirst(sorted, "type");
    const uid = uuid();
    const word = this._returnEquivalentOrFirst(sorted, "word");

    this.setState({
      sorted,
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

  _returnEquivalentOrFirst = (data, property) => {
    const data0 = data[0][property];
    const data1 = data[1][property];
    if (data0 !== data1) {
      // Different, make a note
      this._logDifference(property);
    }

    return data0;
  };

  _logDifference = property => {
    const { needsReview } = this.state;
    needsReview.push(property);
    this.setState({ needsReview });
  };

  _returnUniqueByUidProperty = (data, property) => {
    let flagged = false;
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

    if (flagged) {
      // Different, make a note
      this._logDifference(property);
    }

    return unique;
  };

  _returnUniqueDefinitions = data => {
    let flagged = false;
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
        if (!flagged) {
          flagged = true;
        }
        unique.push(obj);
      }
    });

    if (flagged) {
      // Different, make a note
      this._logDifference(property);
    }

    return unique;
  };

  _returnUniqueValues = (data, property) => {
    let flagged = false;
    const a = data[0][property];
    const b = data[1][property];
    const ab = [].concat(a);
    b.forEach(entry => {
      if (ab.indexOf(entry) === -1) {
        flagged = true;
        ab.push(entry);
      }
    });

    if (flagged) {
      // Different, make a note
      this._logDifference(property);
    }

    return ab;
  };

  _setAlternate = (property, data) => {
    const { merged } = this.state;
    merged[property] = data;
    this.setState({ merged, updateFlag: uuid() });
  };

  _isInChildrensArchive = data => {
    const property = "fv:available_in_childrens_archive";
    const data0 = data[0][property];
    const data1 = data[1][property];

    if (data0 !== data1) {
      // Different, make a note
      this._logDifference(property);
    }

    return data0 || data1;
  };
}

export default MergeRecords;
