import React, { PureComponent } from "react";
import { func } from "prop-types";
import "./Record.css";
import dataPropType from "../dataPropType";
import classNames from "classnames";

class Record extends PureComponent {
  static propTypes = {
    setAlternate: func,
    data: dataPropType
  };
  render() {
    return <div className="Record">{this._generateEntry()}</div>;
  }
  _generateEntry = () => {
    const { data } = this.props;
    if (!data) return null;

    return (
      <div>
        <h1>{data.word}</h1>
        <div className="recordGroup">
          <div className="groupPrimary">
            <div className="row">
              {data.related_audio.map((item, index) => (
                <div key={index}>
                  <audio src={item.path} preload="none" controls />
                  {data["fv:available_in_childrens_archive"][index] ? <div>Child focused</div> : null}
                </div>
              ))}
            </div>
            <div className="row">
              <strong>Pronunciation:</strong>
              {this._generateContent("fv-word:pronunciation")}
            </div>
            <div className="row">
              <strong>Part of speech:</strong>
              {this._generateContent("part_of_speech")}
            </div>
            <div className="row">
              <strong>{data["fv:definitions"].length > 1 ? "Definitions" : "Definition"}:</strong>
              <ul>
                {data["fv:definitions"].map((item, index) => (
                  <li key={index}>{item.translation}</li>
                ))}
              </ul>
            </div>
            <div className="row">
              <strong>{data.related_phrases.length > 1 ? "Related phrases" : "Related phrase"}:</strong>
              <ul>
                {data.related_phrases.map((item, index) => (
                  <li key={index}>
                    <strong>{item.phrase}</strong>
                    <ul>
                      {item["fv:definitions"].map((subitem, subindex) => (
                        <li key={subindex}>{subitem.translation}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            <div className="row">
              <strong>{data["fv:cultural_note"].length > 1 ? "Cultural notes" : "Cultural note"}:</strong>
              <ul>
                {data["fv:cultural_note"].map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="row">
              <strong>{data.sources.length > 1 ? "Sources" : "Source"}:</strong>
              <ul>
                {data.sources.map((item, index) => (
                  <li key={index}>{item["dc:title"]}</li>
                ))}
              </ul>
            </div>
          </div>
          <aside>
            <div className="row">
              <strong>{data["dc:contributors"].length > 1 ? "Contributors" : "Contributor"}:</strong>
              <ul>
                {data["dc:contributors"].map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="row">
              <strong>{data.categories.length > 1 ? "Categories" : "Category"}:</strong>
              <ul>
                {data.categories.map((item, index) => (
                  <li key={index}>{item["dc:title"]}</li>
                ))}
              </ul>
            </div>
            <div className="row">
              <strong>Reference:</strong>
              {this._generateContent("fv:reference")}
            </div>
          </aside>
        </div>
      </div>
    );
  };
  _generateContent = property => {
    const { data, selected } = this.props;
    if (!data) {
      return null;
    }
    let active = null;
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
        /*
            arrayOf(
              shape({
                uid: string.isRequired,
                "dc:title": string
              })
            )
            */
        active = "categories";
        break;
      case "sources":
        /*
            arrayOf(
              shape({
                uid: string.isRequired,
                "dc:title": string
              })
            )
            */
        active = "sources";
        break;
      case "related_phrases":
        /*
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
            */
        active = "related_phrases";
        break;
      case "related_audio":
        /*
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
            */
        active = "related_audio";
        break;
      case "related_pictures":
        /*
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
            */
        active = "related_pictures";
        break;
      case "fv:definitions":
        /*
            arrayOf(
              shape({
                translation: string,
                language: string
              })
            )
            */
        active = "fv:definitions";
        break;
      case "fv:cultural_note":
        // arrayOf(string)
        active = "fv:cultural_note";
        break;
      case "fv:available_in_childrens_archive":
        // noop
        break;
      case "dc:contributors":
        // noop
        break;
      default:
        // should be a string
        active = <div>{d[s]}</div>;

        if (dLength === 2) {
          buttons = (
            <div className="buttons">
              <button
                className={classNames("button", { active: s === 0 })}
                onClick={() => {
                  this._setAlternate(property, 0);
                }}
              >
                {title1}
              </button>

              <button
                className={classNames("button", { active: s === 1 })}
                onClick={() => {
                  this._setAlternate(property, 1);
                }}
              >
                {title2}
              </button>
            </div>
          );
        }
        if (dLength === 3) {
          buttons = (
            <div className="buttons">
              <button
                className={classNames("button", { active: s === 0 })}
                onClick={() => {
                  this._setAlternate(property, 0);
                }}
              >
                {title1}
              </button>

              <button
                className={classNames("button", { active: s === 1 })}
                onClick={() => {
                  this._setAlternate(property, 1);
                }}
              >
                {title2}
              </button>

              <button
                className={classNames("button", { active: s === 2 })}
                onClick={() => {
                  this._setAlternate(property, 2);
                }}
              >
                {title3}
              </button>
            </div>
          );
        }
        break;
    }
    return (
      <div className={classNames({ needsReview: dLength > 1 })}>
        {buttons}
        {active}
      </div>
    );
  };
  _setAlternate = (property, data) => {
    this.props.setAlternate(property, data);
  };
}

export default Record;
