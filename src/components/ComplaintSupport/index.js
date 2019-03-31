import React from 'react';
import {connect} from "react-redux";
import './ComplaintSupport.css'
import axios from "axios";
import {setInfo} from "../../actions/setInfo";
import check from "./img/check.png";
import ask from "./img/ask.png";

class ComplaintSupport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            complaints: [],
            name: "",
            id:"",
            content: ""
        };

        this.getComplaints = this.getComplaints.bind(this);
        this.getComplaints();

        this.startMethod = this.startMethod.bind(this);
        this.startMethod();

        this.setAnswer = this.setAnswer.bind(this);
    }

    onChange(e) {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value});
        this.setState({id: e.target.id});
    }

    setAnswer(e) {
        e.preventDefault();
        let params = new URLSearchParams();
        params.append('idComplaint', this.state.id);
        params.append("body", this.state.content);
        fetch('http://localhost:8080/answerForComplaint', {
            method: 'POST',
            credentials: 'include',
            body: params
        }).then(res => {
            if (res.status !== 401) {
                this.getComplaints();
                this.setState({content: ""});
            }
        }).catch(err => {
            console.log(err);
        });
    }

    startMethod() {
        console.log('http://localhost:8080/login');
        let params = new URLSearchParams();
        params.append('username', "ttnklv");
        params.append('password', "12345");
        axios.get('http://localhost:8080/login', {
            withCredentials: true,
            params
        })
            .then(res => {
                if (res.status !== 401) {
                    console.log(res.status);
                }
            }).catch(err => {
            alert(err);
            return false;
        });
    }

    getComplaints() {
        axios.get('http://localhost:8080/allComplaintsForSupport', {
            withCredentials: true,
        })
            .then(res => {
                if (res.status !== 401) {
                    this.setState({complaints: res.data});
                }
            }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                <div id="art">
                    <div id="name_art">Жалобы пользователей</div>
                    {this.state.complaints.map(
                        complaint => {
                            return (
                                <div className="one_complaint">
                                    <div className="complaint_list">
                                        <div className="name_user"><b>Пользователь:{complaint.user_name}</b></div>
                                        <br/>
                                        <div className="body_complaint">{complaint.body}</div>
                                        <br/>
                                        {complaint.checker ?
                                            <div>
                                                <img className="checkTips" src={check} alt="иллюстрация"/>
                                                <div className="answer_complaint">
                                                    <div className="name_user">
                                                        <b>Ответ:</b>
                                                        {complaint.answer}</div>
                                                </div>
                                            </div>
                                            : <div>
                                                <img className="checkTips" src={ask} alt="иллюстрация"/>
                                                <form id="send_answer" onSubmit={this.setAnswer}>
                                                    <input type="text" value={this.state.content}
                                                           onChange={this.onChange.bind(this)}
                                                           id={complaint.id}
                                                           placeholder="введите ответ на жалобу" name="content"
                                                           required/>
                                                    <button id="submit-vote" className="buttons" type="submit">отправить</button>
                                                </form>
                                            </div>
                                        }
                                    </div>
                                </div>
                            )
                        }
                    )}
                    <div id="mainMenuForSupport">
                        <div className="category-wrap">
                            <h3>Основное меню</h3>
                            <ul>
                                <li>
                                    <div name="a">Блокировка пользовател</div>
                                </li>
                                <li>
                                    <div name="a">Банковская система</div>
                                </li>
                                <li>
                                    <div name="a">Выход</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

function mapStateToProps(state) {
    return {
        info: state.infoReducer.info,
    }
}


function mapDispatchToProps(dispatch) {
    return {
        setInfo: (info) => {
            dispatch(setInfo(info));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintSupport);