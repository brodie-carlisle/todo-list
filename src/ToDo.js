import React, { Component } from "react";
// import ReactDOM from "react-dom";
import Modal1 from "./Modal";
import "./styling/ToDo.css";
import DatePicker from "react-date-picker";
import EditModal from "./EditModal";

class ToDo extends Component {
  state = {
    show: false,
    date: new Date(),
    dateStr: "",
    toDo: "",
    list: [],
    showEditM: false,
    id: ""
  };

  showModal = () => {
    this.setState({ show: true });
    this.dateChange(this.state.date);
    console.log("show modal", this.state);
  };

  showEditModal = () => {
    // console.log('edit click', this.state)
    this.setState({ showEditM: true });
  };

  hideEditModal = () => {
    this.setState({
      showEditM: false,
      date: new Date(),
      toDo: "",
      dateStr: "",
      id: "",
      list: []
    });
    this.getList();
  };

  hideModal = () => {
    this.setState({ show: false, date: new Date(), toDo: "", dateStr: "" });
    this.getList();
  };

  onChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
    console.log(this.state);
  };

  dateChange = date => {
    const toString = date.toDateString();
    this.setState({ date });
    this.setState({ dateStr: toString });
    console.log(toString);
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { date, show, list, showEditM, id, ...data } = this.state;
    const url = "http://localhost:4000/";

    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.hideModal();
  };

  getList = () => {
    fetch("http://localhost:4000/")
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        this.setState({ list: myJson });
        // console.log(this.state.list)
      })
      .catch(err => console.log("error", err));
  };

  delete = async ID => {
    console.log("delete req recd", this.state);
    const data = this.state;
    const url = "http://localhost:4000/" + ID;

    await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(this.getList());
  };

  editList = entry => {
    this.showEditModal();
    const toDateObj = new Date(entry.dateStr);

    this.setState(
      {
        toDo: entry.toDo,
        date: toDateObj,
        id: entry._id
      },
      () => this.dateChange(this.state.date)
    );
    console.log(this.state.date);
    // this.dateChange(this.state.date);
    console.log("from edit", this.state);
  };

  editSubmit = e => {
    const { date, show, list, showEditM, id, ...data } = this.state;
    const url = "http://localhost:4000/" + this.state.id;

    fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.hideEditModal();
    this.getList();
  };

  componentDidMount() {
    this.getList();
  }

  render() {
    const list = this.state.list;
    // console.log('from below',list)
    return (
      <div>
        <h1 className="title">To Do List</h1>
        <button className="button" type="button" onClick={this.showModal}>
          +add
        </button>
        <br />
        <h2>
          {list.map(entry => (
            <div key={entry._id}>
              <span className="todo"> {entry.toDo} </span>
              <span className="due">due </span>
              <span className="date">{entry.dateStr} </span>

              <button onClick={() => this.editList(entry)}>edit</button>
              <button onClick={() => this.delete(entry._id)}>complete</button>
            </div>
          ))}
        </h2>
        <Modal1 show={this.state.show} handleClose={this.hideModal}>
          <h1>
            <input
              className="inputBox"
              value={this.state.toDo}
              name="toDo"
              placeholder="Description"
              size="35"
              onChange={e => this.onChange(e)}
            />
            &nbsp;
            <DatePicker
              className="calendar"
              name="date"
              onChange={this.dateChange}
              value={this.state.date}
            />
            <br />
            <button
              className="button"
              type="submit"
              onClick={e => this.handleSubmit(e)}
            >
              add
            </button>
          </h1>
        </Modal1>
        <EditModal
          showEditM={this.state.showEditM}
          handleEditClose={this.hideEditModal}
        >
          <input
            className="inputBox"
            value={this.state.toDo}
            name="toDo"
            placeholder="Description"
            size="35"
            onChange={e => this.onChange(e)}
          />
          &nbsp;
          <DatePicker
            className="calendar"
            name="date"
            onChange={this.dateChange}
            value={this.state.date}
          />
          <br />
          <button
            className="button"
            type="submit"
            onClick={e => this.editSubmit(e)}
          >
            update
          </button>
        </EditModal>
      </div>
    );
  }
}
export default ToDo;
