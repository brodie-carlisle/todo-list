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
  };

  showEditModal = () => {
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
  };

  dateChange = date => {
    const toString = date.toDateString();
    this.setState({ date });
    this.setState({ dateStr: toString });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { date, show, list, showEditM, id, ...data } = this.state;
    const url = "https://helio-to-do-api.herokuapp.com";

    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      // .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error("Error:", error));
    this.hideModal();
  };

  getList = () => {
    fetch("https://helio-to-do-api.herokuapp.com")
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        this.setState({ list: myJson });
      })
      .catch(err => console.log("error", err));
  };

  delete = async ID => {
    const data = this.state;
    const url = "https://helio-to-do-api.herokuapp.com" + ID;

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
  };

  editSubmit = e => {
    const { date, show, list, showEditM, id, ...data } = this.state;
    const url = "https://helio-to-do-api.herokuapp.com" + this.state.id;

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
              <button
                className="editButton"
                onClick={() => this.editList(entry)}
              >
                edit
              </button>
              &nbsp;
              <button
                className="completeButton"
                onClick={() => this.delete(entry._id)}
              >
                complete
              </button>
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
          <br />
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
          <br />
          <button
            className="button"
            type="submit"
            onClick={e => this.editSubmit(e)}
          >
            update
          </button>
          <br />
          <br />
        </EditModal>
      </div>
    );
  }
}
export default ToDo;


