import React, { Component } from 'react';
import jQuery from "jquery";

export default class CardsSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            productType: props.productType,
            personnel: props.personnel,
            dateFrom: props.fromDate,
            dateTo: props.toDate,
            filterType: props.filterType,
            fromEditedTimestamp: props.fromEditedTimestamp,
            toEditedTimestamp: props.toEditedTimestamp
        }
    }

    parseDate = (date) => {
        let d = new Date(date);
        return `${('0'+d.getDate()).slice(-2)}.${('0'+(d.getMonth()+1)).slice(-2)}.${d.getFullYear()}` 
    }

    parseDateTime = (date) => {
        let d = new Date(date);
        return `${('0'+d.getDate()).slice(-2)}.${('0'+(d.getMonth()+1)).slice(-2)}.${d.getFullYear()} ${('0'+d.getHours()).slice(-2)}:${('0'+d.getMinutes()).slice(-2)}` 
    }

    updateCards = () => {
        if (this.state.productType || this.state.personnel) {
            this.setState({cards: []});
            fetch(`/SciRateSMUWeb/approve-card?personnel=${this.state.personnel || ''}&productType=${this.state.productType || ''}&dateFrom=${this.state.dateFrom || ''}&dateTo=${this.state.dateTo || ''}`)
              .then(resp => resp.json())
              .then(data => this.setState({cards: data.reverse()}))
              .catch(console.error)
        } else {
            // alert("Необходимо указать хотя-бы один из параметров: Пользователь, Тип продукта")
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            productType: props.productType,
            personnel: props.personnel,
            dateFrom: props.fromDate,
            dateTo: props.toDate,
            filterType: props.filterType,
            toEditedTimestamp: props.toEditedTimestamp,
            fromEditedTimestamp: props.fromEditedTimestamp
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.productType          !== nextProps.productType           ||
                this.state.personnel            !== nextProps.personnel             ||
                this.state.dateFrom             !== nextProps.fromDate              ||
                this.state.dateTo               !== nextProps.toDate                ||
                this.state.toEditedTimestamp    !== nextProps.toEditedTimestamp     ||
                this.state.fromEditedTimestamp  !== nextProps.fromEditedTimestamp   ||
                this.state.filterType           !== nextProps.filterType            ||
                this.state.lasteventid          !== nextState.lasteventid           ||
                this.state.cards.length         !== nextState.cards.length)
    }

    componentDidUpdate(prevProps) {
        if (this.props.productType  !== prevProps.productType   ||
            this.props.personnel    !== prevProps.personnel     ||
            this.props.fromDate     !== prevProps.fromDate      ||
            this.props.toDate       !== prevProps.toDate) {
            this.updateCards();
        }   
    }

    accept = (id) => {
        this.sendVerdict(id, true);
    }

    reject = (id) => {
        this.setState({lasteventid: id});
        this.sendVerdict(id, false);
    }

    sendVerdict = (id, verdict) => {
        let payload = {
            type: "verdict",
            id: id,
            verdict: verdict,
            action: "create",
        };

        jQuery.ajax({
            url: "/SciRateSMUWeb/approve-data",
            method: "POST",
            data: payload
        }).done(data => {
            console.log(data)
        })
    }

    sendMessage = (id, message) => {
        let data = {
          type: 'message',
          id: id,
          message: message,
        }  

        jQuery.ajax({
           method: 'post',
           url: '/SciRateSMUWeb/approve-data',
           data: data, 
        }).done(data => {
            
            console.log(data)
        })
        this.setState({message: '', lasteventid: null})
    }

    render() {
        console.log(this.state.lasteventid)
        let dialog = this.state.lasteventid ? (<div className='messageWindowWrapper'>
            <div className='newMessage'>
                <h3>Аргументируйте отказ</h3>
                <p>Это поможет исправить ошибки</p>
                <textarea onChange={(event) => this.setState({'message': event.target.value})} className='text form-control'>{this.state.message}</textarea>
                <a href='#' role='button' onClick={event => this.sendMessage(this.state.lasteventid, this.state.message)} className='btn btn-primary'>Отправить</a>
                <a href='#' role='button' onClick={event => this.setState({message: '', lasteventid: null})} className='btn btn-link'>Не отправлять</a>
            </div>
        </div>):(null);

        const productTypeItems = this.state.cards.filter(item => {
            return this.state.filterType === 'all' 
            || ((this.state.filterType === 'marked') && item.hasBeenApproved) 
            || ((this.state.filterType === 'unmarked') && !item.hasBeenApproved) 
            || ((this.state.filterType === 'rejected') && !item.isApproved) 
        }).filter(item => {
            return (!this.state.fromEditedTimestamp || (item.edited >=  this.state.fromEditedTimestamp)) 
                && (!this.state.toEditedTimestamp || (item.edited <= this.state.toEditedTimestamp))
        }).map((item) => {

            let authors = item.owners.map((owner, index) => {
                if (owner.link) {
                    return (<a key={index} href={owner.link} target="_blank" rel="noopener noreferrer" title={owner.fullName}>{owner.shortName}</a>)
                } else {
                    return (<span key={index} title={owner.fullName}>{owner.shortName}</span>)
                }
            });
            
            return (<div key={item.link} className="card">
              <div className="card-header">
                {item.category}, {item.subCategory}
              </div>
              <div className="card-body">
                <h5 className="card-title"><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></h5>
                <p className="card-text"><b>Автор{`${item.owners.length > 1? 'ы' : ''}`}:</b> {authors}</p>
                <p className="card-text"><b>Дата:</b> {`${this.parseDate(item.date)}`}</p>
                <p className="card-text"><b>Описание:</b> {`${item.description}`}</p>
                <hr/>
                <p className="card-text"><b>Добавлено:</b> {`${this.parseDateTime(item.created)}`}</p>
                <p className="card-text"><b>Изменено:</b> {`${this.parseDateTime(item.edited)}`}</p>
                <p className="card-text"><b>Рейтинг:</b> {`${item.rating}`}</p>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="mr-3 btn btn-link">Страница продукта</a>
                <button onClick={() => this.accept(item.eventId)} className="mr-3 btn btn-success">Утвердить</button>
                <button onClick={() => this.reject(item.eventId)} className="mr-3 btn btn-danger">Отклонить</button>
            </div>
            </div>)});

        return (
            <div>
                <div className="container">
                    {productTypeItems}
                </div>
                {dialog}
            </div>
        );
    }
}
