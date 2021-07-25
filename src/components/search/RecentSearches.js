import FlatList from "flatlist-react";
import { Component } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class RecentSearches extends Component {
  handleCloseClick = (props) => {
    props.isFocus = false;
  };
  render() {
    return (
      <div>
        <FlatList
          list={JSON.parse(localStorage.getItem("recentSearches"))}
          renderItem={(item, idx) => <li key={idx}>{item}</li>}
          display={{ row: true, rowGap: "2px" }}
        />
      </div>
    );
  }
}

export default RecentSearches;
