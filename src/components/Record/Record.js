import React, { PureComponent } from "react";
import { array, arrayOf, bool, func, shape, string } from "prop-types";
import "./Record.css";

class Record extends PureComponent {
  static propTypes = {
    setAlternate: func,
    data: shape({
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
  };
  componentDidMount() {}
  render() {
    return <div className="Record">{this._generateEntry()}</div>;
  }
  _generateEntry = () => {
    const { data, source } = this.props;
    if (!data || !source) return null;
    return (
      <div>
        <h1>{data.word}</h1>
        <div>
          <div>
            {data.related_audio.map((item, index) => (
              <div key={index}>
                <audio src={item.path} preload="none" controls />
                {source[index]["fv:available_in_childrens_archive"] ? <div>Child focused</div> : null}
              </div>
            ))}
          </div>
          <div>
            <strong>Pronunciation:</strong> {data["fv-word:pronunciation"]}
            {this._generateNeedsReview("fv-word:pronunciation")}
          </div>
          <div>
            <strong>Part of speech:</strong> {data.part_of_speech}
          </div>
          <div>
            <strong>{data["fv:definitions"].length > 1 ? "Definitions" : "Definition"}:</strong>
            <ul>
              {data["fv:definitions"].map((item, index) => (
                <li key={index}>{item.translation}</li>
              ))}
            </ul>
          </div>
          <div>
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
          <div>
            <strong>{data["fv:cultural_note"].length > 1 ? "Cultural notes" : "Cultural note"}:</strong>
            <ul>
              {data["fv:cultural_note"].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>{data.sources.length > 1 ? "Sources" : "Source"}:</strong>
            <ul>
              {data.sources.map((item, index) => (
                <li key={index}>{item["dc:title"]}</li>
              ))}
            </ul>
          </div>
        </div>
        <aside>
          <div>
            <strong>{data["dc:contributors"].length > 1 ? "Contributors" : "Contributor"}:</strong>
            <ul>
              {data["dc:contributors"].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>{data.categories.length > 1 ? "Categories" : "Category"}:</strong>
            <ul>
              {data.categories.map((item, index) => (
                <li key={index}>{item["dc:title"]}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Reference:</strong>
            {data["fv:reference"]}
          </div>
        </aside>
      </div>
    );
  };
  _generateNeedsReview = property => {
    const { data, source, needsReview } = this.props;
    if (!data || !source || !needsReview) {
      return null;
    }
    let a = "a";
    let b = "b";
    const flagged = needsReview.indexOf(property);
    if (flagged !== -1) {
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
          a = "categories";
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
          a = "sources";
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
          a = "related_phrases";
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
          a = "related_audio";
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
          a = "related_pictures";
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
          a = "fv:definitions";
          break;
        case "fv:cultural_note":
          // arrayOf(string)
          a = "fv:cultural_note";
          break;
        case "fv:available_in_childrens_archive":
          // noop
          break;
        case "dc:contributors":
          // noop
          break;
        default:
          // should be a string
          a = (
            <div
              onClick={() => {
                this._setAlternate(property, source[0][property]);
              }}
            >
              {source[0][property]}
            </div>
          );
          b = (
            <div
              onClick={() => {
                this._setAlternate(property, source[1][property]);
              }}
            >
              {source[1][property]}
            </div>
          );
          break;
      }
      return (
        <div>
          {a} or {b}
        </div>
      );
    }
  };
  _setAlternate = (property, data) => {
    this.props.setAlternate(property, data);
  };
}

export default Record;
