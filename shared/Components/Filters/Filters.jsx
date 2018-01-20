import React, { Component } from 'react';
import cN from 'classnames';
import Select from '../Select';
import s from './Filters.css';

export default class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: [],
      nameValue: ''
    };

    this.options = [];
  }

  handleFilterChange = (column, niceName, choice) => {
    const { onFilterUpdate, filter } = this.props;
    let found = false;

    for (let i = 0; i < filter.length; i += 1) {
      const filterItem = filter[i];
      if (filterItem.column === column) {
        found = true;
        filterItem.which = choice;
      }
    }

    if (!found) {
      filter.push({
        column: column,
        columnNiceName: niceName,
        which: choice
      });
    }

    if (onFilterUpdate) onFilterUpdate(filter);
  };

  componentWillMount() {
    const items = tarjetones_2018_data.filters;
    if (!items) return;
    this.options = items.map((item) => {
      if (item.hasOwnProperty("only")) return;
      let options;

      if (item.hasOwnProperty("options")) {
        options = item.options.map((option) => {
          return {
            label: option,
            value: option
          };
        });
      } else {
        options = this.generateOptions(item.column);
      }

      options.sort(function (a, b) {
        return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0);
      });

      options.unshift({ label: "Todos", value: null });

      return {
        column: item.column,
        title: item.title,
        options: options
      }
    });
    this.options.clean(undefined);
  }

  isFilterWorthIt(column, value) {
    // Get the data from the attribute
    const { data, filter } = this.props;

    const items = tarjetones_2018_data.filters;

    for (let i = 0; i < filter.length; i += 1) {
      if (filter[i].column === column) return data.filter((item) => {
        if (items) {
          for (let i = 0; i < items.length; i += 1) {
            if (items[i].hasOwnProperty("only")) {
              if (item[items[i].column] === items[i].only) return true;
            }
          }
        }
      });
    }

    // Loop through the data
    const people = data.map((item) => {
        const { nombres } = item;

        if (items) {
          for (let i = 0; i < items.length; i += 1) {
            if (items[i].hasOwnProperty("only")) {
              if (item[items[i].column] !== items[i].only) return;
            }
          }
        }

        for (let i = 0; i < filter.length; i += 1) {
          const filterItem = filter[i];
          if (filterItem.which === null) continue;
          if (item[filterItem.column] !== filterItem.which) return;
        }

        if (item[column] !== value) return;
        return nombres;
      }
    );

    return people.clean(undefined).length;
  }

  generateOptions(column) {
    const { data } = this.props;
    const array = [];
    const items = data.map((item) => {
      if (item[column] === '') return;

      for (let i = 0; i < array.length; i += 1) {
        if (array[i] === item[column]) return;
      }

      if (!this.isFilterWorthIt(column, item[column])) return;

      array.push(item[column]);
      return {
        label: item[column],
        value: item[column]
      };
    });

    return items.clean(undefined);
  }

  getSelects() {
    const { grid } = this.props;
    const items = tarjetones_2018_data.filters;
    if (!items) return;
    return this.options.map((item) => {

      return (
        <Select
          key={item.title}
          title={item.title}
          options={item.options}
          bordered={grid}
          callback={this.handleFilterChange.bind(this, item.column, item.title)}
        />
      );
    });
  }

  handleFormInput = event => {
    const val = event.target.value;
    this.setState({ nameValue: val });
    if (this.props.onNameUpdate) this.props.onNameUpdate(val);
  };

  render() {
    const { grid } = this.props;
    const selects = this.getSelects();
    return (
      <div className={s.root}>
        <div className={cN(s.selects, { [s.grid]: grid })}>
          {selects}
        </div>

        {this.props.filter.map(item => {
          if (!item.which || !item.columnNiceName) return;
          return (
            <button title={`Eliminar filtro ${item.columnNiceName}`} className={s.activeFilter} key={item.column}
                    onClick={this.handleFilterChange.bind(this, item.column, item.columnNiceName, null)}>
              <span className={s.title}>{item.columnNiceName}</span>
              <span>{item.which}</span>
              <div className={s.cross} />
            </button>
          )
        })}

        <button className={s.searchBtn}
                style={{ backgroundImage: `url(http://lasillavacia.com/sites/all/themes/lasillavacia/images/search.svg)` }}>
        </button>
        {/*<form className={s.form}>*/}
        {/*<input*/}
        {/*id={`input-${s.nameInput}`}*/}
        {/*required={true}*/}
        {/*className={s.nameInput}*/}
        {/*value={this.state.nameValue}*/}
        {/*onChange={this.handleFormInput}*/}
        {/*autoComplete={'off'}*/}
        {/*type="text"*/}
        {/*/>*/}
        {/*<label className={s.label} htmlFor={`input-${s.nameInput}`}>Busca a una persona</label>*/}
        {/*</form>*/}
      </div>
    )
  }
}