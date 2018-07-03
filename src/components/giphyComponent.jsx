import React from 'react';
import axios from 'axios';

class Giphy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gif: null,
    };
  }
  componentWillMount() {
    const url = `https://api.giphy.com/v1/gifs/random?api_key=23oSBhWRT8ANWpUMiIqvXMgfpafBAVbd${this.props.tag ? `&tag=${encodeURIComponent(this.props.tag)}`: ''}`;

    axios.get(url)
      .then(({ data }) => {
        if (data.data.image_url) {
          this.setState({
            gif: data.data.image_url,
          });
        }
      });
  }

  render() {
    if (this.state.gif) {
      return (<img src={this.state.gif} className="giphy" alt={this.props.tag} />);
    }

    return null;
  }
}

export default Giphy;
