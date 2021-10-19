import './styles.css';
import { Component } from 'react';
import {loadPosts} from "../../utils/load-post"
import {Posts} from "../../components/Posts"
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';


class Home extends Component{
  state = {
    posts:[],
    allPosts:[],
    page:0,
    postPerPage:10,
    searchValue:""
  }

  async componentDidMount(){
    await this.loadPosts()
  }


  loadPosts = async() => {
      const {page, postPerPage, allPosts} = this.state
      const postsAndPhotos = await loadPosts()
      this.setState({
        posts: postsAndPhotos.slice(page, postPerPage),
        allPosts: postsAndPhotos
      })
  }

  loadMorePost = () => {
    const {
      page,
      postPerPage,
      allPosts,
      posts
    } = this.state

    const nextPage = page + postPerPage
    const nextPosts = allPosts.slice(nextPage, nextPage
       + postPerPage)
    posts.push(...nextPosts)
    
    this.setState({posts, page:nextPage})
  }

  noMorePosts = () => {
    const {page, postPerPage, allPosts} = this.state
    return page + postPerPage >= allPosts.length
  }

  handleChange = (e) => {
      const {value} = e.target
      this.setState({searchValue: value})
  }

  render(){
      const {posts, searchValue, allPosts} = this.state

      const filteredPosts = !!searchValue ?
      allPosts.filter(post => {
        return post.title.toLowerCase().includes(
          searchValue.toLowerCase()
        )
      })
      : posts

      return (
        <section className="container">
          <div className="search-container">
            {!!searchValue && (
              <>
                <h1>Search value: {searchValue}</h1>
              </>    
            )}
            <TextInput searchValue={searchValue} handleChange={this.handleChange}/>
          </div>

            {filteredPosts.length > 0 && <Posts posts={filteredPosts}/>}
            
            {filteredPosts.length == 0 && <p>Não existem posts</p>}
            

            <div className="button-container">
              {!searchValue && (
                  <Button 
                  text="Load More Posts"
                  onClick={this.loadMorePost}
                  disabled={this.noMorePosts()}
                  />
              )}
            </div>


        </section>

      )
  }

}

export default Home;
