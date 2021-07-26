import React, { Component } from "react";
import axios from "axios";
import { Image, Modal, Button } from "react-bootstrap";
import FlatList from "flatlist-react";
import RecentSearches from "./RecentSearches";
import Loader from "../Loader";

class Search extends Component {
  constructor() {
    super();
    this.getRecent = this.getRecent.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  state = {
    searchText: "",
    apiUrl:
      "https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=59a29f5605a377d0fec08b57452b1b6c&per_page=15&",
    searchApiUrl:
      "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=59a29f5605a377d0fec08b57452b1b6c&tags=",
    images: {},
    temp: [],
    isLoading: true,
    hasMoreItems: true,
    pageNo: 1,
    recentSearches: [],
    focus: false,
  };
  componentDidMount() {
    this.getRecent();
  }
  async getRecent() {
    let data = await axios
      .get(
        `${this.state.apiUrl}page=${this.state.pageNo}&format=json&nojsoncallback=1`
      )
      .then((response) => {
        return response;
      })

      .catch((error) => {
        console.log(error);
      });
    this.setState({ temp: [...this.state.temp, ...data.data.photos.photo] });
    this.setState({ pageNo: this.state.pageNo + 1 });
  }
  onTextChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleKeyPress = (event) => {
    let val = event.target.value;
    if (event.key === "Enter" && val !== "") {
      this.setState({ [event.target.name]: val }, () => {
        if (this.state.recentSearches.includes(val) === false) {
          this.state.recentSearches.push(val);
        }

        localStorage.setItem(
          "recentSearches",
          JSON.stringify(this.state.recentSearches)
        );
        axios
          .get(
            `${
              this.state.searchApiUrl + this.state.searchText
            }&safe_search=true&per_page=15&page=1&format=json&nojsoncallback=1`
          )
          .then((res) => this.setState({ temp: res.data.photos.photo }))
          .catch((err) => console.log(err));
      });
    }
  };
  handleInputFocus = () => {
    this.setState({ focus: true });
  };
  handleCloseClick = () => {
    this.setState({ focus: false });
  };
  handleClearClick = () => {
    localStorage.clear();
    this.handleCloseClick();
    this.handleInputFocus();
  };

  render() {
    return (
      <div>
        <div className="search-div">
          <h1>Search Photos</h1>
          <input
            type="text"
            className="search-box"
            placeholder="Search for images"
            name="searchText"
            value={this.state.searchText}
            onChange={this.onTextChange}
            onKeyPress={this.handleKeyPress}
            onFocus={this.handleInputFocus}
            autoComplete="off"
          />
        </div>
        {this.state.focus ? (
          <div
            style={{
              border: "1px solid lightgrey",
              width: "40rem",
              margin: "0 auto",
              marginTop: "-50px",
            }}
          >
            <RecentSearches />
            <div>
              <Button
                variant="primary"
                style={{ width: "fit-content" }}
                onClick={this.handleCloseClick}
              >
                Close
              </Button>
              <Button
                variant="danger"
                style={{
                  width: "fit-content",
                  marginLeft: "1rem",
                }}
                onClick={this.handleClearClick}
              >
                Clear
              </Button>
            </div>
          </div>
        ) : null}
        <div className="flat-list">
          <FlatList
            list={this.state.temp}
            renderItem={(item) => (
              <Image
                src={`https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg`}
                thumbnail
              />
            )}
            renderWhenEmpty={() => <Loader />}
            display={{
              grid: true,
              gridGap: "50px",
            }}
            hasMoreItems={this.state.hasMoreItems}
            loadMoreItems={this.getRecent}
            paginationLoadingIndicator={<Loader />}
            paginationLoadingIndicatorPosition="center"
          />
        </div>
      </div>
    );
  }
}

export default Search;
