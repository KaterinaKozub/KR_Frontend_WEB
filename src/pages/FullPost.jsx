import React from "react";
import { useParams } from 'react-router-dom';
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
    const [data, setData] = React.useState(null);  // Состояние для хранения данных поста
    const [isLoading, setLoading] = React.useState(true);  // Состояние для индикатора загрузки
    const { id } = useParams();  // Получаем id поста из URL

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/posts/${id}`);  // Получаем данные поста по id
                setData(res.data);  // Сохраняем полученные данные
            } catch (err) {
                console.log(err);  // Логирование ошибок
                alert('Помилка');  // Показ ошибки пользователю
            } finally {
                setLoading(false);  // Останавливаем индикатор загрузки
            }
        };

        fetchData();  // Вызов функции загрузки данных
    }, [id]);  // Эффект сработает при изменении id в URL

    if (isLoading) {
        // Пока данные загружаются, показываем скелетон
        return <Post isLoading={isLoading} isFullPost />;
    }

    if (!data) {
        // Если данные не получены, показываем ошибку
        return <p>Помилка завантаження даних</p>;
    }

    return (
        <>
            {/* Основной блок с постом */}
            <Post
                id={data._id}
                title={data.title}
                imageUrl={`http://localhost:4444${data.imageUrl}`}  // Путь к картинке
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={data.commentsCount || 0}  // Количество комментариев, если есть
                tags={data.tags}
                isFullPost  // Отметка, что это полный пост
            >
                {/* Отображаем текст поста с использованием ReactMarkdown для Markdown разметки */}
                <ReactMarkdown children={data.text} />
            </Post>

            {/* Блок комментариев */}
            <CommentsBlock items={data.comments || []} isLoading={isLoading}>
                {/* Компонент для добавления комментариев */}
                <Index />
            </CommentsBlock>
        </>
    );
};
