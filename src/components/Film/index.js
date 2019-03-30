import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import axios from "axios";
import descriptionIMG from "./img/description.png";
import article from "./img/article.png";
import votes from "./img/vote.png";
import {setInfo} from "../../actions/setInfo";
import './Film.css';
import Chat from "../Chat"
import Complaint from "../Complaint"
import ComplaintAnswer from "../ComplaintAnswer";


class Film extends React.Component {

    constructor(props) {
        super(props);
        this.startMethod = this.startMethod.bind(this);
        this.startMethod();

        this.checkLocation = this.checkLocation.bind(this);
        // this.checkLocation();

        this.state = {
            test: [],
            review: [],
            info: ""
        };

        this.filmInformation = this.filmInformation.bind(this);
        this.filmInformation();

        this.filmReview = this.filmReview.bind(this);

        this.changeLocation = this.changeLocation.bind(this);
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

    filmInformation() {
        let params = new URLSearchParams();
        params.append('film_id', "1");//this.props.info
        axios.get('http://localhost:8080/getMainInfoOfTehFilm', {
            withCredentials: true,
            params
        })
            .then(res => {
                if (res.status !== 401) {
                    this.setState({info: res.data});
                    this.arrayOfPhoto();
                    this.filmReview();
                    console.log(res);
                }
            }).catch(err => {
            alert(err);
            return false;
        });
    }

    filmReview() {
        const url = 'http://localhost:8080/findTheMostInterestingAnnotation?film_id=' + "1";//this.props.info;
        console.log(url);
        fetch(url, {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                this.setState({review: [data[0], data[1], data[2]]});
            });
    }

    arrayOfPhoto() {
        let params = new URLSearchParams();
        params.append('film_id', "1");//this.props.info
        return axios.get('http://localhost:8080/getPhotosAsString', {
            withCredentials: true,
            params
        })
            .then(res => {
                if (res.status !== 401) {
                    console.log(res.data);
                    this.setState({test: res.data})
                }
            }).catch(err => {
                alert(err);
            });
    }

    checkLocation() {
        if (this.props.info == null || this.props.info === undefined) {
            let params = new URLSearchParams();
            params.append('id_user', "1");
            axios.get('http://localhost:8090/getState', {params})
                .then(res => {
                    if (res.status !== 401) {
                        console.log(res.data.id_film);
                        this.props.setInfo(res.data.id_film);
                        this.filmInformation();
                        this.filmReview();
                    }
                }).catch(err => {
                console.log(err);
            });
        } else {
            this.filmInformation();
            this.filmReview();
        }
    }

    changeLocation() {
        let params = new URLSearchParams();
        params.append('id_user', "1");
        params.append('id_film', this.props.info);
        axios.get('http://localhost:8090/setState', {params});
    }


    render() {
        if (this.state.info) {
            return (
                <div>
                    <div className="name">
                        {this.state.info.name}
                    </div>
                    <div className="rank">
                        <div className="number">{this.state.info.score}%</div>
                        <div>Рейтинг фильма</div>
                    </div>
                    <div className="mainInfo">
                        <img className="imgDes" id="description" src={descriptionIMG} alt="иллюстрация"/>
                        {this.state.info.body}
                    </div>
                    <div className="picture">
                        <img className="img" id="mainPic" src={this.state.test[0]} alt="иллюстрация"/>
                    </div>
                    <div className="manyPic">
                        <img className="img imgSmall" src={this.state.test[1]} alt="иллюстрация"/>
                        <img className="img imgSmall" src={this.state.test[2]} alt="иллюстрация"/>
                        <img className="img imgSmall" src={this.state.test[3]} alt="иллюстрация"/>
                        <img className="img imgSmall" src={this.state.test[4]} alt="иллюстрация"/>
                        <img className="img imgSmall" src={this.state.test[5]} alt="иллюстрация"/>
                    </div>
                    <div className="scoreAndArticle">
                        <div className="yourScore">
                            <div>Ваша оценка</div>
                            <div className="circle">
                                <div className="number"> {this.state.info.userScore}</div>
                            </div>

                        </div>

                        {
                            this.state.review.map(
                                review => {
                                    return (
                                        <div className="article">
                                            <div className="number">
                                                {review.score}%
                                            </div>
                                            <div className="wrapper">
                                                <label htmlFor={review.name}>Read more...</label>
                                                <input type="checkbox" id={review.name}/>
                                                <div className="xpandable-block_film">
                                                    <p>{review.body}<br/>
                                                        <div className="name_analyst">
                                                            Аналитик: {review.name}
                                                        </div>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                    <div id="links">
                        <div className="chat link">
                            Перейти в групповой чат по фильму<br/>
                            <Chat history={this.history}/>
                        </div>
                        <div className="vote link">
                            Перейти к голосованием<br/>
                            <Link to="/votes" onClick={this.changeLocation}>
                                <img className="imgDes" src={votes} alt="иллюстрация"/>
                            </Link>
                        </div>
                        <div className="anotherArticle link">
                            Развернуть все статьи аналитиков<br/>
                            <Link to="/articles" onClick={this.changeLocation}>
                                <img className="imgDes" src={article} alt="иллюстрация"/>
                            </Link>
                        </div>
                    </div>

                    <Complaint history={this.history}/>
                    <ComplaintAnswer history={this.history}/>
                </div>

            );
        } else {
            return (
                <div>
                    <div>
                        <h1>You are already logged</h1>
                        <div className="buttonHolder">
                            <button onClick={this.logout}>Logout</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}


function mapStateToProps(state) {
    return {
        info: state.infoReducer.info
    }
}


function mapDispatchToProps(dispatch) {
    return {
        setInfo: (info) => {
            dispatch(setInfo(info));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Film);