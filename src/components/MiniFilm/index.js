import React from 'react';
import {connect} from "react-redux";
import axios from "axios";
import {setInfo} from "../../actions/setInfo";
import {setReview} from "../../actions/setReview";
import './MiniFilm.css'
import debate from "./img/debate.png"
import {Link} from "react-router-dom";


class MiniFilm extends React.Component {

    constructor(props) {
        super(props);
        this.filmInformation = this.filmInformation.bind(this);
        this.filmInformation();

        this.filmReview = this.filmReview.bind(this);
        this.filmReview();

        //this.changeFilmId = this.changeFilmId.bind(this);

        this.state = {
            idFilm: 1,
            test: [],
            review: [],
            filmInfo: ""
        };
    }

    filmInformation() {
        let params = new URLSearchParams();
        params.append('film_id', "1");
        axios.get('http://localhost:8080/getMainInfoOfTehFilm', {
            withCredentials: true,
            params
        })
            .then(res => {
                if (res.status !== 401) {
                    console.log("отправленно");
                    // this.props.setInfo(res.data);
                    this.setState({info: res.data});
                    this.arrayOfPhoto();
                    console.log(res);
                }
            }).catch(err => {
            alert(err);
            return false;
        });
    }

    filmReview() {
        let film_id = 1;
        const url = 'http://localhost:8080/findTheMostInterestingAnnotation?film_id=' + film_id;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({review: [data[0], data[1], data[2]]});
                console.log(url);
            });
    }

    arrayOfPhoto() {
        let params = new URLSearchParams();
        params.append('film_id', "1");
        return axios.get('http://localhost:8090/getPhotosAsString', {
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

    changeFilmId() {
        this.props.setInfo(this.state.idFilm);

        let params = new URLSearchParams();
        params.append('id_user', "1");
        params.append('id_film', this.props.info);
        axios.get('http://localhost:8090/setState', {
            withCredentials: true,
            params
        });
    }

    render() {
        if (this.state.info) {
            return (
                <div>
                    <Link to="/" onClick={this.changeFilmId}>
                        <div className="nameMini">{this.state.info.name}</div>
                    </Link>
                    <img id="mainPicMini" src={this.state.test[0]} alt="иллюстрация"/>

                    <div className="rankMini">
                        <div className="numberMini circleMini">{this.state.info.score}</div>
                        <div>Рейтинг фильма</div>
                    </div>

                    <div className="yourScoreMini">
                        <div>Ваша оценка</div>
                        <div className="circleMini">
                            <div className="numberMini">{this.state.info.userScore}</div>
                        </div>
                    </div>

                    <img className="imgMini" src={debate} alt="иллюстрация"/>
                    <div id="mainInfoTitleMini">Основная информация</div>
                    <div className="mainInfoMini">{this.state.info.body} </div>


                    {
                        this.state.review.map(
                            review => {
                                return (
                                    <div className="article_mini">
                                        <div className="numberMini">
                                            {review.score}%
                                        </div>
                                        <div className="wrapper">
                                            <label htmlFor={review.name}>Read more...</label>
                                            <input type="checkbox" id={review.name}/>
                                            <div className="xpandable-block_film">
                                                <p>{review.body}<br/>
                                                    Аналитик: {review.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        )
                    }
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
        info: state.infoReducer.info,
        review: state.reviewReducer.review
    }
}


function mapDispatchToProps(dispatch) {
    return {
        setInfo: (info) => {
            dispatch(setInfo(info));
        },
        setReview: (review) => {
            dispatch(setReview(review));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MiniFilm);