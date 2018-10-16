import React, { PureComponent } from "react";
import { func } from "prop-types";
import "./RecordEdit.css";
import "../Record/Record.css";
import dataPropType from "./dataPropType";
import classNames from "classnames";

class RecordEdit extends PureComponent {
  static propTypes = {
    setAlternate: func,
    data: dataPropType
  };
  render() {
    return <div className="Record">{this._generateEntry()}</div>;
  }
  _generateButtons = params => {
    const { s, property, title1, title2, title3, length } = params;
    return (
      <div className="reviewButtons">
        <button
          className={classNames("reviewButton", { active: s === 0 })}
          onClick={() => {
            this._setAlternate(property, 0);
          }}
        >
          {title1}
        </button>

        <button
          className={classNames("reviewButton", { active: s === 1 })}
          onClick={() => {
            this._setAlternate(property, 1);
          }}
        >
          {title2}
        </button>

        {length === 3 && (
          <button
            className={classNames("reviewButton", { active: s === 2 })}
            onClick={() => {
              this._setAlternate(property, 2);
            }}
          >
            {title3}
          </button>
        )}
      </div>
    );
  };
  _generateContent = property => {
    const { data, selected } = this.props;
    if (!data) {
      return null;
    }
    let content = null;
    let buttons = null;
    let title1 = "";
    let title2 = "";
    let title3 = "";

    const s = selected[property];
    const d = data[property];
    const dLength = d.length;

    if (dLength === 2) {
      title1 = "Version 1";
      title2 = "Version 2";
    }

    if (dLength === 3) {
      title1 = "Combined";
      title2 = "Version 1";
      title3 = "Version 2";
    }
    switch (property) {
      case "categories":
        content = (
          <ul>
            {data.categories[s].map((item, index) => (
              <li key={index}>{item["dc:title"]}</li>
            ))}
          </ul>
        );

        if (dLength === 3) {
          buttons = this._generateButtons({ s, property, title1, title2, title3, length: dLength });
        }
        break;
      case "sources":
        content = (
          <ul>
            {data.sources[s].map((item, index) => (
              <li key={index}>{item["dc:title"]}</li>
            ))}
          </ul>
        );

        if (dLength === 3) {
          buttons = this._generateButtons({ s, property, title1, title2, title3, length: dLength });
        }
        break;
      case "related_phrases":
        content = (
          <ul>
            {data.related_phrases[s].map((item, index) => (
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

        if (dLength === 3) {
          buttons = this._generateButtons({ s, property, title1, title2, title3, length: dLength });
        }
        break;
      case "related_audio":
        content = (
          <div>
            {data.related_audio[s].map((item, index) => (
              <div key={index}>
                <audio src={item.path} preload="none" controls />
                {data["fv:available_in_childrens_archive"][index] ? <div>Child focused</div> : null}
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
            {data["fv:definitions"][s].map((item, index) => (
              <li key={index}>{item.translation}</li>
            ))}
          </ul>
        );

        if (dLength === 3) {
          buttons = this._generateButtons({ s, property, title1, title2, title3, length: dLength });
        }
        break;
      case "fv:cultural_note":
        content = (
          <ul>
            {data["fv:cultural_note"][s].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );

        if (dLength === 3) {
          buttons = this._generateButtons({ s, property, title1, title2, title3, length: dLength });
        }
        break;
      case "fv:available_in_childrens_archive":
        // noop
        break;
      case "dc:contributors":
        content = (
          <ul>
            {data["dc:contributors"][s].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );

        if (dLength === 3) {
          buttons = this._generateButtons({ s, property, title1, title2, title3, length: dLength });
        }
        break;
      default:
        // should be a string
        content = <div>{d[s]}</div>;

        if (dLength > 1) {
          buttons = this._generateButtons({ s, property, title1, title2, title3, length: dLength });
        }
        break;
    }
    return (
      <div className={classNames({ review: dLength > 1 })}>
        {buttons}
        <div className="reviewContent">{content}</div>
      </div>
    );
  };
  _generateEntry = () => {
    const { data } = this.props;
    if (!data) return null;

    return (
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
            <div className="row mergeGroup">
              <h2>This is the merged record.</h2>

              <p>The highlighted sections indicate changes.</p>

              <div>
                <h3>You can undo the merge</h3>
                <button className="btnMergeUndo" onClick={this.props.onUndo}>
                  Undo
                </button>
              </div>
            </div>
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
    );
  };
  _setAlternate = (property, data) => {
    this.props.setAlternate(property, data);
  };
}

export default RecordEdit;
