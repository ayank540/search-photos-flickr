import React, { Component } from "react";
import axios from "axios";
import { Image, Modal, Button } from "react-bootstrap";
import FlatList from "flatlist-react";
import RecentSearches from "./RecentSearches";

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
    isLoading: true,
    hasMoreItems: false,
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
    this.setState({ images: data.data.photos });
    console.log(this.state.images.photo);
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
        console.log(localStorage.getItem("recentSearches"));
        axios
          .get(
            `${
              this.state.searchApiUrl + this.state.searchText
            }&safe_search=true&per_page=15&page=1&format=json&nojsoncallback=1`
          )
          .then((res) => this.setState({ images: res.data.photos }))
          // .then(res=>console.log(res.data.photos))
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
  handleClearClick = () =>{
    localStorage.clear()
  }
  fetchData = () => {
    // this is simple example but most of good paginated apis will give you total items count and offset information
    fetch(
      `${this.state.apiUrl}page=${this.state.pageNo}&format=json&nojsoncallback=1`
    )
      .then((res) => res.json())
      .then((data) => {
        this.setState((prevState) => ({
          pageNo: this.state.pageNo + 1,
          hasMoreItems: data.page < data.pages,
          myApiData: [...prevState.myApiData, ...data.results],
          loading: false,
        }));
      });
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
              marginTop: "-50px"
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
            list={this.state.images.photo}
            renderItem={(item) => (
              <Image
                src={`https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg`}
                // https://live.staticflickr.com/7372/12502775644_acfd415fa7_w.jpg
                // https://live.staticflickr.com/${img.server}/${img.id}_${img.secret}_w.jpg

                thumbnail
              />
              //   console.log(item)
            )}
            renderWhenEmpty={() => (
              <div class="sk-cube-grid">
                <div class="sk-cube sk-cube1"></div>
                <div class="sk-cube sk-cube2"></div>
                <div class="sk-cube sk-cube3"></div>
                <div class="sk-cube sk-cube4"></div>
                <div class="sk-cube sk-cube5"></div>
                <div class="sk-cube sk-cube6"></div>
                <div class="sk-cube sk-cube7"></div>
                <div class="sk-cube sk-cube8"></div>
                <div class="sk-cube sk-cube9"></div>
              </div>
            )}
            display={{
              grid: true,
              gridGap: "50px",
            }}
            paginate={{
              hasMore: this.state.hasMoreItems,
              loadMore: this.fetchData,
              loadingIndicator: (
                <div style={{ background: "#090" }}>Getting more items...</div>
              ),
              loadingIndicatorPosition: "center",
            }}
          />
        </div>
      </div>
    );
  }
}

export default Search;
