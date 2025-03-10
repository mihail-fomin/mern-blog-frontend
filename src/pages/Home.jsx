import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { fetchPosts, fetchTags } from '../store/slices/posts'
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

import { API_URI } from './const';

export const Home = () => {
  const dispatch = useDispatch()

  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const { posts, tags } = useSelector(state => state.posts)
  const userData = useSelector(state => state.auth.data)

  const isPostLoading = posts.status === 'loading'
  const areTagsLoading = tags.status === 'loading'

  React.useEffect(() => {
    if (activeTabIndex === 0) {
      dispatch(fetchPosts('latest'));
    } else if (activeTabIndex === 1) {
      dispatch(fetchPosts('popular'));
    }
    dispatch(fetchTags());
  }, [activeTabIndex]);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={activeTabIndex}
        onChange={(event, newValue) => setActiveTabIndex(newValue)}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {isPostLoading ? [...Array(5)] : posts.items.map((post, index) =>
            isPostLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                id={post._id}
                title={post.title}
                imageUrl={post.imageUrl ? `${API_URI}${post.imageUrl}` : ''}
                user={post.user}
                createdAt={post.createdAt}
                viewsCount={post.viewsCount}
                commentsCount={3}
                tags={post.tags}
                isEditable={userData?._id === post.user._id}
              />
            ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={areTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
