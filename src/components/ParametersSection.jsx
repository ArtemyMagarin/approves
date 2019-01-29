import React, { Component } from 'react';

export default class ParametersSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            persname: '',
            lis: null,
            rawDateFrom: "2018-02-01",
            rawDateTo: "2019-01-31",
            rawEditedDateFrom: "2018-02-01",
            rawEditedDateTo: "2019-01-31"
        }
    }

    onProductTypeChange = (event) => {
        this.props.updateSelectedProductType(event.target.value)
    }

    

    fetchUsers = () => {
        fetch(`/SciRateSMUWeb/api/approve/productTypes?users`)
              .then(resp => resp.json())
              .then(data => this.setState({users: data}))
              .catch(console.error)
    }

    componentDidMount() {
        this.fetchUsers();
        this.props.updateDateFrom((new Date(`${this.state.rawDateFrom} 00:00`)).getTime());
        this.props.updateDateTo((new Date(`${this.state.rawDateTo} 23:59`)).getTime());
    }

    handleChange(event) {
        this.setState({persname: event.target.value});
        this.updateList();
    }

    updateList() {
        if (this.state.persname && this.state.persname.length > 1) {
            let lis = this.state.users.filter(item => {
                return (item.fullName.toLowerCase().indexOf(this.state.persname.toLowerCase()) > -1)
            }).map((item, index) => {
                return (<li key={index} onClick={() => {this.selectPersonnel(item.id, item.fullName)}}>{`${item.fullName}${item.groupNum? " ("+item.groupNum+" группа)" : ""}`}</li>);
            });
            this.setState({lis: lis}); 
        }
    }

    selectPersonnel(id, name) {
        this.setState({persname: name, lis: null}); 
        this.props.updatePersonnel(id);
    }

    discardPersonnel = () => {
        this.selectPersonnel(null, '');
    }

    changeDateFrom = (event) => {
        this.setState({rawDateFrom: event.target.value});
        if (isNaN((new Date(`${event.target.value} 00:00`)).getTime())) {
            this.props.updateDateFrom(null);
        } else {
            this.props.updateDateFrom((new Date(`${event.target.value} 00:00`)).getTime())
        }
    }

    changeDateTo = (event) => {
        this.setState({rawDateTo: event.target.value});
        if (isNaN(new Date(`${event.target.value} 23:59`).getTime())) {
            this.props.updateDateTo(null);
        } else {
            this.props.updateDateTo((new Date(`${event.target.value} 23:59`)).getTime())
        }
    }

    changeEditedDateFrom = (event) => {
        this.setState({rawEditedDateFrom: event.target.value});
        if (isNaN((new Date(`${event.target.value} 00:00`)).getTime())) {
            this.props.updateEditedDateFrom(null);
        } else {
            this.props.updateEditedDateFrom((new Date(`${event.target.value} 00:00`)).getTime())
        }
    }

    changeEditedDateTo = (event) => {
        this.setState({rawEditedDateTo: event.target.value});
        if (isNaN(new Date(`${event.target.value} 23:59`).getTime())) {
            this.props.updateEditedDateTo(null);
        } else {
            this.props.updateEditedDateTo((new Date(`${event.target.value} 23:59`)).getTime())
        }
    }



    render() {

        const productTypeItems = this.props.productTypes.map((item) => 
            <option 
                value={item.name} 
                key={item.name}>
                    {item.name} ({item.unmarked}/{item.marked + item.unmarked})

            </option>);

        return (
            <div className="container">
                <h4>Выберите вид продукта, который хотите одобрить или отклонить</h4>
                <br/>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label"><b>Вид продукта:</b></label>
                    <div className="col-sm-10">
                        <select 
                            value={this.props.selectedProductType} 
                            className="form-control" 
                            onChange={ this.onProductTypeChange }>
                            <option value={''}>Вид продукта (Новых/Всего)</option>
                            {productTypeItems}
                        </select>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label"><b>Пользователь:</b></label>
                    <div className="col-sm-8">
                        <div className="autocomplete-wrapper w-100">
                            <input type="text" className="form-control" placeholder="Начните вводить ФИО и выберите из списка" value={this.state.persname} onChange={this.handleChange.bind(this)}/>
                            <div className="items-box">
                                <ol>{this.state.lis}</ol>
                            </div>
                        </div>
                        
                    </div>
                     <div className="col-sm-2">
                        <button className="btn btn-danger" onClick={this.discardPersonnel.bind(this)}>Сброс</button>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Показать:</label>
                    <div className="col-sm-10">
                        <div className="link-wrapper">
                            <button 
                                className={'btn btn-link ' + (this.props.filterType === 'all' ? 'selected' : '')} 
                                onClick={() => {this.props.updateFilterType('all')}}
                            >Все</button>
                            
                            <button 
                                className={'btn btn-link ' + (this.props.filterType === 'marked' ? 'selected' : '')} 
                                onClick={() => {this.props.updateFilterType('marked')}}
                            >Помеченые</button>

                            <button 
                                className={'btn btn-link ' + (this.props.filterType === 'unmarked' ? 'selected' : '')} 
                                onClick={() => {this.props.updateFilterType('unmarked')}}
                            >Непомеченые</button>

                            <button 
                                className={'btn btn-link ' + (this.props.filterType === 'rejected' ? 'selected' : '')} 
                                onClick={() => {this.props.updateFilterType('rejected')}}
                            >Только отклоненные</button>
                        </div>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Рамки события:</label>
                    <div className="col-sm-5">
                        <input type="date" className={'form-control'}
                           value={this.state.rawDateFrom} onChange={this.changeDateFrom.bind(this)}/>
                    </div>
                    <div className="col-sm-5">
                        <input type="date" className={'form-control'}
                           value={this.state.rawDateTo} onChange={this.changeDateTo.bind(this)}/>
                        
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Рамки изменения:</label>
                    <div className="col-sm-5">
                        <input type="date" className={'form-control'}
                           value={this.state.rawEditedDateFrom} onChange={this.changeEditedDateFrom.bind(this)}/>
                    </div>
                    <div className="col-sm-5">
                        <input type="date" className={'form-control'}
                           value={this.state.rawEditedDateTo} onChange={this.changeEditedDateTo.bind(this)}/>
                        
                    </div>
                </div>
                <br/>
                <h3>{this.props.selectedProductType}</h3>
                <br/>
            </div>
        );
    }
}
