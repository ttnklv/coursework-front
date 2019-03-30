import React from 'react';
import {connect} from "react-redux";
import './Vote.css'
import axios from "axios";
import {setInfo} from "../../actions/setInfo";
import tick from "./img/tick.png";
import question from "./img/question.png";
import dagger from "./img/dagger.png";
import pen from "./img/pen.png";

class VoteTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            votes: [],
            content: "",
            showResults: false,
            file: "",
            imgUrl: "",
            buttonName: "Выберите фото"
        };

        this.getVotes = this.getVotes.bind(this);
        this.getVotes();

        this.filmInformation = this.filmInformation.bind(this);
        this.filmInformation();

        this.createNewVote = this.createNewVote.bind(this);
    }

    onChange(e) {
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value})
    }

    showCreateBox = () => {
        this.setState({showResults: true});
    };

    hideCreateBox = () => {
        this.setState({showResults: false});
    };

    createNewVote(e) {
        console.log(this.state.content);
        e.preventDefault();
        let params = new URLSearchParams();
        params.append('id_film', "1");//this.props.info
        params.append("name", this.state.content);
        params.append('photo', this.state.imgUrl);
        fetch('http://localhost:8080/createNewVote', {
            method: 'POST',
            credentials: 'include',
            body: params
        }).then(res => {
            if (res.status !== 401) {
                this.getVotes();
                this.setState({content: ""});
                this.setState({
                    buttonName: "Выберите фото",
                    file: "",
                    imgUrl: ""
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }


    getVotes() {
        let params = new URLSearchParams();
        params.append('id_film', "1");//this.props.info
        axios.get('http://localhost:8080/findAllVotesForFilm', {
            withCredentials: true,
            params
        })
            .then(res => {
                if (res.status !== 401) {
                    console.log(res.data);
                    this.setState({votes: res.data});
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
                    this.setState({name: res.data.name});
                }
            }).catch(err => {
            alert(err);
            return false;
        });
    }

    ballot(id_vote, choice) {
        let params = new URLSearchParams();
        params.append('id_vote', id_vote);
        params.append('choice', choice);
        axios.get('http://localhost:8080/checkUserVote', {
            withCredentials: true,
            params
        })
            .then(res => {
                if (res.status === 200) {
                    this.getVotes();
                }
            }).catch(err => {
            console.log(err);
        });
    }

    handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imgUrl: reader.result,
                buttonName: file.name
            });
        };

        reader.readAsDataURL(file)
    }

    render() {
        return (
            <div className="votes">
                <div id="name_film_chat">{this.state.name}</div>

                <button onClick={this.showCreateBox}>
                    <img name="create" className="img voteImg" src={pen} alt="иллюстрация"/>
                </button>

                {this.state.showResults ?
                    <div id="formCreate">
                        <span className="close" onClick={this.hideCreateBox}/>
                        <form onSubmit={this.createNewVote}>
                            <input type="file" onChange={(e) => this.handleImageChange(e)} name="file" id="file"
                                   className="inputfile"/>
                            <label htmlFor="file">{this.state.buttonName}</label>
                            <div id="input_vote">
                                <input type="text" value={this.state.content} onChange={this.onChange.bind(this)}
                                       placeholder="введите вопрос" name="content" required/>
                                <button id="submit-vote" className="buttons" type="submit">отправить</button>
                            </div>
                        </form>
                    </div>
                    : null}

                {this.state.votes.map(
                    article => {
                        return (
                            <div>
                                <div className="article_list">
                                    <img className="img" id="mainVoteImg" src={article.img} alt="иллюстрация"/><br/>
                                    <div className="answer">{article.name}</div>
                                    <br/>

                                    {article.custom_voice ? null
                                        : <button onClick={() => this.ballot(article.id_vote, "1")}>
                                            <img className="img voteImg" src={tick} alt="иллюстрация"/>
                                        </button>}
                                    {article.custom_voice ? null
                                        : <div id="question">
                                            <img name="q" className="img voteImg" src={question} alt="иллюстрация"/>
                                            <div id="answer">
                                                <div className="answer"> Да {article.positive}</div>
                                                <br/>
                                                <div className="answer">Нет {article.negative}</div>
                                            </div>
                                        </div>}
                                    {article.custom_voice ? null
                                        : <button onClick={() => this.ballot(article.id_vote, "0")}>
                                            <img className="img voteImg" src={dagger} alt="иллюстрация"/>
                                        </button>}
                                    {article.custom_voice ?
                                        <div>
                                            <img className="img checkVoteImg" src={tick} alt="иллюстрация"/>
                                            <div className="answer">{article.positive}</div>
                                            <img className="img checkVoteImg" src={dagger} alt="иллюстрация"/>
                                            <div className="answer">{article.negative}</div>
                                        </div>
                                        : null}

                                </div>
                            </div>
                        )
                    }
                )}

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

export default connect(mapStateToProps, mapDispatchToProps)(VoteTest);