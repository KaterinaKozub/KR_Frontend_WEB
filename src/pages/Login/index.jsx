import React from "react";
import {useDispatch, useSelector} from 'react-redux'
import {Navigate} from 'react-router-dom'
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from 'react-hook-form'

import styles from "./Login.module.scss";
import {fetchAuth, selectIsAuth} from "../../redux/slices/auth";

export const Login = () => {
    const isAuth = useSelector(selectIsAuth)
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState:{ errors, isValid}
    } = useForm({
        defaultValues: {
            email: "kkozub13@gmail.com",
            password: "190304Kate",
        },
        mode: 'onSubmit'
    })


    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values))

        if (!data.payload){
            return alert('Не вдалося авторизуватись')
        }


        if('token' in data.payload){
            window.localStorage.setItem('token', data.payload.token)
        }
    };



    if(isAuth){
        return <Navigate to="/" />
    }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
          Вхід до облікового запису
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
              className={styles.field}
              label="E-Mail"
              error = {Boolean(errors.email?.message)}
              helperText={errors.email?.message}
              {...register('email', {required: 'Вкажіть пошту'})}
              fullWidth
          />
          <TextField
              className={styles.field}
              label="Пароль"
              error = {Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              {...register('password', {required: 'Вкажіть пароль'})}
              fullWidth />
          <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
              Увійти
          </Button>
      </form>
    </Paper>
  );
};
