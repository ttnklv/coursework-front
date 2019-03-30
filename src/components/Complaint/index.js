import React from "react";
import {connect} from "react-redux";
import complaint from "./img/complaint.png";
import "./Complaint.css"
import axios from "axios";
import {setInfo} from "../../actions/setInfo";

class Complaint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showResults: false,
            message: ''
        };

        this.sendMessage = this.sendMessage.bind(this);
    }

    showComplaint = () => {
        this.setState({showResults: true});
    };

    hideComplaint = () => {
        this.setState({showResults: false});
    };

    onChange(e) {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value})
    }


    sendMessage(e) {
        e.preventDefault();
        let params = new URLSearchParams();
        params.append('body', this.state.message);
        fetch('http://localhost:8080/newComplaint', {
            method: 'POST',
            credentials: 'include',
            body: params
        }).then(res => {
            if (res.status !== 401) {
                this.setState({message: ""});
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="login">
                <button onClick={this.showComplaint} id="complaintButton" className="ordinary">
                    <img className="imgDes" src={complaint} alt="иллюстрация"/>
                </button>

                {this.state.showResults ?
                    <div>
                        <div className="complaint_modal">
                            <form className="complaint_modal-content complaint_animate" onSubmit={this.sendMessage}>
                                    <span className="close" onClick={this.hideComplaint}/>
                                    <div id="headerComplaint">Жалоба</div>

                                    <textarea value={this.state.message} onChange={this.onChange.bind(this)}
                                           placeholder="введите сообщение" name="message" required/>
                                    <button className="buttons" type="submit">отправить</button>
                            </form>
                        </div>
                    </div>
                    : null
                }
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Complaint);
