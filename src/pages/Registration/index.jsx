import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import { useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { fetchRegisterData, isAuthSelect } from "../../store/slices/auth";

import styles from './Login.module.scss';

const validationSchema = yup.object().shape({
  email: yup.string().email('Введите корректный email').required('Email обязателен'),
  password: yup
    .string()
    .min(5, 'Минимальная длина пароля - 5 символов')
    .required('Пароль обязателен'),
  fullName: yup
    .string()
    .matches(/^[A-Za-zа-яА-Я ]*$/, 'Поажлуйста, введите корректное Имя')
    .max(40)
    .required('Имя обязательно'),
});


export const Registration = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(isAuthSelect)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: 'Михаил',
      email: 'test123@test.ru',
      password: '12345',
      avatarUrl: 'https://redux-toolkit.js.org/tutorials/typescript'
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegisterData(values))

    if (!data.payload) {
      return alert('Не удалось зарегистрироваться!')
    }
  }

  if (isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName')}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email')}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password')}
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
