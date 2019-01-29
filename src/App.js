import React, { Component } from 'react';
import ParametersSection from './components/ParametersSection';
import CardsSection from './components/CardsSection';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productTypes: [],
      years: [],

      selectedProductType: '',
      filterType: 'all',
      personnel: null,
      toEditedTimestamp: null,
      fromEditedTimestamp: null,
      toTimestamp: null,
      fromTimestamp: null,
    }
  }

  componentDidMount() {
    this.fetchProductTypes();
  }

  fetchProductTypes = () => {
    fetch('/SciRateSMUWeb/api/approve/productTypes?types')
      .then(resp => resp.json())
      .then(data => this.setState({productTypes: data}))
      .catch(console.error)
  }

  fetchYears = () => {
    fetch(`/SciRateSMUWeb/api/approve/productTypes?years&productType=${this.state.selectedProductType}`)
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

  updatePersonnel = (value) => {
    this.setState({personnel: value})
  }

  updateDateTo = (value) => {
    this.setState({toTimestamp: value})
    console.log(value)

  }

  updateDateFrom = (value) => {
    this.setState({fromTimestamp: value})
    console.log(value)
  }

  updateEditedDateFrom = (value) => {
    this.setState({fromEditedTimestamp: value})
    console.log(value)
  }

  updateEditedDateTo = (value) => {
    console.log(value)
    this.setState({toEditedTimestamp: value})
  }

  render() {
    return (
      <div className="App">
        <ParametersSection 
          filterType={this.state.filterType} 
          updateFilterType={this.updateFilterType}

          productTypes={this.state.productTypes}
          selectedProductType={this.state.selectedProductType}
          updateSelectedProductType={this.updateSelectedProductType}
          updatePersonnel={this.updatePersonnel}
          updateDateTo={this.updateDateTo}
          updateDateFrom={this.updateDateFrom}
          updateEditedDateTo={this.updateEditedDateTo}
          updateEditedDateFrom={this.updateEditedDateFrom}/>

        <CardsSection
          productType={this.state.selectedProductType}
          personnel={this.state.personnel}
          fromDate={this.state.fromTimestamp}
          toDate={this.state.toTimestamp}
          fromEditedTimestamp={this.state.fromEditedTimestamp}
          toEditedTimestamp={this.state.toEditedTimestamp}
          filterType={this.state.filterType}
           />
      </div>
    );
  }
}

export default App;
