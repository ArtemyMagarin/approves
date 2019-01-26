import React, { Component } from 'react';
import ParametersSection from './components/ParametersSection';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productTypes: [],
      years: [],

      selectedProductType: '',
      filterType: 'unmarked',
    }
  }

  componentDidMount() {
    this.fetchProductTypes();
  }

  fetchProductTypes = () => {
    fetch('http://localhost:8080/SciRateSMUWeb/api/approve/productTypes?types')
      .then(resp => resp.json())
      .then(data => this.setState({productTypes: data}))
      .catch(console.error)
  }

  fetchYears = () => {
    fetch(`http://localhost:8080/SciRateSMUWeb/api/approve/productTypes?years&productType=${this.state.selectedProductType}`)
      .then(resp => resp.json())
      .then(data => this.setState({years: data}))
      .catch(console.error)
  }

  updateFilterType = (value) => {
    this.setState({filterType: value})
  }

  updateSelectedProductType = (value) => {
    this.setState({selectedProductType: value})
    console.log(value)
  }

  render() {
    return (
      <div className="App">
        <ParametersSection 
          filterType={this.state.filterType} 
          updateFilterType={this.updateFilterType}

          productTypes={this.state.productTypes}
          selectedProductType={this.state.selectedProductType}
          updateSelectedProductType={this.updateSelectedProductType}/>
      </div>
    );
  }
}

export default App;
