import React from "react";
import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../services/axios";
import { API_URI } from "./const";

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import styles from '../components/Post/Post.module.scss';
import { fetchRemovePosts } from "../store/slices/posts";

export const FullPost = () => {
  const [data, setData] = React.useState()
  const [isLoading, setIsLoading] = React.useState(true)
  const userData = useSelector(state => state.auth.data)

  const dispatch = useDispatch()

  const { id } = useParams()

  React.useEffect(() => {
    axios.get(`/posts/${id}`).then(res => {
      setData(res.data)
      setIsLoading(false)
    })
      .catch(error => {
        console.warn(error);
        alert('Ошибка при получении статьи')
      })
  }, [])

  const onClickRemove = () => {
    if (window.confirm('Вы дейстивтельно хотите удалить статью?')) {
      dispatch(fetchRemovePosts(id))
    }
  };

  const isEditable = userData?._id === data?.user._id
  console.log('isEditable: ', isEditable);


  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />
  }


  return (
    <>
      <Link to={`/posts/${id}/edit`}>
        <IconButton color="primary">
          <EditIcon />
        </IconButton>
      </Link>
      <IconButton onClick={onClickRemove} color="secondary">
        <DeleteIcon />
      </IconButton>

      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `${API_URI}${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <p>{data.text}</p>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Это тестовый комментарий 555555",
          },
          {
            user: {
              fullName: "Иван Иванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
