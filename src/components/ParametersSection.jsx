import React, { Component } from 'react';

export default class ParametersSection extends Component {

    onProductTypeChange = (event) => {
        this.props.updateSelectedProductType(event.target.value)
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
                    <label className="col-sm-2 col-form-label">Вид продукта:</label>
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
                        </div>
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Год:</label>
                    <div className="col-sm-10">
                        <select className="form-control">
                            
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}
