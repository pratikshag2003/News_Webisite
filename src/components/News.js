import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

import InfiniteScroll from "react-infinite-scroll-component";
import shortid from 'shortid';







export class News extends Component {


    static defaultProps = {
       country: 'us',
       pageSize: 8,
       category:'general',
       apiKey: process.env.REACT_APP_NEWS_API
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }



   
    capitalizeFirstLetter=(string)=>{
        return string.charAt(0).toUpperCase()+string.slice(1);
    }





    constructor(props){
        super(props);
        console.log("Yeah this is another version of mine:)");
        
        this.state = {
            articles: [],
            loading: false,
            page:1,
            totalResults: 0

        }

      
       document.title=`${this.capitalizeFirstLetter(this.props.category)} - NewsWallah`;
    }

   async updateNews(){
    this.props.setProgress(10);
    const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading: true});
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData=await data.json()
    this.props.setProgress(50);
    console.log(parsedData);
  
    this.setState({
        totalResults: parsedData.totalResults,
        articles: parsedData.articles,
        loading: false
    })
    this.props.setProgress(100);
   }


   async componentDidMount(){
        this.updateNews();
    }



    handlePrevClick= async ()=>{
        this.setState({page: this.state.page-1})
        this.updateNews();
    }

    handleNextClick= async ()=>{
        this.setState({page: this.state.page+1})
        this.updateNews()
    }


    fetchMoreData = async () => {
        this.setState({page: this.state.page+1});
        const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parsedData=await data.json()
        console.log(parsedData);
        this.setState({
            totalResults: parsedData.totalResults,
            articles: this.state.articles.concat(parsedData.articles)
        })
    };
    


    render() {
        return (
            <>
                <h1 className="text-center" style={{margin:'35px 0px'}}>NewsWallah - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
                {this.state.loading && <Spinner/>}

                <div>{this.props.apiKey}</div>

                {

                    this.state.articles ?
                    
                        <InfiniteScroll
                        dataLength={this.state.articles.length}
                        next={this.fetchMoreData}
                        hasMore={this.state.articles.length !== this.state.totalResults}
                        loader={<Spinner/>}>


                    
                        <div className="container">
                        <div className="row">

                        {this.state.articles.map((element)=>{
                            return <div className="col-md-4" key={shortid.generate()}>
                            <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsurl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                            </div>
                        })}    
                        </div>
                        </div>
                        </InfiniteScroll>
                        :
                        <div>
                            Nothing to show
                        </div>

                }
             </>
        )
    }
}

export default News












