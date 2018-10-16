import React, { PureComponent } from "react";
import dataPropType from "./dataPropType";
import "./Record.css";

class Record extends PureComponent {
  static propTypes = {
    data: dataPropType
  };
  render() {
    const { data } = this.props;
    return (
      <div className="Record">
        <div>
          <h1>{data.word}</h1>
          <div className="recordGroup">
            <div className="groupPrimary">
              <div className="row">{this._generateContent("related_audio")}</div>
              <div className="row">
                <h2>Pronunciation:</h2>
                {this._generateContent("fv-word:pronunciation")}
              </div>
              <div className="row">
                <h2>Part of speech:</h2>
                {this._generateContent("part_of_speech")}
              </div>
              <div className="row">
                <h2>{data["fv:definitions"].length > 1 ? "Definitions" : "Definition"}:</h2>
                {this._generateContent("fv:definitions")}
              </div>
              <div className="row">
                <h2>{data.related_phrases.length > 1 ? "Related phrases" : "Related phrase"}:</h2>
                {this._generateContent("related_phrases")}
              </div>
              <div className="row">
                <h2>{data["fv:cultural_note"].length > 1 ? "Cultural notes" : "Cultural note"}:</h2>
                {this._generateContent("fv:cultural_note")}
              </div>
              <div className="row">
                <h2>{data.sources.length > 1 ? "Sources" : "Source"}:</h2>
                {this._generateContent("sources")}
              </div>
            </div>

            <aside>
              {this.props.onMerge && (
                <div className="row mergeGroup">
                  <h2>There is a duplicate record for {data.word}</h2>
                  <button className="btnMerge" onClick={this.props.onMerge}>
                    Merge records
                  </button>
                </div>
              )}
              <div className="row">
                <h2>{data["dc:contributors"].length > 1 ? "Contributors" : "Contributor"}:</h2>
                {this._generateContent("dc:contributors")}
              </div>
              <div className="row">
                <h2>{data.categories.length > 1 ? "Categories" : "Category"}:</h2>
                {this._generateContent("categories")}
              </div>
              <div className="row">
                <h2>Reference:</h2>
                {this._generateContent("fv:reference")}
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }
  _generateContent = property => {
    const { data } = this.props;
    if (!data) {
      return null;
    }
    let content = null;
    switch (property) {
      case "categories":
        content = (
          <ul>
            {data.categories.map((item, index) => (
              <li key={index}>{item["dc:title"]}</li>
            ))}
          </ul>
        );
        break;
      case "sources":
        content = (
          <ul>
            {data.sources.map((item, index) => (
              <li key={index}>{item["dc:title"]}</li>
            ))}
          </ul>
        );
        break;
      case "related_phrases":
        content = (
          <ul>
            {data.related_phrases.map((item, index) => (
              <li key={index}>
                <h2>{item.phrase}</h2>
                <ul>
                  {item["fv:definitions"].map((subitem, subindex) => (
                    <li key={subindex}>{subitem.translation}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        );
        break;
      case "related_audio":
        content = (
          <div>
            {data.related_audio.map((item, index) => (
              <div key={index}>
                <audio src={item.path} preload="none" controls />
                {data["fv:available_in_childrens_archive"] ? <div>Child focused</div> : null}
              </div>
            ))}
          </div>
        );
        break;
      case "related_pictures":
        // TODO: not supported in prototype
        break;
      case "fv:definitions":
        content = (
          <ul>
            {data["fv:definitions"].map((item, index) => (
              <li key={index}>{item.translation}</li>
            ))}
          </ul>
        );
        break;
      case "fv:cultural_note":
        content = (
          <ul>
            {data["fv:cultural_note"].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
        break;
      case "fv:available_in_childrens_archive":
        // noop
        break;
      case "dc:contributors":
        content = (
          <ul>
            {data["dc:contributors"].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
        break;
      default:
        // should be a string
        content = <div>{data[property]}</div>;
        break;
    }
    return <div>{content}</div>;
  };
  _setAlternate = (property, data) => {
    this.props.setAlternate(property, data);
  };
}

export default Record;
