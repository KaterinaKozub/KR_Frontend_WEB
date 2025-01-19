import { useDispatch, useSelector } from 'react-redux';
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";
import React from "react";
import { Container } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
    const dispatch = useDispatch(); // Диспетчер Redux
    const isAuth = useSelector(selectIsAuth); // Статус автентифікації

    React.useEffect(() => {
        dispatch(fetchAuthMe()); // Перевірка автентифікації при завантаженні
    }, [dispatch]);

    return (
        <>
            <Header />
            <Container maxWidth="lg">
                <Routes>
                    <Route path="/" element={<Home />} /> {/* Головна сторінка */}
                    <Route path="/posts/:id" element={<FullPost />} /> {/* Повний пост */}
                    <Route path="/posts/:id/edit" element={<AddPost />} /> {/* Редагування поста */}
                    <Route path="/add-post" element={<AddPost />} /> {/* Додати пост */}
                    <Route path="/login" element={<Login />} /> {/* Вхід */}
                    <Route path="/register" element={<Registration />} /> {/* Реєстрація */}
                </Routes>
            </Container>
        </>
    );
}

export default App;

