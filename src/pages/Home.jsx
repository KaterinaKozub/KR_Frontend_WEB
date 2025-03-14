import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';


import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import {fetchPosts, fetchTags} from "../redux/slices/posts";


export const Home = () => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.data);
    const {posts, tags} = useSelector(state => state.posts);

    const  isPostsLoading = posts.status === 'loading';
    const  isTagsLoading = posts.status === 'loading';



    React.useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags())
    },[dispatch])



  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Нові" />

      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
            {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
                isPostsLoading ? (
                    <Post key={index} isLoading={true} />
                ) : (
                    obj.user && obj._id ? (
                        <Post
                            key={obj._id}
                            id={obj._id}
                            title={obj.title}
                            imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                            user={obj.user}
                            createdAt={obj.createdAt}
                            viewsCount={obj.viewsCount}
                            commentsCount={3}
                            tags={obj.tags}
                            isEditable={userData?._id === obj.user._id}
                        />
                    ) : null // Якщо користувача або _id немає, не рендеримо компонент
                )
            )}

        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
          />
        </Grid>
      </Grid>
    </>
  );
};
