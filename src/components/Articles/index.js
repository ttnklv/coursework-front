import React from 'react';
import {connect} from "react-redux";
import './Articles.css'
import axios from "axios";
import {setInfo} from "../../actions/setInfo";

class Articles extends React.Component {

    constructor(props) {
        super(props);

        //this.checkLocation = this.checkLocation.bind(this);
        //this.checkLocation();

        this.state = {
            articles: [],
            name: ""
        };

        this.getArticles = this.getArticles.bind(this);
        this.getArticles();

        this.filmInformation = this.filmInformation.bind(this);
        this.filmInformation();
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

    getArticles() {
        let params = new URLSearchParams();
        params.append('film_id', "1");//this.props.info
        axios.get('http://localhost:8080/findTheMostInterestingAnnotation', {
            withCredentials: true,
            params
        })
            .then(res => {
                if (res.status !== 401) {
                    this.setState({articles: res.data});
                }
            }).catch(err => {
            console.log(err);
        });
    }

    checkLocation() {
        if (this.props.info == null || this.props.info === undefined) {
            let params = new URLSearchParams();
            axios.get('http://localhost:8090/getState', {params})
                .then(res => {
                    if (res.status !== 401) {
                        console.log(res.data.id_film);
                        this.props.setInfo(res.data.id_film);
                        this.getArticles();
                        this.filmInformation();
                    }
                }).catch(err => {
                console.log(err);
            });
        } else {
            this.getArticles();
            this.filmInformation();
        }
    }


    render() {

        if (true) {
            return (
                <div>
                    <div id="art">
                        <div id="name_art">{this.state.name}</div>
                        {this.state.articles.map(
                            article => {
                                return (
                                    <div>
                                        <div className="article_list">
                                            <div className="name_analyst">Аналитик: {article.name}</div>
                                            <div className="wrapper">
                                                <label htmlFor={article.name}>Read more...</label>
                                                <input type="checkbox" id={article.name}/>
                                                <div className="xpandable-block">
                                                    <p>
                                                        {article.body}<br/>
                                                        <div className="name_analyst">Оценка: {article.score}</div>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>
            );

        } else {
            return (
                <div>

                    <div>
                        <h1>Homepage</h1>
                        привет
                    </div>
                </div>


            );
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Articles);