import React from "react";
import {connect} from "react-redux";
import complaintAnswer from "./img/complaintAnswer.png";
import "./ComplaintAnswer.css"
import {setInfo} from "../../actions/setInfo";
import axios from "axios";

class ComplaintAnswer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showResults: false,
            answers: []
        };

        this.getAnswers = this.getAnswers.bind(this);
        this.getAnswers();
    }

    showComplaint = () => {
        this.setState({showResults: true});
    };

    hideComplaint = () => {
        this.setState({showResults: false});
    };

    getAnswers() {
        return axios.get('http://localhost:8080/getAllComplaintsForUser', {
            withCredentials: true,
        })
            .then(res => {
                if (res.status !== 401) {
                    console.log("answers" + res.data);
                    this.setState({answers: res.data})
                }
            }).catch(err => {
                alert(err);
            });
    }

    render() {
        return (
            <div className="login">
                <button onClick={this.showComplaint} id="complaintAnswerButton" className="ordinary">
                    <img className="imgDes" src={complaintAnswer} alt="иллюстрация"/>
                </button>

                {this.state.showResults ?
                    <div>
                        <div className="complaintAnswer_modal">
                            <div className="complaintAnswer_modal-content complaintAnswer_animate">
                                <span className="close" onClick={this.hideComplaint}/>
                                <div id="headerAnswerComplaint">Ответы на Ваши жалобы</div>
                                {this.state.answers.map(
                                    answer => {
                                        return (
                                            <div>
                                                <div className="article_list_complaint_answer">
                                                    <div className="text_complaintAnswer_forName">
                                                        Ваша жалоба:
                                                    </div>
                                                    {answer.body}<br/>
                                                    <div className="text_complaintAnswer_forName">
                                                        Ответ:
                                                    </div>
                                                    {answer.answer}
                                                </div>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintAnswer);
