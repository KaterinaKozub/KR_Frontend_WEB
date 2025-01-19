import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import axios from "../../axios";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { selectIsAuth } from "../../redux/slices/auth";

export const AddPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const [isLoading, setLoading] = React.useState(false);
    const [text, setText] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [tags, setTags] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const [error, setError] = React.useState(null);

    const inputFileRef = React.useRef(null);

    const isEditing = Boolean(id);

    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const { data } = await axios.post(`/upload`, formData);
            setImageUrl(data.url);
        } catch (err) {
            console.warn(err);
            const errorMessage = err.response ? err.response.data.message : 'Помилка';
            alert(errorMessage);
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('');
    };

    const onChange = React.useCallback((value) => {
        setText(value);
    }, []);

    const onSubmit = async () => {
        if (!title || !text) {
            alert('Заповніть всі обов\'язкові поля');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formattedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            const fields = { title, tags: formattedTags, imageUrl, text };

            const { data } = isEditing
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post('/posts', fields);

            const _id = isEditing ? id : data._id;
            navigate(`/posts/${_id}`);
        } catch (err) {
            console.warn(err);
            setError('Помилка при створенні статті');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (id) {
            setLoading(true);
            axios
                .get(`/posts/${id}`)
                .then(({ data }) => {
                    setTitle(data.title);
                    setText(data.text);
                    setTags(data.tags.join(', '));
                    setImageUrl(data.imageUrl);
                })
                .catch(err => {
                    console.warn(err);
                    alert('Помилка при завантаженні статті');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    const options = React.useMemo(() => ({
        spellChecker: false,
        maxHeight: '400px',
        autofocus: true,
        placeholder: 'Введите текст...',
        status: false,
        autosave: {
            enabled: true,
            delay: 1000,
        },
    }), []);

    if (!isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <Paper style={{ padding: 30 }}>
            <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
                Завантажити прев'ю
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
            {imageUrl && (
                <>
                    <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                        Удалить
                    </Button>
                    <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
                </>
            )}
            <br /><br />
            <TextField
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Заголовок статті..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
            />
            <TextField
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                classes={{ root: styles.tags }}
                variant="standard"
                placeholder="Теги"
                fullWidth
            />
            <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained" disabled={isLoading}>
                    {isEditing ? 'Зберегти' : 'Опубліковати'}
                </Button>
                <a href="/">
                    <Button size="large">Скасування</Button>
                </a>
            </div>
            {error && <p className="error">{error}</p>}
        </Paper>
    );
};
