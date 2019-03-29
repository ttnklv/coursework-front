import React from 'react';
import {connect} from "react-redux";
import './Vote.css'
import axios from "axios";
import {setInfo} from "../../actions/setInfo";
import tick from "./img/tick.png";
import question from "./img/question.png";
import dagger from "./img/dagger.png";

class VoteTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            votes: []
        };

        this.getVotes = this.getVotes.bind(this);
        this.getVotes();

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

    render() {
        return (
            <div className="votes">

                {this.state.votes.map(
                    article => {
                        return (
                            <div>
                                <div className="article_list">
                                    <img className="img" id="mainVoteImg" src={article.img} alt="иллюстрация"/><br/>
                                    {article.name}<br/>

                                    {article.custom_voice ? null
                                        : <button onClick={() => this.ballot(article.id_vote, "1")}>
                                            <img className="img voteImg" src={tick} alt="иллюстрация"/>
                                        </button>}
                                    {article.custom_voice ? null
                                        : <button>
                                            <img className="img voteImg" src={question} alt="иллюстрация"/>
                                        </button>}
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
                                        : null }

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