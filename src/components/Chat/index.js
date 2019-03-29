import React from "react";
import {connect} from "react-redux";
import chat from "./img/chat.png";
import "./Chat.css"
import axios from "axios";
import {setInfo} from "../../actions/setInfo";

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showResults: false,
            message: '',
            err: false,
            egg: false,
            filmName: "",
            photo: [],
            messageFromServer: []
        };
        this.filmInformation = this.filmInformation.bind(this);
        this.filmInformation();

        this.getMessagesFromServer = this.getMessagesFromServer.bind(this);
        this.getMessagesFromServer();

        this.sendMessage = this.sendMessage.bind(this);
    }

    showLogin = () => {
        this.setState({showResults: true});
    };

    hideLogin = () => {
        this.setState({showResults: false, egg: false});
    };

    onChange(e) {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value})
    }

    getMessagesFromServer() {
        let params = new URLSearchParams();
        params.append('id_film', "1");//this.props.info
        axios.get('http://localhost:8080/getMes', {
            withCredentials: true,
            params
        })
            .then(res => {
                if (res.status !== 401) {
                    this.setState({messageFromServer: res.data});
                }
            }).catch(err => {
            console.log(err);
        });
    }

    filmInformation() {
        let params = new URLSearchParams();
        params.append('film_id', "1");//this.props.info
        axios.get('http://localhost:8080/getMainInfoOfTehFilm', {
            withCredentials: true,
            params
        })
            .then(res => {
                if (res.status !== 401) {
                    this.setState({filmName: res.data.name});
                    this.arrayOfPhoto();
                }
            }).catch(err => {
            console.log(err);
        });
    }

    arrayOfPhoto() {
        let params = new URLSearchParams();
        params.append('film_id', "1");//this.props.info
        axios.get('http://localhost:8080/getPhotosAsString', {
            withCredentials: true,
            params
        })
            .then(res => {
                if (res.status !== 401) {
                    this.setState({photo: res.data});
                }
            }).catch(err => {
            console.log(err);
        });
    }

    sendMessage(e) {
        e.preventDefault();
        let params = new URLSearchParams();
        params.append('film_id', "1");
        params.append('message', this.state.message);
        fetch('http://localhost:8080/setMes', {
            method: 'POST',
            credentials: 'include',
            body: params
        }).then(res => {
            if (res.status !== 401) {
                this.getMessagesFromServer();
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="login">
                <button onClick={this.showLogin} id="chatButton" className="ordinary">
                    <img className="imgDes" src={chat} alt="иллюстрация"/>
                </button>

                {this.state.showResults ?
                    <div>
                        <div className="chat_modal">
                            <form className="chat_modal-content chat_animate" onSubmit={this.sendMessage}>
                                    <span className="close" onClick={this.hideLogin}/>
                                    <img className="img" id="chatPic" src={this.state.photo[0]} alt="иллюстрация"/>
                                    <div id="nameOfTheFilm">{this.state.filmName}</div>
                                    {
                                        this.state.messageFromServer.map(
                                            message => {
                                                return (
                                                    <div>
                                                        <div className="text_chat">
                                                            Автор: {message.user}
                                                            {message.message}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                    <input type="text" value={this.state.message} onChange={this.onChange.bind(this)}
                                           placeholder="введите сообщение" name="message" required/>
                                    <button className="buttons" type="submit">отправить</button>
                            </form>
                        </div>
                    </div>
                    :
                    null
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
