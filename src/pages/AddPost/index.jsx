import React from 'react';
import { useSelector } from 'react-redux';
import { isAuthSelect } from '../../store/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from '../../services/axios';
import { API_URI } from '../const';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const { id } = useParams()
  const isAuth = useSelector(isAuthSelect)
  const navigate = useNavigate()

  const isEditing = Boolean(id)

  const [isLoading, setIsLoading] = React.useState(false)
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');

  const inputFileRef = React.useRef(null)

  const handleChangeFile = async (event) => {
    try {
      // Создаем объект FormData для отправки файла на сервер
      const formData = new FormData();
      // Получаем выбранный файл из события
      const file = event.target.files[0];
      // Добавляем файл в объект FormData под именем 'image'
      formData.append('image', file);
      // Отправляем файл на сервер с помощью POST-запроса
      const { data } = await axios.post('/upload', formData);
      // Устанавливаем URL изображения, полученного от сервера, в состояние (state) компонента
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert('Ошибка при загрузке файла')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('')
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true)

      const fields = {
        title,
        imageUrl,
        tags,
        text
      }

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields)

      console.log('data: ', data);
      const _id = isEditing
        ? id // если в редактировании, то возввращается id из адресной строки
        : data._id // иначе - тот _id, что мы вытащили из post-запроса

      navigate(`/posts/${_id}`)
    } catch (error) {
      console.error(error);
      alert('Ошибка при создании статьи')
    }
  }


  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title)
        setText(data.text)
        setTags(data.tags.join(' '))
        setImageUrl(data.imageUrl)
      }).catch(err => {
        console.error(err)
        alert('Ошибка при получении статьи')
      })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`${API_URI}${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        value={tags}
        onChange={e => setTags(e.target.value)}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
