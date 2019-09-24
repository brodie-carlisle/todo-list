import React, { Component } from "react";
import Modal1 from "./Modal";
import "./styling/ToDo.css";
import DatePicker from "react-date-picker";
import EditModal from "./EditModal";


const LEADS_API = process.env.REACT_APP_LEADS_API;

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

  showModal = () => { //shows input modal
    this.setState({ show: true });
    this.dateChange(this.state.date);
  };

  showEditModal = () => { //shows edit modal
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

  dateChange = date => { //onchange for calendar
    const toString = date.toDateString();//changes date to str to remove extra date fields
    this.setState({ date }); //sets date from form calendar input
    this.setState({ dateStr: toString }); //sets datestr state
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { date, show, list, showEditM, id, ...data } = this.state;
    const url = `${LEADS_API}`;

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
    fetch(`${LEADS_API}`)
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
    const url = `${LEADS_API}/${ID}`;

    await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        //header tells api what type of content is being sent. 
        "Content-Type": "application/json" //telling API that content coming over as a string is a json obj
      }
    })
    this.getList()
    // .then(this.getList()).then(this.forceUpdate())
  };

  editList = entry => { //called when 'edit' button is cliecked
    this.showEditModal();
    const toDateObj = new Date(entry.dateStr); //changes date back from str to obj to be compatible with calendar and set state

    this.setState(
      {
        toDo: entry.toDo,
        date: toDateObj,
        id: entry._id
      },
      () => this.dateChange(this.state.date) //forces state to update with date rec'd from DB when 'edit' button is clicked. Otherwise, date must be re-selected or it will be blank.
    );
  };

  editSubmit = e => { //submit button within edit modal
    const { date, show, list, showEditM, id, ...data } = this.state;
    const url = `${LEADS_API}/${this.state.id}`;

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
    return (
      <div className="main">
        <h1 className="title">To Do List</h1>
        <button className="button" type="button" onClick={this.showModal}>
          +add
        </button>
        <br />
        <h2>
          {this.state.list.map(entry => (
            <div key={entry._id} className="displayList">
              <span className="todo"> {entry.toDo} </span>
              <span className="flexContainer">
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
                type="button"
                className="completeButton"
                onClick={() => this.delete(entry._id)}
              >
                complete
              </button>
              </span>
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
