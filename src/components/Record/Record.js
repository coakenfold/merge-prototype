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
            <div className="row">{this._generateContent("related_audio")}</div>
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
              {this._generateContent("fv:definitions")}
            </div>
            <div className="row">
              <strong>{data.related_phrases.length > 1 ? "Related phrases" : "Related phrase"}:</strong>
              {this._generateContent("related_phrases")}
            </div>
            <div className="row">
              <strong>{data["fv:cultural_note"].length > 1 ? "Cultural notes" : "Cultural note"}:</strong>
              {this._generateContent("fv:cultural_note")}
            </div>
            <div className="row">
              <strong>{data.sources.length > 1 ? "Sources" : "Source"}:</strong>
              {this._generateContent("sources")}
            </div>
          </div>
          <aside>
            <div className="row">
              <strong>{data["dc:contributors"].length > 1 ? "Contributors" : "Contributor"}:</strong>
              {this._generateContent("dc:contributors")}
            </div>
            <div className="row">
              <strong>{data.categories.length > 1 ? "Categories" : "Category"}:</strong>
              {this._generateContent("categories")}
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
        active = (
          <ul>
            {data.categories[s].map((item, index) => (
              <li key={index}>{item["dc:title"]}</li>
            ))}
          </ul>
        );

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
      case "sources":
        active = (
          <ul>
            {data.sources[s].map((item, index) => (
              <li key={index}>{item["dc:title"]}</li>
            ))}
          </ul>
        );

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
      case "related_phrases":
        active = (
          <ul>
            {data.related_phrases[s].map((item, index) => (
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
        );

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
      case "related_audio":
        active = (
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
        active = (
          <ul>
            {data["fv:definitions"][s].map((item, index) => (
              <li key={index}>{item.translation}</li>
            ))}
          </ul>
        );

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
      case "fv:cultural_note":
        active = (
          <ul>
            {data["fv:cultural_note"][s].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );

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
      case "fv:available_in_childrens_archive":
        // noop
        break;
      case "dc:contributors":
        active = (
          <ul>
            {data["dc:contributors"][s].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );

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
